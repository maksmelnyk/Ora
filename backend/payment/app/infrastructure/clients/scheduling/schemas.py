from typing import Optional
from pydantic import BaseModel, Field


class ScheduledEventMetadataRequest(BaseModel):
    product_id: int = Field(alias="productId")
    lesson_ids: list[int] | None = Field(alias="lessonIds")
    scheduled_event_id: Optional[int] = Field(alias="scheduledEventId")

    class Config:
        allow_population_by_field_name = True


class ScheduledEventMetadataResponse(BaseModel):
    is_valid: bool = Field(alias="isValid")
    error_message: str = Field(alias="errorMessage")

    class Config:
        allow_population_by_field_name = True
