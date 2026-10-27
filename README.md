"# apexiveai-s-everywhere
# node .\node_modules\next\dist\bin\next dev
https://cyclone-rpa.vercel.app/
https://ais-ware-rpq.vercel.app/
python -c "import secrets; print(secrets.token_urlsafe(48))"
## Backend database migrations

The backend Procfile applies pending SQL migrations before starting the API.
This includes the auction tables required by the marketplace. For a one-time
manual migration or an existing deployment, run:

```powershell
Set-Location backend
python -m app.migrate
```

The migration runner records applied SQL files in `schema_migrations` and does
not reapply them. Back up the database before applying migrations in production.
Redeploy/restart the backend after updating its start command so the auction
migration is applied; the live API currently returns HTTP 500 for the auctions
list endpoint even though its health endpoint is available.

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

## Marketplace accounts

Register the `MULTI_VENDOR_MARKETPLACE` solution with its Marketplace API URL.
From the Super Admin console, use **Marketplace Accounts** to create a seller or
buyer for an active company. The account is created in Community, and the
Marketplace profile is linked automatically; if the Marketplace API is
temporarily unavailable, retry profile setup from the same screen.

Set Marketplace `COMMUNITY_JWT_SECRET` to the same strong secret as Community
`JWT_SECRET_KEY`, and keep `COMMUNITY_JWT_ISSUER` aligned with Community
`JWT_ISSUER` (`ApexiveAI` by default). Marketplace must also validate the
Community access-token audience `apexiveai-solutions` (or the value configured
as Community `JWT_AUDIENCE`). The Community frontend sends the login response's
`access_token` as a Bearer token to both Community and Marketplace APIs. Add the
deployed Marketplace frontend origin to Community's `CORS_ORIGINS` and
Marketplace's `CORS_ORIGINS`. Seller and buyer credentials are Community
credentials and are used on the Marketplace sign-in page.

## Recovering a Super Admin login

An HTTP `401` from `POST /api/auth/login` means the submitted username/password
did not match an account; successful migrations do not create or reset login
credentials. In the Railway backend service environment, run
`python -m app.recover_super_admin` from the backend application directory.
Enter the exact username of an existing, active `SUPER_ADMIN` account and set a
new password when prompted. The command changes only that account's password;
it will not create an account or promote another role.

After resetting, sign in with that username and the new password. If an
authenticated API request returns `401`, the frontend clears the expired
session and redirects to sign in again.

## Vercel frontend and Railway API

Set the Vercel frontend's `NEXT_PUBLIC_API_URL` to
`https://commu-api.apexiveai.com/api` for Production and Preview, then redeploy
so the value is included in the frontend build. The Railway backend allows the
production origins `https://www.apexiveai.com` and `https://apexiveai.com`, as
well as preview deployments matching this project's Vercel URL pattern. If the
Vercel project or team slug changes, update `CORS_ORIGIN_REGEX` in the Railway
service to match the new preview URL pattern.

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