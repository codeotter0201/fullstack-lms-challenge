#!/bin/bash
# =============================================================================
# HTTPS Setup Helper Script for Waterball LMS
# =============================================================================
#
# This script helps you configure HTTPS with Let's Encrypt automatically
#
# Usage:
#   ./setup-https.sh
#
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=================================================="
echo "  Waterball LMS - HTTPS Setup Helper"
echo "=================================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found!${NC}"
    echo "Please create .env file first:"
    echo "  cp .env.example .env"
    echo "  nano .env"
    exit 1
fi

# Source .env file
source .env

# Validate DOMAIN
if [ -z "$DOMAIN" ] || [ "$DOMAIN" == "localhost" ]; then
    echo -e "${RED}Error: Invalid DOMAIN in .env${NC}"
    echo "HTTPS requires a real domain name (not 'localhost' or IP address)"
    echo ""
    echo "Please set DOMAIN in .env to your actual domain:"
    echo "  DOMAIN=myapp.example.com"
    exit 1
fi

# Check if DOMAIN is an IP address
if [[ $DOMAIN =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo -e "${RED}Error: DOMAIN cannot be an IP address for HTTPS${NC}"
    echo "Let's Encrypt requires a real domain name."
    echo ""
    echo "You can get a free domain from:"
    echo "  - DuckDNS: https://www.duckdns.org"
    echo "  - Freenom: https://www.freenom.com"
    echo "  - NoIP: https://www.noip.com"
    exit 1
fi

echo -e "${GREEN}✓ Domain validated: $DOMAIN${NC}"
echo ""

# Check ACME_EMAIL
if [ -z "$ACME_EMAIL" ] || [ "$ACME_EMAIL" == "your-email@example.com" ]; then
    echo -e "${YELLOW}Warning: ACME_EMAIL not set properly${NC}"
    read -p "Enter your email for Let's Encrypt notifications: " email

    # Update .env file
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/ACME_EMAIL=.*/ACME_EMAIL=$email/" .env
    else
        # Linux
        sed -i "s/ACME_EMAIL=.*/ACME_EMAIL=$email/" .env
    fi

    echo -e "${GREEN}✓ Email updated in .env${NC}"
    echo ""
fi

# Ask about ACME environment
echo "Which Let's Encrypt environment do you want to use?"
echo "  1) Staging (recommended for testing - higher rate limits)"
echo "  2) Production (for real certificates - rate limited)"
echo ""
read -p "Enter choice [1-2]: " acme_choice

case $acme_choice in
    1)
        ACME_ENV="staging"
        ACME_CA_SERVER="https://acme-staging-v02.api.letsencrypt.org/directory"
        echo -e "${YELLOW}Using STAGING environment (certificates will show as untrusted)${NC}"
        ;;
    2)
        ACME_ENV="production"
        ACME_CA_SERVER="https://acme-v02.api.letsencrypt.org/directory"
        echo -e "${GREEN}Using PRODUCTION environment (real certificates)${NC}"
        ;;
    *)
        echo -e "${RED}Invalid choice. Using staging.${NC}"
        ACME_ENV="staging"
        ACME_CA_SERVER="https://acme-staging-v02.api.letsencrypt.org/directory"
        ;;
esac

# Update .env file
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/ENABLE_HTTPS=.*/ENABLE_HTTPS=true/" .env
    sed -i '' "s/ACME_ENV=.*/ACME_ENV=$ACME_ENV/" .env
    sed -i '' "s|ACME_CA_SERVER=.*|ACME_CA_SERVER=$ACME_CA_SERVER|" .env
else
    # Linux
    sed -i "s/ENABLE_HTTPS=.*/ENABLE_HTTPS=true/" .env
    sed -i "s/ACME_ENV=.*/ACME_ENV=$ACME_ENV/" .env
    sed -i "s|ACME_CA_SERVER=.*|ACME_CA_SERVER=$ACME_CA_SERVER|" .env
fi

echo ""
echo -e "${GREEN}✓ .env file updated${NC}"
echo ""

# Create letsencrypt directory
mkdir -p letsencrypt
chmod 600 letsencrypt
echo -e "${GREEN}✓ Created letsencrypt directory${NC}"
echo ""

# Show DNS check
echo "=================================================="
echo "  DNS Configuration Check"
echo "=================================================="
echo ""
echo "Before starting, ensure your domain points to this server:"
echo ""
echo "  Domain: $DOMAIN"
echo "  Should resolve to: $(curl -s ifconfig.me)"
echo ""
echo "Check DNS resolution:"
echo "  nslookup $DOMAIN"
echo ""
read -p "Is your DNS configured correctly? [y/N]: " dns_ok

if [[ ! $dns_ok =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Please configure your DNS first, then run this script again.${NC}"
    echo ""
    echo "For free DNS services:"
    echo "  - DuckDNS: https://www.duckdns.org"
    echo "  - Freenom: https://www.freenom.com"
    exit 1
fi

# Check if port 80 and 443 are available
if command -v netstat &> /dev/null; then
    if netstat -tuln | grep -q ':80 '; then
        echo -e "${RED}Error: Port 80 is already in use${NC}"
        echo "Please stop the service using port 80:"
        echo "  sudo systemctl stop apache2  # or nginx"
        exit 1
    fi
    if netstat -tuln | grep -q ':443 '; then
        echo -e "${RED}Error: Port 443 is already in use${NC}"
        echo "Please stop the service using port 443"
        exit 1
    fi
fi

echo ""
echo "=================================================="
echo "  Ready to Deploy with HTTPS"
echo "=================================================="
echo ""
echo "Configuration:"
echo "  Domain: $DOMAIN"
echo "  Email: $(grep ACME_EMAIL .env | cut -d'=' -f2)"
echo "  Environment: $ACME_ENV"
echo ""
echo "Starting services with HTTPS enabled..."
echo ""

# Start services
docker-compose -f docker-compose.prod.yml up -d

echo ""
echo "=================================================="
echo "  Deployment Started"
echo "=================================================="
echo ""
echo "Services are starting up. This may take a few minutes."
echo ""
echo "To check status:"
echo "  docker-compose -f docker-compose.prod.yml ps"
echo ""
echo "To view logs:"
echo "  docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "Once ready, access your site at:"
echo "  https://$DOMAIN"
echo ""
if [ "$ACME_ENV" == "staging" ]; then
    echo -e "${YELLOW}Note: You're using staging certificates. Your browser will show a security warning.${NC}"
    echo -e "${YELLOW}This is normal for testing. Switch to production when ready.${NC}"
fi
echo ""
echo -e "${GREEN}Setup complete!${NC}"
