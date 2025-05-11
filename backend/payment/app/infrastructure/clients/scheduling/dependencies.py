from fastapi import Depends
from httpx import AsyncClient

from app.config.settings import ExternalServiceSettings, get_external_service_settings
from app.infrastructure.dependencies import get_http_client
from app.infrastructure.clients.scheduling.service import SchedulingServiceClient


def get_scheduled_event_metadata_service(
    settings: ExternalServiceSettings = Depends(
        dependency=get_external_service_settings,
    ),
    http_client: AsyncClient = Depends(dependency=get_http_client),
) -> SchedulingServiceClient:
    return SchedulingServiceClient(stg=settings, http_client=http_client)
