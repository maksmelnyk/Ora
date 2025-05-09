from fastapi import Depends
from httpx import AsyncClient

from app.core.config.settings import ExternalServiceSettings
from app.core.dependencies import get_external_service_settings, get_http_client
from app.products.service import ProductServiceClient


def get_product_purchase_metadata_service(
    settings: ExternalServiceSettings = Depends(
        dependency=get_external_service_settings,
    ),
    http_client: AsyncClient = Depends(dependency=get_http_client),
) -> ProductServiceClient:
    return ProductServiceClient(stg=settings, http_client=http_client)
