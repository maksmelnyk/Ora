from decimal import Decimal
from pydantic import BaseModel, Field, field_validator
from typing import Dict, Optional, Type, Any, Callable


class PaymentCreateRequest(BaseModel):
    product_id: int = Field(alias="productId")
    scheduled_event_id: Optional[int] = Field(alias="scheduledEventId")
    provider_id: int = Field(alias="providerId")

    @field_validator("product_id", "provider_id")
    def must_be_greater_than_zero(cls, value: int) -> int:
        if value <= 0:
            raise ValueError("Must be greater than zero")
        return value

    class Config:
        allow_population_by_field_name = True


class PaymentResponse(BaseModel):
    id: int = Field(alias="id")
    price: Decimal = Field(alias="price")
    currency: str = Field(alias="currency")
    status: str = Field(alias="status")

    class Config:
        allow_population_by_field_name = True
        json_encoders: Dict[Type[Any], Callable[[Any], Any]] = {
            Decimal: lambda v: str(object=v),
        }
