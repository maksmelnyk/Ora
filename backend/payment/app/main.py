import logging

from sqlalchemy import text
from fastapi import FastAPI
from contextlib import asynccontextmanager
from typing import AsyncIterator

from app.core.config import Settings
from app.core.database import engine
from app.core.dependencies import get_settings, get_token_validator
from app.middlewares.auth import AuthMiddleware
from app.middlewares.logging import RequestLoggingMiddleware
from app.payments.router import router as payment_router
from app.exceptions.exception_handlers import setup_exception_handlers

settings: Settings = get_settings()
logger: logging.Logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Application lifespan context manager."""
    try:
        async with engine.connect() as conn:
            await conn.execute(statement=text("SELECT 1"))
        logger.info(msg="Database connection verified.")
    except Exception as e:
        logger.error(msg=f"Database connection failed: {e}")
        raise e

    yield

    await engine.dispose()
    logger.info(msg="Database connections closed.")


app = FastAPI(
    lifespan=lifespan,
    title=settings.app.NAME,
    version=settings.app.VERSION,
    debug=settings.app.DEBUG,
)


app.add_middleware(middleware_class=RequestLoggingMiddleware)
app.add_middleware(middleware_class=AuthMiddleware, validator=get_token_validator())

setup_exception_handlers(app)

app.include_router(router=payment_router, prefix="/api/v1/payments")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app=app, host="0.0.0.0", port=int(settings.app.PORT))
