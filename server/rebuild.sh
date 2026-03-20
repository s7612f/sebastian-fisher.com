#!/bin/bash
# ============================================================
# Sebastian Fisher — Server Rebuild from Scratch
# ============================================================
# Run on fresh Ubuntu 22.04/24.04 after formatting.
# Restores everything from git + photos drive backup.
#
# Usage:
#   sudo bash rebuild.sh
# ============================================================
set -euo pipefail

REPO_URL="https://github.com/s7612f/sebastian-fisher.com.git"
SITE_DIR="/home/sebastian/site"
SERVICES_DIR="/home/sebastian/services"
BACKUP_DIR="/mnt/photos/server-backup"
PHOTOS_DRIVE="/dev/sda1"
PHOTOS_MOUNT="/mnt/photos"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
log()  { echo -e "${GREEN}[REBUILD]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }

[[ $EUID -ne 0 ]] && echo "Run as root" && exit 1

# ── 1. System ────────────────────────────────────────────────
log "Updating system..."
apt-get update -qq && apt-get upgrade -y -qq
apt-get install -y -qq git curl rsync ufw

# ── 2. Mount photos drive ────────────────────────────────────
log "Mounting photos drive ($PHOTOS_DRIVE)..."
mkdir -p "$PHOTOS_MOUNT"
if ! mountpoint -q "$PHOTOS_MOUNT"; then
  mount "$PHOTOS_DRIVE" "$PHOTOS_MOUNT"
  echo "$PHOTOS_DRIVE  $PHOTOS_MOUNT  auto  defaults  0  2" >> /etc/fstab
fi
log "Photos drive mounted. Backup available at $BACKUP_DIR"

# ── 3. Docker ────────────────────────────────────────────────
if ! command -v docker &>/dev/null; then
  log "Installing Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker && systemctl start docker
fi

# ── 4. Create user if needed ─────────────────────────────────
id sebastian &>/dev/null || useradd -m -s /bin/bash sebastian
usermod -aG docker sebastian

# ── 5. Clone site repo ───────────────────────────────────────
log "Cloning site repo..."
if [ -d "$SITE_DIR/.git" ]; then
  git -C "$SITE_DIR" pull origin main
else
  sudo -u sebastian git clone "$REPO_URL" "$SITE_DIR"
fi

# ── 6. Restore services from backup ─────────────────────────
log "Restoring services from backup..."
mkdir -p "$SERVICES_DIR"

if [ -d "$BACKUP_DIR/services" ]; then
  rsync -a "$BACKUP_DIR/services/" "$SERVICES_DIR/"
  chown -R sebastian:sebastian "$SERVICES_DIR"
  log "Services restored from backup"
else
  warn "No services backup found at $BACKUP_DIR/services"
  warn "Copy docker-compose.yml from repo and create .env manually:"
  warn "  cp $SITE_DIR/server/docker-compose.yml $SERVICES_DIR/"
  warn "  cp $SITE_DIR/server/.env.example $SERVICES_DIR/.env && nano $SERVICES_DIR/.env"
fi

# ── 7. Restore crontab ───────────────────────────────────────
if [ -f "$BACKUP_DIR/system/crontab.txt" ]; then
  log "Restoring crontab..."
  crontab -u sebastian "$BACKUP_DIR/system/crontab.txt"
fi
if [ -f "$BACKUP_DIR/system/check-services.sh" ]; then
  cp "$BACKUP_DIR/system/check-services.sh" /home/sebastian/
  chmod +x /home/sebastian/check-services.sh
fi

# ── 8. Start services ────────────────────────────────────────
if [ -f "$SERVICES_DIR/.env" ] && ! grep -q '^MYSQL_ROOT_PASSWORD=$' "$SERVICES_DIR/.env"; then
  log "Starting Docker services..."
  cd "$SERVICES_DIR" && sudo -u sebastian docker compose up -d
else
  warn ".env missing or empty — fill in $SERVICES_DIR/.env then run:"
  warn "  cd $SERVICES_DIR && docker compose up -d"
fi

# ── 9. Firewall ──────────────────────────────────────────────
log "Configuring firewall..."
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 81/tcp
ufw --force enable

# ── Done ─────────────────────────────────────────────────────
echo ""
echo "============================================================"
echo -e "${GREEN}  Rebuild complete!${NC}"
echo "============================================================"
echo ""
echo "  Site:     $SITE_DIR"
echo "  Services: $SERVICES_DIR"
echo "  Backup:   $BACKUP_DIR"
echo ""
echo -e "${YELLOW}  Check services:${NC} cd $SERVICES_DIR && docker compose ps"
echo -e "${YELLOW}  Nginx Proxy Mgr:${NC} http://$(hostname -I | awk '{print $1}'):81"
echo "  Default NPM login: admin@example.com / changeme"
echo ""
