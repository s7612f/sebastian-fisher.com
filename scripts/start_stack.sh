#!/usr/bin/env bash
set -e
if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required" && exit 1
fi
if ! command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_CMD="docker compose"
else
  COMPOSE_CMD="docker-compose"
fi
$COMPOSE_CMD pull db || true
$COMPOSE_CMD up -d
