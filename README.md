# Chronos Health

[![CI](https://github.com/example/chronos-health/actions/workflows/ci.yml/badge.svg)](./.github/workflows/ci.yml) ![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

Chronos Health is a privacy-first, zero-cost-forever health operating system that runs entirely on your own hardware (server, laptop, Raspberry Pi). It combines data capture, AI coaching, and encrypted backups with a PWA dashboard.

## Features
- **Full tracker suite**: food diary with barcode lookup (Open Food Facts-ready), workouts, bowel tracker, meds/supplements, mood/libido sliders, general journal with tags, blood-work uploads (CSV/PDF via tabula-py), and historical corrections with audit-ready schemas.
- **AI coaching with Ollama**: configurable local models (e.g., `gemma2:9b`, `qwen2.5:14b`). Generates daily summaries and weekly PDF-ready insights.
- **Integrations**: nightly pulls for Apple Health exports, Dexcom, Tandem t:slim (tconnectsync), optional Oura/Fitbit connectors.
- **Automations**: cron-style jobs for nightly data pulls and coaching, weekly PDF/email reports, and encrypted backups.
- **Backups**: weekly `pg_dump` + `gpg` encryption with 12-week retention and monthly rollups; supports any rclone backend (ProtonDrive, Google Drive, Dropbox) or local-only fallback.
- **Security**: optional database encryption at rest, JWT auth, HTTPS-ready via Nginx reverse proxy.
- **Extensibility**: FastAPI plugin system (`backend/app/plugins`) for custom routes and trackers; React widgets easily extended.
- **PWA dashboard**: responsive, offline-ready React + Tailwind experience with service worker and manifest.

## Architecture
- **Database**: PostgreSQL
- **Backend**: FastAPI + SQLAlchemy + APScheduler automations
- **Frontend**: React + TypeScript + Tailwind (Vite)
- **Proxy**: Nginx
- **AI**: Ollama container with configurable models
- **Container orchestration**: Docker Compose (single `docker-compose.yml`)

## Quick start (GUI wizard)
1. Install Docker and Docker Compose.
2. Run the installer (launches cross-platform Tkinter wizard):
   ```bash
   chmod +x install.sh
   ./install.sh
   ```
   On Windows PowerShell:
   ```powershell
   .\install.ps1
   ```
3. Enter domain/email, API keys (Dexcom, Tandem, Oura, Fitbit), SMTP credentials, and choose backup backend (local or rclone remote). The wizard writes `.env`, checks basic hardware, and starts Docker.
4. Access the dashboard at `http://localhost` (default) or your configured domain.

## Manual CLI setup
```bash
cp .env.example .env  # optional starter
SECRET_KEY=change-me docker compose up -d
```

## Backup & retention
- Weekly cron: `pg_dump` + `gpg` encryption using `SECRET_KEY` as passphrase.
- Retention: 12 weekly encrypted dumps, with monthly rollups every 30 days.
- Backends: local volume (`backups`), or rclone remote (e.g., `proton:chronos-health`). Configure via `.env` (`BACKUP_BACKEND`, `RCLONE_REMOTE`).

## Plugins
Drop Python modules inside `backend/app/plugins/` that expose a `router` (`APIRouter`). They are auto-discovered on startup. Example plugin: [`backend/app/plugins/example.py`](backend/app/plugins/example.py).

## Development
```bash
# Backend
python -m venv .venv && source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --reload

# Frontend
cd frontend && npm install && npm run dev
```

## Testing
```bash
pytest backend/tests
```

## CI/CD
GitHub Actions workflow runs lint/build for frontend and pytest for backend on every push.

## Funding
If you find this project useful, consider sponsoring maintenance via GitHub Sponsors (see `.github/funding.yml`).

## License
MIT — see [LICENSE](LICENSE).
