from typing import Annotated, List
from uuid import UUID
from fastapi import APIRouter, Depends, Response, status, Request

from app.payments.dependencies import get_payment_service
from app.payments.service import PaymentService
from app.payments.schemas import PaymentCreateRequest, PaymentResponse

from fastapi import APIRouter, Request, status, Depends
from typing import List
from uuid import UUID
from typing_extensions import Annotated

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
    user_id: UUID = request.state.user_id
    result: List[PaymentResponse] = await service.get_my_payments(
        user_id=user_id, skip=skip, take=take
    )
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
    user_id: UUID = request.state.user_id
    await service.create_payment(
        user_id=user_id,
        request=payment,
        auth_header=request.headers.get("Authorization"),
    )
    return Response(status_code=status.HTTP_204_NO_CONTENT)
