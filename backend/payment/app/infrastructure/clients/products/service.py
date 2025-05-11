from typing import Optional
from httpx import AsyncClient, Response

from app.config.settings import ExternalServiceSettings
from app.infrastructure.clients.products.schemas import (
    ProductPurchaseMetadataRequest,
    ProductPurchaseMetadataResponse,
)


class ProductServiceClient:
    def __init__(self, stg: ExternalServiceSettings, http_client: AsyncClient) -> None:
        self.base_url: str = stg.learning_service_url
        self.http_client: AsyncClient = http_client

    async def get_product_purchase_metadata(
        self, product_id: int, scheduled_event_id: Optional[int], auth_header: str
    ) -> ProductPurchaseMetadataResponse:
        payload = ProductPurchaseMetadataRequest(scheduledEventId=scheduled_event_id)

        response: Response = await self.http_client.post(
            url=f"{self.base_url}/api/v1/products/{product_id}/purchase-metadata",
            headers={"Authorization": auth_header},
            json=payload.model_dump(by_alias=True),
        )

        if response.status_code != 200:
            raise Exception(f"Failed to fetch product info: {response.status_code}")

        return ProductPurchaseMetadataResponse.model_validate(obj=response.json())
