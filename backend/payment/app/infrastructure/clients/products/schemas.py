from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, Field, model_validator


class ProductPurchaseMetadataRequest(BaseModel):
    scheduled_event_id: Optional[int] = Field(default=..., alias="scheduledEventId")

    class Config:
        allow_population_by_field_name = True


class ProductPurchaseMetadataResponse(BaseModel):
    can_purchase: bool = Field(alias="canPurchase")
    scheduling_required: bool = Field(alias="schedulingRequired")
    price: Decimal = Field(alias="price")
    expected_scheduled_event_id: Optional[int] = Field(alias="expectedScheduledEventId")
    expected_scheduled_lesson_ids: list[int] | None = Field(
        alias="expectedScheduledLessonIds"
    )
    error_message: str | None = Field(alias="errorMessage")

    class Config:
        allow_population_by_field_name = True

    @model_validator(mode="after")
    def check_scheduling_options(self) -> "ProductPurchaseMetadataResponse":
        if self.scheduling_required is False:
            return self

        has_lesson: bool = (
            self.expected_scheduled_lesson_ids is not None
            and len(self.expected_scheduled_lesson_ids) > 0
        )

        has_event: bool = self.expected_scheduled_event_id is not None

        is_valid: bool = has_lesson or has_event

        if not is_valid:
            raise ValueError(
                "Validation failed: Either 'expected_scheduled_lesson_ids' must contain more than one item "
                "or 'expected_scheduled_event_event_id' must be provided."
            )

        return self
