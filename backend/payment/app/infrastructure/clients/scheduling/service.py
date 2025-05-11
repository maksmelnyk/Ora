from typing import Optional
from httpx import AsyncClient, Response

from app.config.settings import ExternalServiceSettings
from app.infrastructure.clients.scheduling.schemas import (
    ScheduledEventMetadataRequest,
    ScheduledEventMetadataResponse,
)


class SchedulingServiceClient:
    def __init__(self, stg: ExternalServiceSettings, http_client: AsyncClient) -> None:
        self.base_url: str = stg.scheduling_service_url
        self.http_client: AsyncClient = http_client

    async def get_scheduled_event_metadata(
        self,
        product_id: int,
        scheduled_event_id: Optional[int],
        lesson_ids: list[int] | None,
        auth_header: str,
    ) -> ScheduledEventMetadataResponse:
        payload = ScheduledEventMetadataRequest(
            productId=product_id,
            lessonIds=lesson_ids,
            scheduledEventId=scheduled_event_id,
        )

        response: Response = await self.http_client.post(
            url=f"{self.base_url}/api/v1/schedules/scheduled-events/metadata",
            headers={"Authorization": auth_header},
            json=payload.model_dump(by_alias=True),
        )

        if response.status_code != 200:
            raise Exception(f"Failed to fetch product info: {response.status_code}")

        return ScheduledEventMetadataResponse.model_validate(obj=response.json())
