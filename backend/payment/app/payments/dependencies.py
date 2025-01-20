from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db_session
from app.payments.repository import PaymentRepository
from app.payments.service import PaymentService


def get_payment_repository(
    session: AsyncSession = Depends(dependency=get_db_session),
) -> PaymentRepository:
    return PaymentRepository(session=session)


def get_payment_service(
    repo: PaymentRepository = Depends(dependency=get_payment_repository),
) -> PaymentService:
    return PaymentService(repo=repo)
