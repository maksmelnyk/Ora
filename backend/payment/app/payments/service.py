from typing import List
from uuid import UUID

from app.core.messaging.constants import RabbitMqConstants
from app.core.messaging.events import (
    BookingCreationRequestedEvent,
    PaymentCompletedEvent,
)
from app.core.messaging.publisher import Publisher
from app.payments.schemas import PaymentCreateRequest, PaymentResponse
from app.payments.repository import PaymentRepository
from app.payments.transaction import Transaction, TransactionStatus
from app.products.schemas import ProductPurchaseMetadataResponse
from app.products.service import ProductServiceClient
from app.scheduling.schemas import ScheduledEventMetadataResponse
from app.scheduling.service import SchedulingServiceClient


class PaymentService:
    def __init__(
        self,
        repo: PaymentRepository,
        product_client: ProductServiceClient,
        scheduling_client: SchedulingServiceClient,
        publisher: Publisher,
    ) -> None:
        self.repo: PaymentRepository = repo
        self.product_client: ProductServiceClient = product_client
        self.scheduling_client: SchedulingServiceClient = scheduling_client
        self.publisher: Publisher = publisher

    async def get_my_payments(
        self, user_id: UUID, skip: int, take: int
    ) -> List[PaymentResponse]:
        payments: List[Transaction] = await self.repo.get_transactions_by_user_id(
            user_id=user_id, skip=skip, take=take
        )
        payment_responses: List[PaymentResponse] = [
            PaymentResponse(
                id=p.id, price=p.price, currency=p.currency, status=p.status
            )
            for p in payments
        ]
        return payment_responses

    async def create_payment(
        self, user_id: UUID, request: PaymentCreateRequest, auth_header: str | None
    ) -> None:
        if auth_header is None:
            raise ValueError("Authorization header is missing")

        product_info: ProductPurchaseMetadataResponse = (
            await self.product_client.get_product_purchase_metadata(
                product_id=request.product_id,
                scheduled_event_id=request.scheduled_event_id,
                auth_header=auth_header,
            )
        )

        if product_info.can_purchase is False:
            raise ValueError("Product cannot be purchased")

        if product_info.error_message:
            raise ValueError(product_info.error_message)

        if product_info.scheduling_required:
            scheduling_info: ScheduledEventMetadataResponse = (
                await self.scheduling_client.get_scheduled_event_metadata(
                    product_id=request.product_id,
                    scheduled_event_id=product_info.expected_scheduled_event_id,
                    lesson_ids=product_info.expected_scheduled_lesson_ids,
                    auth_header=auth_header,
                )
            )
            if scheduling_info.is_valid is False:
                raise ValueError(scheduling_info.error_message)

        new_transaction = Transaction(
            user_id=user_id,
            product_id=request.product_id,
            scheduled_event_id=request.scheduled_event_id,
            price=product_info.price,
            status=TransactionStatus.PENDING,
            provider_id=request.provider_id,  # TODO: Add later
            provider_reference_id="Ref123456",  # TODO: Add later
            currency="USD",  # TODO: Add later
        )

        id: int = await self.repo.create_transaction(transaction=new_transaction)
        await self.complete_payment(
            transaction_id=id,
            lesson_ids=product_info.expected_scheduled_lesson_ids,
            scheduling_required=product_info.scheduling_required,
        )

    async def complete_payment(
        self,
        transaction_id: int,
        lesson_ids: List[int] | None = None,
        scheduling_required: bool = False,
    ) -> None:
        transaction: Transaction | None = await self.repo.get_transaction_by_id(
            transaction_id=transaction_id
        )
        if transaction is None:
            return

        await self.repo.update_transaction_status(
            transaction_id=transaction_id, status=TransactionStatus.COMPLETED
        )

        await self.publisher.publish_event(
            routing_key=RabbitMqConstants.PAYMENT_COMPLETED_KEY,
            event=PaymentCompletedEvent(
                userId=str(object=transaction.user_id),
                productId=transaction.product_id,
                scheduledEventId=transaction.scheduled_event_id,
            ),
        )

        if scheduling_required is True:
            await self.publisher.publish_event(
                routing_key=RabbitMqConstants.BOOKING_CREATION_REQUESTED_KEY,
                event=BookingCreationRequestedEvent(
                    userId=str(object=transaction.user_id),
                    scheduledEventId=transaction.scheduled_event_id,
                    lessonIds=lesson_ids,
                ),
            )
