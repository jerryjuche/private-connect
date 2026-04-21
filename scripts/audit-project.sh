#!/usr/bin/env bash
set -euo pipefail

echo "=== PrivateConnect Project Audit ==="
echo


echo "--- Working directory ---"
pwd
echo

echo "--- Git status ---"
git status --short || true
echo

echo "--- Git remotes ---"
git remote -v || true
echo

echo "--- Top-level contents ---"
find . -maxdepth 1 -mindepth 1 \
  -not -name '.git' \
  | sort
echo

echo "--- Important generated folders ---"
for d in app/node_modules app/.next node_modules .next; do
  if [ -d "$d" ]; then
    echo "[present] $d"
  else
    echo "[missing] $d"
  fi
done
echo

echo "--- Key project files ---"
for f in \
  .gitignore \
  app/package.json \
  app/package-lock.json \
  app/tsconfig.json \
  app/next-env.d.ts \
  app/next.config.mjs \
  app/postcss.config.js \
  app/tailwind.config.ts \
  app/src/pages/_app.tsx \
  app/src/pages/index.tsx \
  app/src/pages/onboard.tsx \
  app/src/pages/discover.tsx \
  app/src/pages/results.tsx \
  app/src/pages/profile.tsx \
  app/src/lib/constants.ts \
  app/src/lib/normalize.ts \
  app/src/lib/mockDiscovery.ts \
  app/src/hooks/useDiscovery.ts \
  app/src/components/WalletButton.tsx \
  app/src/components/ContactImporter.tsx \
  app/src/components/DiscoveryProgress.tsx \
  app/src/components/MatchCard.tsx \
  app/src/components/PrivacyExplainer.tsx \
  app/src/styles/globals.css
do
  if [ -f "$f" ]; then
    echo "[ok] $f"
  else
    echo "[missing] $f"
  fi
done
echo

echo "--- Source tree (filtered) ---"
find . \
  \( -path './.git' -o -path './.git/*' \
     -o -path './app/node_modules' -o -path './app/node_modules/*' \
     -o -path './node_modules' -o -path './node_modules/*' \
     -o -path './app/.next' -o -path './app/.next/*' \
     -o -path './.next' -o -path './.next/*' \
     -o -path './target' -o -path './target/*' \
     -o -path './dist' -o -path './dist/*' \
     -o -path './coverage' -o -path './coverage/*' \) -prune \
  -o -type f -print \
  | sort
echo

echo "--- app/package.json ---"
[ -f app/package.json ] && cat app/package.json || echo "missing"
echo

echo "--- app/tsconfig.json ---"
[ -f app/tsconfig.json ] && cat app/tsconfig.json || echo "missing"
echo

echo "--- app/next.config.mjs ---"
[ -f app/next.config.mjs ] && cat app/next.config.mjs || echo "missing"
echo

echo "--- app/postcss.config.js ---"
[ -f app/postcss.config.js ] && cat app/postcss.config.js || echo "missing"
echo

echo "--- Build check ---"
if [ -d app ]; then
  (
    cd app
    npm run build
  )
else
  echo "app directory missing"
fi
echo

echo "=== End Audit ==="
