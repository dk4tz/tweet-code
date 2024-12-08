#!/bin/bash

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}Cleaning dist folder...${NC}"
bun run clean

echo -e "${GREEN}Building extension...${NC}"
bun run build

echo -e "${GREEN}Packaging extension...${NC}"
vsce package

echo -e "${GREEN}Uninstalling existing extension...${NC}"
code --uninstall-extension DK4TZ.vscode-tweet-code 2>/dev/null || true

echo -e "${GREEN}Installing new version...${NC}"
code --install-extension vscode-tweet-code-1.0.0.vsix

echo -e "${GREEN}✓ Installation complete${NC}"
echo -e "${GREEN}→ Please reload VS Code to apply changes${NC}"