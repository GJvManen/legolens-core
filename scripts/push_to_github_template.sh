#!/usr/bin/env bash
set -euo pipefail
# Usage: ./scripts/push_to_github_template.sh git@github.com:YOUR_ORG/legolens.git
REMOTE_URL="${1:-}"
if [ -z "$REMOTE_URL" ]; then echo "Remote URL required"; exit 1; fi
git init
git add .
git commit -m "Release LegoLens Core v1.0"
git branch -M main
git remote add origin "$REMOTE_URL"
git push -u origin main
git tag -a v1.0.0 -m "LegoLens Core v1.0"
git push origin v1.0.0
