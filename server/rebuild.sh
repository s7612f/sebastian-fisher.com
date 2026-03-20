#!/bin/bash
# ============================================================
# Sebastian Fisher — Full Server Rebuild
# ============================================================
# One script. Run after formatting on fresh Ubuntu 22.04/24.04.
#
#   git clone https://github.com/s7612f/sebastian-fisher.com.git
#   cd sebastian-fisher.com
#   sudo bash server/rebuild.sh
#
# What it does:
#   1. Installs Docker, git, ufw
#   2. Mounts the Photos drive (sda1) and pulls .env from backup
#   3. Clones/updates the site repo
#   4. Copies services config to ~/services
#   5. Restores service data from Photos drive backup
#   6. Pulls all Docker images and starts everything
#   7. Restores crontab
#   8. Configures firewall
# ============================================================
set -euo pipefail

REPO_URL="https://github.com/s7612f/sebastian-fisher.com.git"
SITE_DIR="/home/sebastian/site"
SERVICES_DIR="/home/sebastian/services"
BACKUP_DIR="/mnt/photos/server-backup"
PHOTOS_DRIVE="/dev/sda1"
PHOTOS_MOUNT="/mnt/photos"
GIT_USER="sebastian"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
log()  { echo -e "${GREEN}[✓]${NC} $1"; }
step() { echo -e "\n${BLUE}[→]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
die()  { echo -e "${RED}[✗]${NC} $1"; exit 1; }

[[ $EUID -ne 0 ]] && die "Run as root: sudo bash server/rebuild.sh"

echo ""
echo "  ▲ SEBASTIAN FISHER — SERVER REBUILD ▲"
echo "  ======================================="
echo ""

# ── 1. Create user ───────────────────────────────────────────
step "Setting up user..."
id $GIT_USER &>/dev/null || useradd -m -s /bin/bash $GIT_USER
log "User: $GIT_USER"

# ── 2. System packages ───────────────────────────────────────
step "Installing system packages..."
apt-get update -qq
apt-get install -y -qq git curl rsync ufw wget
log "Packages installed"

# ── 3. Docker ────────────────────────────────────────────────
step "Installing Docker..."
if ! command -v docker &>/dev/null; then
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
  log "Docker installed"
else
  log "Docker already installed"
fi
usermod -aG docker $GIT_USER

# ── 4. Mount photos drive (sda1 = Photos) ───────────────────
step "Mounting Photos drive..."
mkdir -p "$PHOTOS_MOUNT"
if ! mountpoint -q "$PHOTOS_MOUNT"; then
  if blkid "$PHOTOS_DRIVE" &>/dev/null; then
    mount "$PHOTOS_DRIVE" "$PHOTOS_MOUNT"
    # Add to fstab if not already there
    grep -q "$PHOTOS_DRIVE" /etc/fstab || \
      echo "$PHOTOS_DRIVE  $PHOTOS_MOUNT  auto  defaults,nofail  0  2" >> /etc/fstab
    log "Photos drive mounted at $PHOTOS_MOUNT"
  else
    warn "Photos drive ($PHOTOS_DRIVE) not found — skipping mount"
    warn "Attach the drive and run: mount $PHOTOS_DRIVE $PHOTOS_MOUNT"
  fi
else
  log "Photos drive already mounted"
fi

# ── 5. Clone site repo ───────────────────────────────────────
step "Setting up site repo..."
mkdir -p "$(dirname $SITE_DIR)"
if [ -d "$SITE_DIR/.git" ]; then
  sudo -u $GIT_USER git -C "$SITE_DIR" pull origin main
  log "Repo updated"
else
  sudo -u $GIT_USER git clone "$REPO_URL" "$SITE_DIR"
  log "Repo cloned"
fi

# ── 6. Set up services directory ─────────────────────────────
step "Setting up services..."
mkdir -p "$SERVICES_DIR"

# Copy docker-compose from repo
cp "$SITE_DIR/server/docker-compose.yml" "$SERVICES_DIR/docker-compose.yml"
log "docker-compose.yml copied from repo"

# Copy .env — from backup if exists, otherwise from example
if [ -f "$BACKUP_DIR/services/.env" ]; then
  cp "$BACKUP_DIR/services/.env" "$SERVICES_DIR/.env"
  chmod 600 "$SERVICES_DIR/.env"
  log ".env restored from Photos drive backup"
elif [ ! -f "$SERVICES_DIR/.env" ]; then
  cp "$SITE_DIR/server/.env.example" "$SERVICES_DIR/.env"
  warn ".env created from template — FILL IN VALUES before starting services"
  warn "  nano $SERVICES_DIR/.env"
fi

chown -R $GIT_USER:$GIT_USER "$SERVICES_DIR"

# ── 7. Restore service data from backup ──────────────────────
step "Restoring service data from Photos drive..."
if [ -d "$BACKUP_DIR/services" ]; then
  # Restore bind-mount data directories (all except compose/env — those are from git/.env)
  for dir in ghost flarum mysql influxdb grafana yourls easyapp flarum \
              formcapture listmonk nginx nginx-static.conf wger \
              code-server-config manage-portal calcom umami; do
    src="$BACKUP_DIR/services/$dir"
    dst="$SERVICES_DIR/$dir"
    if [ -e "$src" ]; then
      rsync -a "$src" "$SERVICES_DIR/" 2>/dev/null || true
    fi
  done

  # Restore MySQL dump if mysql dir doesn't exist
  if [ ! -d "$SERVICES_DIR/mysql" ] && [ -f "$BACKUP_DIR/services/all-databases.sql" ]; then
    warn "MySQL data not in backup dir — will import SQL dump after MySQL starts"
    NEEDS_MYSQL_IMPORT=1
  fi

  log "Service data restored"
else
  warn "No service backup found at $BACKUP_DIR/services — starting fresh"
fi

# ── 8. Pull all Docker images ────────────────────────────────
step "Pulling Docker images (this takes a few minutes)..."
cd "$SERVICES_DIR"
sudo -u $GIT_USER docker compose pull 2>&1 | grep -E 'Pull|Pulled|already|error' || true
log "Images pulled"

# ── 9. Start all services ────────────────────────────────────
step "Starting services..."
if grep -q '^MYSQL_ROOT_PASSWORD=$' "$SERVICES_DIR/.env" 2>/dev/null; then
  warn ".env has empty values — fill in $SERVICES_DIR/.env then run:"
  warn "  cd $SERVICES_DIR && docker compose up -d"
else
  cd "$SERVICES_DIR"
  sudo -u $GIT_USER docker compose up -d
  log "All services started"

  # Import MySQL dump if needed
  if [ "${NEEDS_MYSQL_IMPORT:-0}" = "1" ]; then
    step "Waiting for MySQL to be ready..."
    sleep 15
    MYSQL_PASS=$(grep MYSQL_ROOT_PASSWORD "$SERVICES_DIR/.env" | cut -d= -f2)
    docker exec services-mysql-1 mysql -uroot -p"$MYSQL_PASS" < "$BACKUP_DIR/services/all-databases.sql"
    log "MySQL databases imported from dump"
  fi
fi

# ── 10. Restore crontab ──────────────────────────────────────
step "Restoring crontab..."
if [ -f "$BACKUP_DIR/system/crontab.txt" ]; then
  crontab -u $GIT_USER "$BACKUP_DIR/system/crontab.txt"
  log "Crontab restored"
else
  # Set up default crontab
  (crontab -u $GIT_USER -l 2>/dev/null; echo "0 * * * * /home/$GIT_USER/check-services.sh >> /home/$GIT_USER/service-check.log 2>&1") | crontab -u $GIT_USER -
  (crontab -u $GIT_USER -l 2>/dev/null; echo "*/5 * * * * cd /home/$GIT_USER/site && git pull --quiet") | crontab -u $GIT_USER -
  log "Default crontab created"
fi

# Restore check-services.sh
if [ -f "$BACKUP_DIR/system/check-services.sh" ]; then
  cp "$BACKUP_DIR/system/check-services.sh" "/home/$GIT_USER/"
  chmod +x "/home/$GIT_USER/check-services.sh"
  log "check-services.sh restored"
fi

# ── 11. Firewall ─────────────────────────────────────────────
step "Configuring firewall..."
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 81/tcp   # Nginx Proxy Manager admin
ufw --force enable
log "Firewall configured"

# ── Done ─────────────────────────────────────────────────────
echo ""
echo "  ======================================="
echo -e "  ${GREEN}✓ Rebuild complete${NC}"
echo "  ======================================="
echo ""
echo "  Site repo:   $SITE_DIR"
echo "  Services:    $SERVICES_DIR"
echo "  Photos:      $PHOTOS_MOUNT"
echo ""
echo "  Service status:"
cd "$SERVICES_DIR" && sudo -u $GIT_USER docker compose ps --format "table {{.Name}}\t{{.Status}}" 2>/dev/null || true
echo ""
echo "  Nginx Proxy Manager:"
echo "    http://$(hostname -I | awk '{print $1}'):81"
echo "    First login: admin@example.com / changeme"
echo ""
