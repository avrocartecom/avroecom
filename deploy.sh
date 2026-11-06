#!/usr/bin/env bash
# ==============================================================================
# AVRO STOREFRONT — 1-CLICK DEPLOYMENT SCRIPT
# ==============================================================================
set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

clear
echo -e "${CYAN}================================================================${NC}"
echo -e "${CYAN}       AVRO STOREFRONT & MERCHANT BACKOFFICE DEPLOYER           ${NC}"
echo -e "${CYAN}             TECHNEXT TECHNOLOGIES COMMERCE ENGINE              ${NC}"
echo -e "${CYAN}================================================================${NC}"
echo ""

echo -e "${GREEN}Select deployment mode:${NC}"
echo "  1) Docker Compose (PostgreSQL 16 + Caddy Auto-SSL + Next.js)"
echo "  2) PM2 / Node.js Process (Ubuntu/Debian VPS with Supabase/PostgreSQL)"
echo "  3) Database Setup Only (Prisma generate & db push)"
echo ""
read -p "Enter choice [1-3] (Default: 1): " MODE
MODE=${MODE:-1}

if [ ! -f .env ]; then
    echo -e "\n${YELLOW}Setting up .env file...${NC}"
    cp .env.example .env
    echo -e "${GREEN}Created .env from .env.example. Please review and update your credentials.${NC}"
fi

if [ "$MODE" = "1" ]; then
    echo -e "\n${CYAN}Starting Docker Compose Stack...${NC}"
    docker compose up -d --build
    echo -e "\n${GREEN}================================================================${NC}"
    echo -e "${GREEN}Storefront Running at: http://localhost:3001${NC}"
    echo -e "${GREEN}Admin Backoffice:      http://localhost:3001/admin/login${NC}"
    echo -e "${GREEN}Default Admin Login:   storeadmin@example.com / storeadmin123${NC}"
    echo -e "${GREEN}================================================================${NC}"
    exit 0
fi

if [ "$MODE" = "2" ]; then
    echo -e "\n${CYAN}Installing dependencies...${NC}"
    npm install
    echo -e "\n${CYAN}Syncing database schema...${NC}"
    npm run db:push
    echo -e "\n${CYAN}Building Next.js application...${NC}"
    npm run build
    echo -e "\n${CYAN}Starting PM2 process...${NC}"
    pm2 start ecosystem.config.js
    pm2 save
    echo -e "\n${GREEN}Store is live on port 3001 with PM2!${NC}"
    exit 0
fi

if [ "$MODE" = "3" ]; then
    echo -e "\n${CYAN}Installing dependencies and syncing database...${NC}"
    npm install
    npm run db:push
    npm run db:seed
    echo -e "\n${GREEN}Database synchronized and seeded successfully!${NC}"
    exit 0
fi
