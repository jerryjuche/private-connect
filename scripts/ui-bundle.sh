#!/usr/bin/env bash
set -euo pipefail

OUT="ui-bundle.txt"
: > "$OUT"

write_section() {
  echo "" >> "$OUT"
  echo "==================================================" >> "$OUT"
  echo "$1" >> "$OUT"
  echo "==================================================" >> "$OUT"
  echo "" >> "$OUT"
}

append_file() {
  local f="$1"
  if [ -f "$f" ]; then
    echo "----- FILE: $f -----" >> "$OUT"
    cat "$f" >> "$OUT"
    echo "" >> "$OUT"
    echo "" >> "$OUT"
  else
    echo "----- MISSING FILE: $f -----" >> "$OUT"
    echo "" >> "$OUT"
  fi
}

write_section "PROJECT ROOT"
pwd >> "$OUT"

write_section "FILE TREE"
find app/src/pages app/src/components app/src/hooks app/src/lib app/src/styles app/public \
  \( -path 'app/node_modules' -o -path 'app/.next' \) -prune \
  -o -type f | sort >> "$OUT"

write_section "APP CONFIG"
append_file "app/package.json"
append_file "app/tsconfig.json"
append_file "app/next.config.mjs"
append_file "app/postcss.config.js"
append_file "app/tailwind.config.ts"
append_file "app/next-env.d.ts"

write_section "GLOBAL STYLES"
append_file "app/src/styles/globals.css"

write_section "PAGES"
append_file "app/src/pages/_app.tsx"
append_file "app/src/pages/index.tsx"
append_file "app/src/pages/onboard.tsx"
append_file "app/src/pages/discover.tsx"
append_file "app/src/pages/results.tsx"
append_file "app/src/pages/profile.tsx"

write_section "COMPONENTS"
append_file "app/src/components/ContactImporter.tsx"
append_file "app/src/components/DiscoveryProgress.tsx"
append_file "app/src/components/MatchCard.tsx"
append_file "app/src/components/PrivacyExplainer.tsx"
append_file "app/src/components/WalletButton.tsx"

write_section "HOOKS"
append_file "app/src/hooks/useDiscovery.ts"

write_section "LIB"
append_file "app/src/lib/constants.ts"
append_file "app/src/lib/mockDiscovery.ts"
append_file "app/src/lib/normalize.ts"

echo "Created $OUT"

