
# APEXIVEAI COMMUNITY
# Production Deployment Guide

## 1. Prerequisites

- Git
- Docker
- Docker Compose v2
- OwnKube account
- Vercel account
- PostgreSQL database
- Cloudflare DNS access

## 2. Environment Configuration

Create the production environment variables
using the approved secret management system.

Never commit .env to Git.

Required configuration:

- DATABASE_URL
- JWT_SECRET_KEY
- CORS_ORIGINS
- APP_ENV
- PORT

Additional variables must follow the backend
application's actual settings.

## 3. Docker Build

From the project root:

docker compose build

## 4. Configuration Validation

docker compose config

nginx configuration:

docker compose run --rm nginx nginx -t

## 5. Start Services

docker compose up -d

## 6. Verify Services

docker compose ps

docker compose logs --tail=100 api

docker compose logs --tail=100 nginx

## 7. Health Checks

Backend:

GET /health

Nginx:

GET /nginx-health

API:

GET /api/

The actual API endpoint depends on the application
router configuration.

## 8. Database Migration

Take a verified backup before applying
production database migrations.

Run:

bash infrastructure/scripts/migrate.sh

## 9. Frontend Deployment

Deploy the existing frontend through Vercel.

Configure its API environment variable.

Vite:

VITE_API_URL=https://commu-api.apexiveai.com/api

Next.js:

NEXT_PUBLIC_API_URL=https://commu-api.apexiveai.com/api

Use only the variable matching the existing frontend.

## 10. Domain Configuration

API domain:

commu-api.apexiveai.com

Configure DNS according to OwnKube's
assigned endpoint and networking instructions.

TLS should terminate at the platform ingress
or approved edge proxy.

## 11. Post Deployment Verification

- API health
- Database connectivity
- Authentication
- CORS
- Tenant isolation
- Subscription access
- Payment verification
- Error logging
- Backup verification

## 12. Rollback

1. Stop traffic to the faulty deployment.
2. Identify the last healthy image.
3. Redeploy the previous image.
4. Verify API health.
5. Verify database compatibility.
6. Restore database only when necessary
   and after confirming data-loss implications.
