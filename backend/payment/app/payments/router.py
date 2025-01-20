from typing import Annotated
from uuid import UUID
from fastapi import APIRouter, Depends, status, Request

from app.payments.dependencies import get_payment_service
from app.payments.service import PaymentService
from app.payments.schemas import PaymentCreateRequest, PaymentResponse

router = APIRouter()


@router.post(
    path="/", response_model=PaymentResponse, status_code=status.HTTP_201_CREATED
)
async def create_payment(
    request: Request,
    payment: PaymentCreateRequest,
    service: Annotated[PaymentService, Depends(dependency=get_payment_service)],
) -> PaymentResponse:
    user_id: UUID = request.state.user_id
    result: PaymentResponse = await service.create_payment(
        user_id=user_id, request=payment
    )
    return result
