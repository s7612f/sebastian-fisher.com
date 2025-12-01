# Contributing to Chronos Health

## Getting started
1. Fork the repo and clone locally.
2. Install dependencies: `pip install -r backend/requirements.txt` and `npm install` inside `frontend/`.
3. Copy `.env.example` to `.env` for local development.

## Coding guidelines
- Prefer small, focused pull requests with tests.
- Keep FastAPI routers modular inside `backend/app/api` and use the plugin system for optional features.
- Avoid adding cloud-only dependencies; everything should remain self-hosted by default.

## Testing
- Run `pytest backend/tests` for backend checks.
- Run `npm run build` for frontend integrity.

## CI
CI runs on GitHub Actions via `.github/workflows/ci.yml`.
