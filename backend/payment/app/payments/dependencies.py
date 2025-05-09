from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database.config import get_db_session
from app.core.messaging.dependencies import get_publisher
from app.core.messaging.publisher import Publisher
from app.payments.repository import PaymentRepository
from app.payments.service import PaymentService
from app.products.dependencies import get_product_purchase_metadata_service
from app.products.service import ProductServiceClient
from app.scheduling.dependencies import get_scheduled_event_metadata_service
from app.scheduling.service import SchedulingServiceClient


def get_payment_repository(
    session: AsyncSession = Depends(dependency=get_db_session),
) -> PaymentRepository:
    return PaymentRepository(session=session)


def get_payment_service(
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
        repo=repo,
        product_client=product_client,
        scheduling_client=scheduling_client,
        publisher=publisher,
    )
