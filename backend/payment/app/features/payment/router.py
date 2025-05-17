from typing import Annotated, List
from fastapi import APIRouter, Depends, Response, status, Request
from typing_extensions import Annotated

from app.features.payment.dependencies import get_payment_service
from app.features.payment.service import PaymentService
from app.features.payment.schemas import PaymentCreateRequest, PaymentResponse

router = APIRouter()


@router.get(
    path="/my",
    response_model=List[PaymentResponse],
    status_code=status.HTTP_200_OK,
    summary="Retrieve My Payments",
    description="Retrieves a paginated list of payments for the currently authenticated user using the provided 'skip' and 'take' query parameters.",
)
async def get_my_payments(
    request: Request,
    service: Annotated[PaymentService, Depends(dependency=get_payment_service)],
    skip: int = 0,
    take: int = 10,
) -> List[PaymentResponse]:
    result: List[PaymentResponse] = await service.get_my_payments(skip=skip, take=take)
    return result


@router.post(
    path="/",
    response_model=PaymentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Payment",
    description="Creates a new payment for the authenticated user",
)
async def create_payment(
    request: Request,
    payment: PaymentCreateRequest,
    service: Annotated[PaymentService, Depends(dependency=get_payment_service)],
) -> Response:
    await service.create_payment(
        request=payment,
        auth_header=request.headers.get("Authorization"),
    )
    return Response(status_code=status.HTTP_204_NO_CONTENT)
