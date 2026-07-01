#!/usr/bin/env bash
# ============================================================
# Aivanta — Supabase / DB connection check
# RUN THIS ON PERSONAL WIFI + VPN (the corporate proxy blocks Supabase).
#
#   bash scripts/db-check.sh
#
# It checks: Auth API, which tables exist, is_admin() function,
# and the direct Postgres connection used by migrations.
# No emails are sent.
# ============================================================
set -uo pipefail
cd "$(dirname "$0")/.."

echo "==> Using project dir: $(pwd)"

# 1. Make sure node is on PATH (Homebrew install location)
export PATH="/opt/homebrew/bin:$PATH"
if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: node not found. Open a new terminal or install Node."
  exit 1
fi
echo "==> node $(node --version)"

# 2. CRITICAL: clear the corporate proxy so we connect directly over your wifi
unset HTTP_PROXY HTTPS_PROXY http_proxy https_proxy NODE_USE_ENV_PROXY
echo "==> Proxy env cleared (direct connection)."

# 3. Sanity: .env.local present?
if [ ! -f .env.local ]; then
  echo "ERROR: .env.local not found. Create it from .env.example first."
  exit 1
fi

echo
echo "======================================================"
echo " STEP 1 — Connectivity + schema check"
echo "======================================================"
node --env-file=.env.local scripts/test-supabase.mjs
echo

echo "======================================================"
echo " NEXT STEPS (only if needed)"
echo "======================================================"
cat <<'EOF'
- If tables are MISSING, create them:
      npm run db:migrate          # applies drizzle/*.sql via DATABASE_URL
  (or paste drizzle/0000_init_schema.sql + drizzle/0001_leads.sql
   into the Supabase SQL Editor)

- Then apply auth + Row-Level Security:
      open supabase/02_auth_rls.sql, paste into Supabase SQL Editor, Run.

- Re-run this check to confirm everything is green:
      bash scripts/db-check.sh

- Start the app (still on personal wifi/VPN):
      npm run dev      # then open http://localhost:3000/login
EOF
