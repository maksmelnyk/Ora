import sys
import logging

from loguru import logger
from pathlib import Path
from typing import Dict, Any, Callable

from app.core.config.settings import LogSettings
from app.core.logging.utils import format_log_message, rotate_logs, write_log

LOG_LEVEL_MAP: Dict[int, str] = {
    logging.DEBUG: "DEBUG",
    logging.INFO: "INFO",
    logging.WARNING: "WARNING",
    logging.ERROR: "ERROR",
    logging.CRITICAL: "CRITICAL",
}


class InterceptHandler(logging.Handler):
    def emit(self, record: logging.LogRecord) -> None:
        level_name: str = LOG_LEVEL_MAP.get(record.levelno, record.levelname)
        level: str | int = (
            logger.level(level_name).name if level_name else record.levelno
        )
        logger.opt(exception=record.exc_info).log(level, record.getMessage())


def create_json_sink(
    log_path: Path,
    service_name: str,
    max_bytes: int,
    backup_count: int,
) -> Callable[[Any], None]:
    """Create a JSON sink function with log rotation."""

    def json_sink(message: Any) -> None:
        log_message: str = format_log_message(
            record=message.record, service_name=service_name
        )
        rotate_logs(log_path=log_path, max_bytes=max_bytes, backup_count=backup_count)
        write_log(log_path=log_path, log_message=log_message)

    return json_sink


def configure_logging(stg: LogSettings) -> None:
    logs_dir = Path(stg.file_dir)
    logs_dir.mkdir(exist_ok=True)
    logs_path: Path = logs_dir / stg.file_path

    logger.remove()

    logger.add(
        sink=sys.stdout,
        colorize=True,
        level=logging.INFO,
        enqueue=True,
        backtrace=True,
        catch=True,
        diagnose=True,
    )

    logger.add(
        sink=sys.stdout,
        filter=lambda record: record["extra"].get("name") == "sqlalchemy.engine",
        level=logging.INFO,
    )

    if stg.file_dir and stg.file_path:
        logger.add(
            sink=create_json_sink(
                log_path=logs_path,
                service_name=stg.service_name,
                max_bytes=stg.file_rotation,
                backup_count=stg.backup_count,
            ),
            level=stg.level,
            enqueue=True,
            catch=True,
        )

    logging.basicConfig(handlers=[InterceptHandler()], level=logging.INFO)

    for logger_name in logging.root.manager.loggerDict:
        existing_logger: logging.Logger = logging.getLogger(name=logger_name)
        if not existing_logger.handlers:
            existing_logger.handlers = [InterceptHandler()]
