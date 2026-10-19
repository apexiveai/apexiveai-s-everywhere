"# apexiveai-s-everywhere
# node .\node_modules\next\dist\bin\next dev
python -c "import secrets; print(secrets.token_hex(32))"

## Backend database migrations

Before starting the backend on an existing PostgreSQL database, apply the
additive invoice, audit-history, messaging, and notification schemas:

```powershell
Set-Location backend
python -m app.migrate
```

The migration runner records applied SQL files in `schema_migrations` and does
not reapply them. Back up the database before applying migrations in production.

## Billing and access workflow

SuperAdmins issue invoices in USD or MMK for software licenses/renewals or
separate Support & Maintenance work. Tenant admins report bank transfers with
the invoice amount, currency, payer name, and bank reference. A SuperAdmin must
verify the transfer in the admin console; only then does the server mark a
license invoice paid, renew its term, and grant the selected product. Support
invoices are recorded separately and never grant software access.

Bank account instructions are entered on each invoice; do not use sample bank
details. 2C2P card checkout is intentionally not active until a merchant account
is available and USD/MMK currency and settlement support are confirmed.

The backend exposes `GET /api/auth/solutions/{solution_code}/access` for product
services to validate a tenant grant. Independently hosted product applications
must call this endpoint (or enforce the same entitlement check server-side) to
prevent direct-URL access outside this community dashboard.

Backend API service down

Render / Railway / Vercel backend service run မနေခြင်း
Server crash ဖြစ်နေခြင်း

API URL မှားနေခြင်း

Frontend environment variable (API_URL, NEXT_PUBLIC_API_URL) မှားနေခြင်း
Production URL ကို localhost ကိုညွှန်နေခြင်း

CORS issue

https://www.apexiveai.com ကနေ API domain ကို access လုပ်တဲ့အခါ CORS block ဖြစ်ခြင်း

SSL / HTTPS issue

HTTPS page က HTTP API ကို ခေါ်နေတာ
Certificate error ရှိနေတာ

DNS issue

API subdomain DNS record မမှန်သေးခြင်း