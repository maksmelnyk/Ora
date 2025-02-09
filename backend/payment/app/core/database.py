from sqlalchemy.ext.asyncio import (
    create_async_engine,
    async_sessionmaker,
    AsyncSession,
    AsyncAttrs,
)
from sqlalchemy.ext.asyncio.engine import AsyncEngine
from sqlalchemy.orm import DeclarativeBase
from typing import AsyncIterator
from app.core.config import Settings
from app.core.dependencies import get_settings


class Base(AsyncAttrs, DeclarativeBase):
    """Base class for SQLAlchemy models."""

    pass


settings: Settings = get_settings()

engine: AsyncEngine = create_async_engine(
    url=settings.db.URL,
    echo=settings.db.DEBUG,
    pool_size=settings.db.POOL_SIZE,
    max_overflow=settings.db.MAX_OVERFLOW,
    connect_args={"timeout": settings.db.TIMEOUT},
)

SessionLocal = async_sessionmaker(bind=engine, expire_on_commit=False)


async def get_db_session() -> AsyncIterator[AsyncSession]:
    """Provide a database session for a request."""
    async with SessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
