from datetime import datetime, timezone
from typing import Any, List, Tuple
from uuid import UUID
from sqlalchemy import CursorResult, Result, Select, Update, update, exists
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.payments.transaction import Transaction, TransactionStatus
from app.core.base_repository import BaseRepository


class PaymentRepository(BaseRepository):
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_transactions_by_user_id(
        self, user_id: UUID, skip: int, take: int
    ) -> List[Transaction]:
        query: Select[Tuple[Transaction]] = (
            select(Transaction)
            .filter(Transaction.user_id == user_id)
            .offset(offset=skip)
            .limit(limit=take)
        )
        result: Result[Tuple[Transaction]] = await self.session.execute(statement=query)
        return list(result.scalars().all())

    async def transaction_exists(self, transaction_id: int) -> bool:
        stmt: Select[Tuple[bool]] = select(
            exists().where(Transaction.id == transaction_id)
        )
        result: Result[Tuple[bool]] = await self.session.execute(statement=stmt)
        return bool(result.scalar())

    async def create_transaction(self, transaction: Transaction) -> int:
        transaction.created_at = datetime.now(tz=timezone.utc)
        transaction.updated_at = datetime.now(tz=timezone.utc)
        self.session.add(instance=transaction)
        await self.session.flush()
        await self.session.commit()
        return transaction.id

    async def update_transaction_status(
        self, transaction_id: int, status: TransactionStatus
    ) -> bool:
        stmt: Update = (
            update(table=Transaction)
            .where(Transaction.id == transaction_id)
            .values(status=status, updated_at=datetime.now())
        )
        if not self.session.is_active: 
            async with self.session.begin(): 
                result: CursorResult[Any] = await self.session.execute(statement=stmt) 
        else: 
            result: CursorResult[Any] = await self.session.execute(statement=stmt) 

        await self.session.commit() 
        return result.rowcount > 0
