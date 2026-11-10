# 3. Backend API Specification

**Base path:** `/api/v1` · **Format:** JSON over HTTPS · **Status:** Proposal

## 3.1 Conventions

- OIDC/OAuth 2.1 authorization-code + PKCE for clients; staff MFA required.
- Access token lifetime and refresh policy are configured in the identity
  provider. APIs validate issuer, audience, expiry, scopes and account status.
- JSON uses `snake_case`; timestamps are RFC 3339 UTC; opaque IDs are UUIDs.
- `Idempotency-Key` required on create/upload/booking operations.
- `X-Request-ID` is generated at the gateway if absent and returned on every
  response. Do not place PII in query strings.
- Use ETags/`If-Match` for mutable resources and return `409` on stale writes.
- List endpoints use cursor pagination; maximum page size 100.
- Public reference lookups require a high-entropy secret token or signed-in
  ownership check, not a guessable reference alone.
- Rate limits are endpoint-specific and documented to the client; responses
  include `Retry-After`.

## 3.2 Common error envelope

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "One or more fields need attention.",
    "request_id": "uuid",
    "fields": [{"name": "description", "code": "TOO_SHORT"}]
  }
}
```

Codes: `UNAUTHENTICATED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_FAILED`,
`CONFLICT`, `RATE_LIMITED`, `UPLOAD_REJECTED`, `SERVICE_UNAVAILABLE`,
`LEGAL_BASIS_REQUIRED`. Do not reveal whether another person's resource exists.

## 3.3 Public API

| Method & path | Purpose | Auth |
|---|---|---|
| `GET /public/services` | Published service catalogue | Public |
| `GET /public/services/{code}` | Public service requirements and owner | Public |
| `GET /public/offices` | Published office directory, filtered by locality | Public |
| `GET /public/offices/{id}` | Public office details and verified contact channels | Public |
| `GET /public/notices` | Current approved public information | Public |
| `GET /public/notices/{slug}` | Notice detail, locale, source and effective dates | Public |
| `GET /public/emergency-contacts` | Verified informational contacts only | Public |

Directory filters must not support bulk personal lookup, surveillance,
unbounded scraping or person-level search.

## 3.4 Citizen API

| Method & path | Purpose |
|---|---|
| `GET /me` | Current minimal profile |
| `PATCH /me` | Update permitted profile/preferences |
| `GET /me/sessions` | List own active sessions |
| `DELETE /me/sessions/{id}` | Revoke own session |
| `GET /me/consents` | View own notices/choices |
| `PUT /me/consents/{purpose}` | Record or withdraw a choice |
| `POST /requests` | Submit a non-emergency service request |
| `GET /me/requests` | List own requests, cursor paginated |
| `GET /me/requests/{id}` | Own request with citizen-visible fields only |
| `POST /me/requests/{id}/messages` | Add information to own request |
| `POST /me/requests/{id}/withdrawal` | Request withdrawal; not silent deletion |
| `POST /me/requests/{id}/attachments` | Upload to quarantine |
| `GET /me/appointments/slots` | Read allowed appointment slots |
| `POST /me/appointments` | Book an approved service slot |
| `PATCH /me/appointments/{id}` | Reschedule/cancel own appointment |
| `POST /me/data-requests` | Submit correction, export or deletion request |

### Create request example

`POST /api/v1/requests` with `Idempotency-Key: <random-client-token>`

```json
{
  "service_code": "GENERAL_SERVICE_REQUEST",
  "locale": "my",
  "description": "A concise description of the service request.",
  "occurred_at": null,
  "location": null,
  "contact_preference": "IN_APP",
  "consent_notice_version": "citizen-notice-1.0",
  "attachment_ids": []
}
```

Successful response: `202 Accepted`

```json
{
  "id": "opaque-uuid",
  "reference": "PCC-<non-sequential-random-reference>",
  "status": "RECEIVED",
  "created_at": "2026-11-10T00:00:00Z",
  "next_step": "A service reviewer will assess the submission."
}
```

Do not include a promise of response time until the service owner sets and
funds a service-level target. `location` is omitted unless the selected
service requires it; no background location is collected.

## 3.5 Staff API

| Method & path | Permission |
|---|---|
| `GET /staff/queues` | `request.queue.read` within assigned office scope |
| `GET /staff/requests/{id}` | Assigned request or office scope + declared purpose |
| `POST /staff/requests/{id}/assignment` | `request.assign` + reason |
| `POST /staff/requests/{id}/transitions` | `request.transition` + allowed transition |
| `POST /staff/requests/{id}/messages` | `request.respond` |
| `POST /staff/requests/{id}/access-justifications` | Required for restricted access |
| `GET /staff/appointments` | `appointment.read` within office scope |
| `GET /staff/metrics` | `metrics.read`; aggregate/suppressed only |
| `POST /staff/exports` | Export request; approval workflow required |
| `GET /staff/audit-events` | Auditor permission and assigned audit scope |

Every staff record read of confidential/restricted data records actor, purpose,
record, action, result and request ID. Assignment is not permission to browse
unrelated records.

## 3.6 Administration and content API

| Method & path | Purpose |
|---|---|
| `GET/POST /admin/accounts` | Search/create staff accounts (no citizen bulk search) |
| `PATCH /admin/accounts/{id}` | Disable or update account with reason |
| `PUT /admin/accounts/{id}/roles` | Grant/revoke role, scope, expiry and reason |
| `GET/POST /admin/offices` | Maintain office records |
| `PATCH /admin/offices/{id}` | Update verified public details |
| `GET/POST /admin/services` | Configure service catalogue |
| `POST /admin/notices` | Create draft content |
| `POST /admin/notices/{id}/review` | Submit/check for independent review |
| `POST /admin/notices/{id}/approval` | Approve/reject, separated from author |
| `POST /admin/notices/{id}/publication` | Schedule/publish/unpublish |
| `GET /admin/governance/retention` | View approved schedules |
| `POST /admin/governance/exports` | Review bounded export proposal |
| `GET /admin/audit/events` | Search audited administrative actions |

Sensitive changes require an `If-Match` version and a non-empty reason code.
Privileged role changes and person-level exports require two-person approval.

## 3.7 Workflow states

Request: `RECEIVED → UNDER_REVIEW → ASSIGNED → WAITING_FOR_CITIZEN →
IN_PROGRESS → RESOLVED → CLOSED`. Reopen: `CLOSED → REOPEN_REQUESTED →
UNDER_REVIEW`. `WITHDRAWAL_REQUESTED` is a separate event/state gate.
Transitions are configured by service, authorized by role, and never imply a
legal case outcome.

Content: `DRAFT → IN_REVIEW → APPROVED → SCHEDULED → PUBLISHED → ARCHIVED`;
`REJECTED` and `WITHDRAWN` require reason. The author cannot be sole approver.

## 3.8 File upload

1. `POST /me/requests/{id}/attachments` obtains a short-lived upload intent.
2. Upload goes to private quarantine storage, not a public bucket.
3. Server enforces size, extension/MIME allowlist, file signature, malware
   scan and retention classification.
4. Staff access uses short-lived signed URLs after per-record authorization.
5. Reject active content and unsupported formats; never trust client MIME.

## 3.9 Webhooks and integrations

Integrations are disabled until provider and agency owners are approved.
Inbound webhooks require signature verification, timestamp window, replay
protection, idempotency and allowlisted source. Outbound messages use a queue,
retry with bounded backoff, dead-letter review and delivery audit. Never place
complaint content or identity data in SMS/push previews by default.

## 3.10 OpenAPI and versioning

Publish a machine-readable OpenAPI 3.1 document for each release. Breaking
changes require `/v2` or a documented migration window. Deprecation includes
owner, sunset date, client notice and compatibility test. This document
defines the API contract; server implementation and OpenAPI generation remain
future work.
