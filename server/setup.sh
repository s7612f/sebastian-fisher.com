#!/bin/bash
# ============================================================
# Sebastian Fisher Coaching — Server Setup Script
# ============================================================
# Run on a fresh Ubuntu 22.04 / 24.04 VPS as root.
# Sets up: nginx, Docker, the static site, Umami analytics.
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/s7612f/sebastian-fisher.com/main/server/setup.sh | bash
#
#   OR clone the repo first and run:
#   bash server/setup.sh
# ============================================================

set -euo pipefail

REPO_URL="https://github.com/s7612f/sebastian-fisher.com.git"
SITE_DIR="/var/www/sebastian-fisher.com"
COMPOSE_DIR="/opt/sebastian-fisher"
DOMAIN="sebastian-fisher.com"
EMAIL="contact@sebastian-fisher.com"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'
log()  { echo -e "${GREEN}[SETUP]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
die()  { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

[[ $EUID -ne 0 ]] && die "Run as root: sudo bash server/setup.sh"

# ── 1. System update ────────────────────────────────────────
log "Updating system packages..."
apt-get update -qq && apt-get upgrade -y -qq

# ── 2. Install dependencies ─────────────────────────────────
log "Installing nginx, git, certbot, curl..."
apt-get install -y -qq nginx git curl certbot python3-certbot-nginx ufw

# ── 3. Install Docker ───────────────────────────────────────
if ! command -v docker &>/dev/null; then
  log "Installing Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
else
  log "Docker already installed — skipping."
fi

# ── 4. Clone / pull the repo ────────────────────────────────
if [ -d "$SITE_DIR/.git" ]; then
  log "Repo already exists — pulling latest..."
  git -C "$SITE_DIR" pull origin main
else
  log "Cloning repo to $SITE_DIR..."
  git clone "$REPO_URL" "$SITE_DIR"
fi

# ── 5. Set up Docker services directory ─────────────────────
log "Setting up Docker services..."
mkdir -p "$COMPOSE_DIR"
cp "$SITE_DIR/server/docker-compose.yml" "$COMPOSE_DIR/docker-compose.yml"

if [ ! -f "$COMPOSE_DIR/.env" ]; then
  warn ".env not found. Creating from example — YOU MUST EDIT THIS."
  cp "$SITE_DIR/server/.env.example" "$COMPOSE_DIR/.env"
  warn "Edit $COMPOSE_DIR/.env before starting Docker services!"
  warn "Run: nano $COMPOSE_DIR/.env"
fi

# ── 6. Configure nginx ──────────────────────────────────────
log "Installing nginx configs..."
cp "$SITE_DIR/server/nginx/sebastian-fisher.com.conf" /etc/nginx/sites-available/sebastian-fisher.com
cp "$SITE_DIR/server/nginx/subdomains.conf"           /etc/nginx/sites-available/sebastian-fisher-subdomains

ln -sf /etc/nginx/sites-available/sebastian-fisher.com        /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/sebastian-fisher-subdomains /etc/nginx/sites-enabled/

# Remove default nginx site if present
rm -f /etc/nginx/sites-enabled/default

# Temp HTTP-only config for certbot (before SSL exists)
cat > /etc/nginx/sites-available/sebastian-fisher-temp <<'NGINX'
server {
    listen 80;
    server_name sebastian-fisher.com www.sebastian-fisher.com
                blog.sebastian-fisher.com forum.sebastian-fisher.com
                analytics.sebastian-fisher.com book.sebastian-fisher.com;
    root /var/www/sebastian-fisher.com;
    location /.well-known/acme-challenge/ { root /var/www/html; }
    location / { return 301 https://$host$request_uri; }
}
NGINX
ln -sf /etc/nginx/sites-available/sebastian-fisher-temp /etc/nginx/sites-enabled/sebastian-fisher-temp
nginx -t && systemctl reload nginx

# ── 7. SSL certificates ─────────────────────────────────────
log "Requesting SSL certificates via Let's Encrypt..."
certbot certonly --nginx \
  -d "$DOMAIN" \
  -d "www.$DOMAIN" \
  -d "blog.$DOMAIN" \
  -d "forum.$DOMAIN" \
  -d "analytics.$DOMAIN" \
  -d "book.$DOMAIN" \
  --email "$EMAIL" \
  --agree-tos \
  --non-interactive \
  --redirect || warn "Certbot failed — check DNS is pointing to this server first."

# Remove temp config, enable real configs
rm -f /etc/nginx/sites-enabled/sebastian-fisher-temp
nginx -t && systemctl reload nginx

# ── 8. Firewall ─────────────────────────────────────────────
log "Configuring UFW firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# ── 9. Start Docker services ─────────────────────────────────
log "Starting Docker services..."
if grep -q "change_me" "$COMPOSE_DIR/.env"; then
  warn "⚠️  .env still has placeholder values. Skipping Docker start."
  warn "Edit $COMPOSE_DIR/.env then run: cd $COMPOSE_DIR && docker compose up -d"
else
  cd "$COMPOSE_DIR" && docker compose up -d
  log "Docker services started."
fi

# ── 10. Auto-update cron (git pull + reload nginx) ──────────
log "Setting up auto-update cron job..."
cat > /etc/cron.d/sebastian-fisher-update <<CRON
# Pull latest site files every 15 minutes
*/15 * * * * root git -C $SITE_DIR pull origin main --quiet && nginx -t && systemctl reload nginx
CRON

# ── 11. Certbot auto-renewal ─────────────────────────────────
log "Certbot renewal timer: $(systemctl is-active certbot.timer 2>/dev/null || echo 'enabling...')"
systemctl enable certbot.timer 2>/dev/null || true

# ── Done ─────────────────────────────────────────────────────
echo ""
echo "============================================================"
echo -e "${GREEN}  Setup complete!${NC}"
echo "============================================================"
echo ""
echo "  Site dir:      $SITE_DIR"
echo "  Docker dir:    $COMPOSE_DIR"
echo "  Nginx configs: /etc/nginx/sites-enabled/"
echo ""
echo -e "${YELLOW}  TODO (manual steps):${NC}"
echo "  1. Edit $COMPOSE_DIR/.env with real passwords"
echo "  2. cd $COMPOSE_DIR && docker compose up -d"
echo "  3. Visit https://analytics.sebastian-fisher.com"
echo "     to set up Umami admin account (first run)"
echo "  4. Update website-id in HTML if Umami gives a new ID:"
echo "     grep -r 'data-website-id' $SITE_DIR/*.html"
echo "  5. Add booking app to docker-compose.yml if needed"
echo ""
echo "  Cloudflare Worker (maintenance page):"
echo "  See $SITE_DIR/cloudflare/README.md"
echo ""
