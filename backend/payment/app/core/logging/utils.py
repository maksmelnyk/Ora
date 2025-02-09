import datetime
import json

from pathlib import Path
from typing import Dict, Any


def rotate_logs(log_path: Path, max_bytes: int, backup_count: int) -> None:
    """Rotate log files when the main log exceeds max_bytes."""
    if not log_path.exists():
        return

    if log_path.stat().st_size >= max_bytes:
        for i in range(backup_count - 1, 0, -1):
            backup_path: Path = log_path.with_suffix(suffix=f".{i}")
            older_backup_path: Path = log_path.with_suffix(suffix=f".{i - 1}")
            if older_backup_path.exists():
                older_backup_path.rename(target=backup_path)

        log_path.rename(target=log_path.with_suffix(".0"))
        log_path.touch()


def format_log_message(record: Any, service_name: str) -> str:
    """Format the log message as JSON."""
    log_data: Dict[str, Any] = {
        "timestamp": record["time"]
        .astimezone(datetime.timezone.utc)
        .strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3]
        + "Z",
        "level": record["level"].name,
        "message": record["message"],
        "service_name": service_name,
    }
    log_data.update(record.get("extra", {}))

    if record["exception"]:
        log_data["exception"] = str(object=record["exception"])

    return json.dumps(log_data)


def write_log(log_path: Path, log_message: str) -> None:
    """Write the log message to the file."""
    log_path.parent.mkdir(parents=True, exist_ok=True)
    with log_path.open(mode="a", encoding="utf-8") as log_file:
        log_file.write(log_message + "\n")
