import os
import subprocess
from datetime import datetime
from pathlib import Path
from ..core.config import get_settings

settings = get_settings()


def ensure_backup_dirs(base: str):
    Path(base).mkdir(parents=True, exist_ok=True)
    Path(base, "weekly").mkdir(parents=True, exist_ok=True)
    Path(base, "monthly").mkdir(parents=True, exist_ok=True)


def run_backup():
    ensure_backup_dirs(settings.backup_folder)
    timestamp = datetime.utcnow().strftime("%Y%m%d-%H%M%S")
    outfile = Path(settings.backup_folder, "weekly", f"backup-{timestamp}.sql")
    subprocess.run(["pg_dump", settings.database_url, "-f", str(outfile)], check=False)
    gpg_file = f"{outfile}.gpg"
    subprocess.run(["gpg", "--symmetric", "--batch", "--passphrase", settings.secret_key, "-o", gpg_file, str(outfile)], check=False)
    if settings.backup_backend != "local" and settings.backup_rclone_remote:
        subprocess.run(["rclone", "copy", gpg_file, f"{settings.backup_rclone_remote}:/chronos-health/weekly"], check=False)
    rotate_backups(Path(settings.backup_folder, "weekly"), keep=12)


def rotate_backups(path: Path, keep: int = 12):
    backups = sorted(path.glob("backup-*.sql.gpg"))
    for old in backups[:-keep]:
        old.unlink(missing_ok=True)


def monthly_rollup():
    ensure_backup_dirs(settings.backup_folder)
    latest = sorted(Path(settings.backup_folder, "weekly").glob("backup-*.sql.gpg"))
    if latest:
        target = Path(settings.backup_folder, "monthly", latest[-1].name)
        target.write_bytes(Path(latest[-1]).read_bytes())
