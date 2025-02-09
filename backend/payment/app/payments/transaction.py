import enum

from sqlalchemy import String, TIMESTAMP
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from decimal import Decimal
from uuid import UUID

from app.core.database.config import Base


class TransactionStatus(str, enum.Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"


class Transaction(Base):
    __tablename__ = "transaction"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[UUID] = mapped_column(nullable=False)
    session_id: Mapped[int] = mapped_column(nullable=False)
    provider_id: Mapped[int] = mapped_column(nullable=False)
    provider_reference_id: Mapped[str] = mapped_column(nullable=False)
    amount: Mapped[Decimal] = mapped_column(nullable=False)
    currency: Mapped[str] = mapped_column(nullable=False)
    status: Mapped[TransactionStatus] = mapped_column(
        __name_pos=String, default=TransactionStatus.PENDING
    )
    created_at: Mapped[datetime] = mapped_column(
        __name_pos=TIMESTAMP(timezone=True), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        __name_pos=TIMESTAMP(timezone=True), nullable=False
    )
