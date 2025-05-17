from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.database.config import get_db_session
from app.infrastructure.identity.current_user import CurrentUser, get_current_user
from app.infrastructure.messaging.dependencies import get_publisher
from app.infrastructure.messaging.publisher import Publisher
from app.infrastructure.clients.products.service import ProductServiceClient
from app.infrastructure.clients.scheduling.dependencies import (
    get_scheduled_event_metadata_service,
)
from app.infrastructure.clients.scheduling.service import SchedulingServiceClient
from app.infrastructure.clients.products.dependencies import (
    get_product_purchase_metadata_service,
)

from app.features.payment.repository import PaymentRepository
from app.features.payment.service import PaymentService


def get_payment_repository(
    session: AsyncSession = Depends(dependency=get_db_session),
) -> PaymentRepository:
    return PaymentRepository(session=session)


def get_payment_service(
    current_user: CurrentUser = Depends(dependency=get_current_user),
    repo: PaymentRepository = Depends(dependency=get_payment_repository),
    product_client: ProductServiceClient = Depends(
        dependency=get_product_purchase_metadata_service
    ),
    scheduling_client: SchedulingServiceClient = Depends(
        dependency=get_scheduled_event_metadata_service
    ),
    publisher: Publisher = Depends(dependency=get_publisher),
) -> PaymentService:
    return PaymentService(
        current_user=current_user,
        repo=repo,
        product_client=product_client,
        scheduling_client=scheduling_client,
        publisher=publisher,
    )
