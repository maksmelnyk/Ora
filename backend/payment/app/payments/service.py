from decimal import Decimal
from typing import List
from uuid import UUID

from app.payments.schemas import PaymentCreateRequest, PaymentResponse
from app.payments.repository import PaymentRepository
from app.payments.transaction import Transaction, TransactionStatus


class PaymentService:
    def __init__(self, repo: PaymentRepository) -> None:
        self.repo: PaymentRepository = repo

    async def get_my_payments(
        self, user_id: UUID, skip: int, take: int
    ) -> List[PaymentResponse]:
        payments: List[Transaction] = await self.repo.get_transactions_by_user_id(
            user_id=user_id, skip=skip, take=take
        )
        payment_responses: List[PaymentResponse] = [
            PaymentResponse(
                id=p.id, amount=p.amount, currency=p.currency, status=p.status
            )
            for p in payments
        ]
        return payment_responses

    async def create_payment(
        self, user_id: UUID, request: PaymentCreateRequest
    ) -> PaymentResponse:
        new_transaction = Transaction(
            user_id=user_id,
            session_id=request.session_id,
            provider_id=request.provider_id,  # TODO: Add validation
            provider_reference_id="Ref123456",  # TODO: Add payment provide call
            amount=Decimal(value="100.00"),  # TODO: Add later
            currency="USD",  # TODO: Add later
        )

        id: int = await self.repo.create_transaction(transaction=new_transaction)
        await self.complete_payment(transaction_id=id)
        return PaymentResponse(
            id=id,
            amount=new_transaction.amount,
            currency=new_transaction.currency,
            status=new_transaction.status,
        )

    async def complete_payment(self, transaction_id: int) -> None:
        exists: bool = await self.repo.transaction_exists(transaction_id=transaction_id)
        if exists is False:
            return

        await self.repo.update_transaction_status(
            transaction_id=transaction_id, status=TransactionStatus.COMPLETED
        )
