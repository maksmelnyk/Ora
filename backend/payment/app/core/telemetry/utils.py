import datetime
import json
from pathlib import Path
from typing import Dict, Any


def format_timestamp(timestamp: datetime.datetime) -> str:
    """Formats a timestamp in UTC as an ISO 8601 string."""
    return (
        timestamp.astimezone(tz=datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[
            :-3
        ]
        + "Z"
    )


def format_log_message(record: Any, service_name: str) -> str:
    """Formats the log message as JSON."""
    log_data: Dict[str, Any] = {
        "timestamp": format_timestamp(timestamp=record["time"]),
        "level": record["level"].name,
        "message": record["message"],
        "service_name": service_name,
        **flatten_dict(record["extra"]),
    }
    if record["exception"]:
        log_data["exception"] = str(object=record["exception"])

    return json.dumps(obj=log_data)


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

        log_path.rename(target=log_path.with_suffix(suffix=".0"))
        log_path.touch()


def write_log(log_path: Path, log_message: str) -> None:
    """Writes the log message to a file."""
    log_path.parent.mkdir(parents=True, exist_ok=True)
    with log_path.open("a", encoding="utf-8") as log_file:
        log_file.write(log_message + "\n")


def flatten_dict(
    d: Dict[str, Any], parent_key: str = "", sep: str = "."
) -> Dict[str, Any]:
    """Flattens nested dictionaries into a dot-separated key structure."""
    items: Dict[str, Any] = {}
    for k, v in d.items():
        new_key: str = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, dict):
            val: Dict[str, Any] = v
            items.update(flatten_dict(val, new_key, sep))
        else:
            items[new_key.lstrip("extra.")] = v
    return items
