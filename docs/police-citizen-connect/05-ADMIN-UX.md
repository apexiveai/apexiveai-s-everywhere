# 5. Police Admin Dashboard UI/UX

**Audience:** authorized service administrators and reviewers  
**Status:** interaction specification; not an operational police interface

## 5.1 Design goals

- Make incoming public-service work visible without exposing unrelated
  citizen information.
- Keep review, assignment, response and closure decisions human-led.
- Make the current user, office scope, data sensitivity and audit implications
  visible at the point of action.
- Support Burmese/English, keyboard-only operation and low-bandwidth sessions.
- Avoid crime maps, suspect profiles, predictive queues, enforcement KPIs or
  person ranking.

## 5.2 Information architecture

1. Overview
2. Service requests
   - Assigned to me
   - Office queue
   - Waiting for citizen
   - Closed / reopen requests
3. Appointments
4. Public information
   - Pages and FAQs
   - Notices and campaigns
   - Review / approval queue
5. Public directory
6. Service catalogue
7. Notifications
8. Reports (aggregate only)
9. Accounts and access review (delegated roles only)
10. Privacy, retention and data requests
11. Audit log (read-only)
12. System settings (platform operators only)

## 5.3 Shared shell

- Persistent header: ApexiveAI product mark, environment badge (`DEMO`,
  `STAGING`, or `PRODUCTION`), locale switch, notification count, user and
  scoped office.
- Left navigation is role-filtered but APIs independently authorize every
  action.
- Show an always-visible scope banner: “Viewing: [office] · [role]”.
- Confidential record screens include sensitivity label, assigned purpose,
  last access and a “Report incorrect data” action.
- Session timeout warning, explicit sign-out and accessible error recovery.

## 5.4 Overview dashboard

### Layout

- Page title and office scope; date range limited to approved windows.
- Aggregate cards: newly received requests, awaiting staff review, waiting for
  citizen, appointments due, content awaiting approval.
- Work queue table: opaque reference, service type, received time, status,
  priority only if a service policy defines it, assigned owner.
- Recent administrative actions are current-user/scope-filtered.
- System notices: integration outage, pending access review, content expiry.

### Data safeguards

- No citizen names or phone numbers on overview cards.
- Suppress any subgroup below an approved minimum count (initial proposal:
  fewer than 10), with threshold validated for re-identification risk.
- No comparative officer leaderboard or complaint/arrest outcome quotas.
- No map of person-linked incidents; location-level analytics require a
  separate privacy assessment.

## 5.5 Request review workflow

1. Open a row to a detail screen; verify scope and assignment.
2. Show citizen-provided data separately from system-derived metadata.
3. Request clarification using a template; preview the exact citizen-visible
   message before sending.
4. Assign to an authorized office/officer; reason required and reassignment is
   logged.
5. Add an internal note in a visually distinct private panel; warn that it is
   not sent to the citizen.
6. Transition only to valid service states; explain the effect before commit.
7. Closure requires a resolution category and citizen-visible response;
   closure does not make or imply a legal finding.
8. Show append-only timeline with actor, timestamp, action and visibility.

### Table behavior

- Search only within authorized queue, by reference or permitted fields.
- Filters for status, service type, received date and assigned staff.
- Export disabled by default; if authorized, require purpose, bounded filter,
  second approval, expiry, watermark and audit event.
- No bulk download of attachments.

## 5.6 Content approval

- Separate editor and approver roles.
- Show source, owner, locale, accessibility checks, effective/expiry dates,
  and previous versions.
- Approval/rejection requires a reason.
- Public preview exactly matches rendered publication.
- Scheduled content automatically expires or returns for review.
- Emergency notice publication requires a separately approved authority and
  clear correction/withdrawal route.

## 5.7 Access review and audit

- Access review screen lists role, scope, grantor, purpose, expiry, last
  activity and manager attestation.
- Audit search is permission-scoped, read-only and purpose-gated.
- Sensitive access events can be exported only with approval; export file is
  encrypted, watermarked and automatically expires.
- Audit UI must never expose tokens, passwords, full attachment content or
  unnecessary citizen narrative.

## 5.8 States, accessibility and responsiveness

- Every list has loading, empty, error, permission-denied and stale-data
  states.
- Confirm destructive/high-impact actions with a summary and reason field;
  never use ambiguous “OK”.
- Responsive: desktop data table; tablet compact table; mobile stacked
  request cards. Avoid horizontal scroll as the only way to operate.
- WCAG 2.2 AA target: focus order, visible focus, contrast, screen-reader
  names, errors linked to fields, 200% zoom and reduced-motion support.
- Locale switch preserves current workflow; dates/time zone are explicit.

## 5.9 Demo boundary

The product page preview is static and contains no live dashboard service,
records, metrics, or login. Production UI must be deployed separately behind
approved identity controls and an authorized environment.
