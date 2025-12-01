from apscheduler.schedulers.background import BackgroundScheduler
from .backups import run_backup, monthly_rollup


def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(run_backup, "cron", day_of_week="sun", hour=2)
    scheduler.add_job(monthly_rollup, "cron", day=1, hour=3)
    scheduler.start()
    return scheduler
