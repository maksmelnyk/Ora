from sqlalchemy.ext.asyncio import AsyncSession


class BaseRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session: AsyncSession = session

    async def __aenter__(self) -> "BaseRepository":
        return self

    async def __aexit__(self) -> None:
        await self.session.close()
