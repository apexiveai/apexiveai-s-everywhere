# 1. Software Requirements Specification

**Version:** 0.1 · **Status:** Preliminary / subject to discovery and approval

## 1.1 Purpose

Define the proposed requirements for Police Citizen Connect (PCC), a
Myanmar/English public-information and citizen-service platform comprising a
responsive citizen web experience, mobile application, public information
site, and role-restricted service-administration portal.

This SRS describes a proposed product, not an operating police system. No
operational, investigative, emergency-dispatch, identity-verification, or
government integration is active in the current concept page.

## 1.2 Product goals

1. Make approved public-service information easier to find on low-bandwidth
   devices and in Burmese or English.
2. Allow a person to submit and privately follow an authorized service
   request without exposing records to other citizens.
3. Give authorized staff a bounded workflow for receiving, reviewing,
   assigning, and responding to requests.
4. Make access, publication, correction, export, and administrative changes
   accountable and auditable.
5. Minimize collected personal data and make lawful purpose, retention, and
   human review explicit.

## 1.3 Scope

### Citizen-facing

- Public information, reviewed announcements, safety guidance, and FAQs.
- Public office/service directory and verified contact details.
- Account creation and recovery where an account is needed for a service.
- Non-emergency service-request submission, acknowledgement, follow-up, and
  withdrawal request.
- Private request status, appointment details, and document-request notices.
- Appointment and certificate application workflows only where the service is
  legally authorized and operationally supported.
- Emergency contact guidance and one-tap call links only after contact
  details are verified. No implied dispatch or monitoring.
- Optional missing-person/family-assistance workflow only after child-safety,
  consent, publication, and safeguarding review.
- Burmese/English localization, accessibility, and low-bandwidth support.

### Authorized administration

- Organization and office directory configuration.
- Staff accounts, roles, scopes, MFA, and access review.
- Request triage, assignment, allowed status transitions, service response,
  and citizen notifications.
- Public content review, approval, scheduling, publication, and archive.
- Appointment capacity and service configuration.
- Aggregate service metrics with minimum group-size safeguards.
- Audit review, retention management, export approvals, and incident records.

### Future modules (not Phase 1 and not automatically authorized)

The supplied brief also proposes personnel/HR, station operations, formal
case records, evidence/custody, traffic administration, cybercrime intake,
court coordination, fleet/assets, finance/procurement, training, audit,
disaster assistance, and interdepartmental coordination. These are separate
modules requiring separate data-purpose, legal, access, operational, and
rights reviews. The initial citizen-service deployment does not create an
investigative case-management or evidence-forensics system.

### Supplied 37-module inventory and release disposition

This inventory preserves the supplied brief's coverage. Listing a module is
not authorization to build it. **Pilot** means the bounded public-service
foundation described above; **Gated** requires a new signed scope and
independent review; **Excluded** is prohibited.

| # | Module from brief | Disposition | Boundary / decision |
|---:|---|---|---|
| 1 | Central police headquarters / organization administration | Gated | Directory and organization metadata only after owner approves |
| 2 | Police personnel and HR | Gated | Employee administration is a separate restricted system and DPIA |
| 3 | Police station operations | Gated | Public office directory is pilot; internal rosters/assets are separate |
| 4 | Incident and complaint management | Gated | Pilot handles only authorized service requests; formal complaints need legal process |
| 5 | Formal case management | Gated | Records administration only; never a judicial decision system |
| 6 | Evidence and digital forensic records | Gated | Not in pilot; separate custody, legal and independent security design |
| 7 | Emergency/public-safety coordination | Gated | Verified public contacts first; live dispatch only after staffed agency integration |
| 8 | Traffic administration | Gated | Public road-safety information may be approved; citations/violations separate |
| 9 | Cybercrime reporting | Gated | Intake must have specialist owner, victim safeguards and approved evidence policy |
| 10 | Court/legal coordination | Gated | No court data exchange without court authority and legal review |
| 11 | Fleet and assets | Gated | Administrative asset inventory only under a separate scope |
| 12 | Training and professional development | Gated | Staff learning records require HR owner and retention rules |
| 13 | Internal audit/accountability | Gated | Independent complaint review and due-process protections required |
| 14 | Police command/admin dashboards | Gated | Aggregate administrative metrics only; no personal risk or enforcement quotas |
| 15 | Citizen account/profile | Pilot | Minimal, optional profile; service-specific verification only |
| 16 | Online police complaint portal | Gated | Non-emergency service intake pilot is not a formal complaint filing |
| 17 | Emergency help/SOS | Gated | Verified contact information; no implied dispatch or background location |
| 18 | Missing-person/family assistance | Gated | Child/vulnerable-person safeguards, consent and publication review first |
| 19 | Citizen case tracking | Gated | Pilot tracks own service request, not confidential legal/investigative case |
| 20 | Police station/public directory | Pilot | Public contacts must be verified, owned and periodically reviewed |
| 21 | Police clearance/certificate | Gated | Authority, fee, identity, review and issuance process must be approved |
| 22 | Appointment booking | Pilot candidate | Enable only for staffed services with confirmed capacity |
| 23 | Citizen rights/legal information | Pilot candidate | Publish reviewed informational content with source and legal disclaimer |
| 24 | Citizen notifications | Pilot | Generic, minimized notices; approved channel and opt-out/preferences |
| 25 | Citizen feedback/service evaluation | Pilot candidate | Minimize and aggregate; independent complaints path required |
| 26 | Public information portal | Pilot | Only approved, versioned and time-bounded information |
| 27 | Central IAM | Pilot | OIDC/MFA, RBAC, scopes, session revocation and access review |
| 28 | API gateway/integrations | Pilot | Versioned and rate-limited; external integrations separately approved |
| 29 | Document/signature management | Gated | Secure document intake can be piloted; legal digital signature is separate |
| 30 | Central notification infrastructure | Pilot candidate | Email/SMS/push provider and message content require approval |
| 31 | Cybersecurity/data protection | Pilot | Mandatory design and independent assurance gates |
| 32 | Database/data governance | Pilot | Field catalogue, purpose, retention, access and deletion controls required |
| 33 | AI-assisted administration | Gated | Optional low-impact assistance only; no legal/enforcement decisions or scoring |
| 34 | Finance and budget | Gated | Separate financial authority, segregation of duties and audit |
| 35 | Procurement and suppliers | Gated | Formal procurement controls and conflict-of-interest review |
| 36 | Disaster/community assistance | Gated | Service-owner and safeguarding review; no unverified emergency promise |
| 37 | Government interdepartmental coordination | Gated | Written agency agreements, data-sharing purpose and audit first |

No phase includes mass surveillance, political/assembly monitoring, biometric
identification, unrestricted cross-database search, or automated citizen risk
assessment. These remain excluded even if other gated administrative modules
are later approved.

## 1.4 Out of scope and prohibited

- Surveillance, political-opinion or peaceful-assembly monitoring.
- Mass facial recognition, biometric matching, or citizen risk/suspect scores.
- Background or continuous location collection. Location may be attached only
  to a user-initiated service request with clear, specific consent.
- Automated arrest, detention, guilt, case outcome, service-denial, or
  disciplinary recommendation.
- Automated case closure or legal decisions.
- Direct citizen self-service access to internal police, personnel, case, or
  evidence databases.
- Unverified emergency dispatch, real-time officer/vehicle tracking, or any
  claim that an online form is an emergency channel.
- Payment, certificate issuance, digital signature, OTP, SMS, push, identity,
  or third-party integration until the provider, legal authority, and
  operating process are approved.

## 1.5 Stakeholders and actors

| Actor | Interest / boundary |
|---|---|
| Citizen / public visitor | Public information; own submissions only |
| Service desk reviewer | Initial completeness and service routing |
| Assigned service officer | Assigned requests within office and purpose scope |
| Station / office administrator | Local queues, directory and staff configuration |
| Regional / HQ administrator | Approved aggregate administration within assigned scope |
| Content editor / approver | Draft and approve public information, separated duties |
| Privacy / compliance officer | Purpose, retention, access, correction and rights oversight |
| Independent auditor | Read-only, scoped audit evidence |
| Platform operator | Infrastructure administration; no default business-record access |
| Emergency service owner | Verifies published contact details; separate response responsibility |

## 1.6 Functional requirements

Priority: **M** mandatory for pilot, **S** subsequent phase, **G** gated by
written authority and independent review.

### Identity, organization and access

- **FR-IAM-01 (M):** Support OIDC-compatible authentication; use MFA for all
  staff and privileged roles.
- **FR-IAM-02 (M):** Enforce role, organizational scope, record ownership,
  purpose, and action authorization on the server for every protected API.
- **FR-IAM-03 (M):** Support account disablement, session revocation, recovery,
  periodic access review, and auditable role/scope changes.
- **FR-IAM-04 (M):** Public visitors can read only published public content.
- **FR-ORG-01 (M):** Maintain versioned organization and public office
  directory records with named owners and review dates.
- **FR-IAM-05 (M):** Citizen registration is optional unless a specific
  service requires authenticated follow-up; collect only the fields needed.

### Citizen services

- **FR-CIT-01 (M):** Display approved information with language, effective
  date, owner, and review status.
- **FR-CIT-02 (M):** A citizen may submit a service request with a generated,
  non-sequential reference and clear receipt confirmation.
- **FR-CIT-03 (M):** Validate request fields, upload type/size, consent,
  duplicate/idempotency token, and anti-bot controls.
- **FR-CIT-04 (M):** Allow a user to view only their own request and only
  fields approved for citizen disclosure.
- **FR-CIT-05 (M):** Support clarification/follow-up, withdrawal request, and
  notification preferences; preserve an auditable history.
- **FR-CIT-06 (M):** Provide accessible, responsive, low-bandwidth pages and
  save an unsent draft locally with clear deletion controls.
- **FR-CIT-07 (S):** Support appointment booking with office calendars,
  configurable capacity, cancellation, rescheduling and reminders.
- **FR-CIT-08 (S/G):** Support certificate applications only after the
  service owner approves eligibility, documents, fees, review authority, and
  issuance process.
- **FR-CIT-09 (G):** Emergency assistance integration must clearly state
  whether a request is monitored, provide verified alternatives, and pass
  end-to-end agency drills before activation.
- **FR-CIT-10 (G):** Missing-person notices require documented authority,
  guardian/subject consent as applicable, safeguarding review, minimal
  disclosure and an expiration date.

### Staff workflow and content

- **FR-OPS-01 (M):** Staff may see only requests assigned to them or within
  their explicitly authorized office scope.
- **FR-OPS-02 (M):** Status changes follow configured transitions and record
  actor, timestamp, prior/new state, reason, and request identifier.
- **FR-OPS-03 (M):** Staff notes are internal by default and never appear in a
  citizen response without explicit review and publication.
- **FR-OPS-04 (M):** Reassignment, closure, reopening, export and sensitive
  record access require a reason and audit record.
- **FR-CMS-01 (M):** Public content follows Draft → Review → Approved →
  Scheduled/Published → Archived. Author cannot approve own content.
- **FR-CMS-02 (M):** Only approved, in-date content can be public.
- **FR-ORG-02 (S):** Directory and service hours changes are versioned and
  require a named owner and next review date.
- **FR-AN-01 (M):** Admin dashboards show aggregate service workload only;
  enforce suppression of small groups and prohibit individual scoring.

### Administration, integrations and audit

- **FR-AUD-01 (M):** Log authentication, authorization failures, record reads
  of sensitive data, changes, exports, publication and administrative actions.
- **FR-AUD-02 (M):** Audit entries are append-only for application roles;
  access is restricted and integrity is independently monitored.
- **FR-DOC-01 (M):** Store uploads in private object storage with quarantine,
  malware scanning, type validation, size limits, retention tags and
  short-lived authorized download links.
- **FR-INT-01 (S/G):** External SMS/email/push/payment/government services use
  allowlisted integrations with signed webhooks, idempotency, retries and
  operational ownership.
- **FR-REP-01 (S):** Report exports are aggregate by default; person-level
  exports need a defined purpose, narrow scope, two-person approval and audit.
- **FR-AI-01 (G):** Optional translation/OCR/categorization may assist staff
  only, must be labeled, minimize input, retain no provider copies, and require
  human verification. No consequential automated decisions.

## 1.7 Core workflows

### Non-emergency request

Public information → user selects service → privacy notice and minimum data
collection → validation and duplicate check → reference generation →
acknowledgement → scoped human review → assignment/clarification → authorized
service work → approved citizen-visible update → closure/feedback → retention
and deletion under schedule.

### Appointment

Select office and approved service → show verified available slots → reserve
with idempotent request → confirm and notify → reschedule/cancel → record
attendance outcome without collecting unrelated data.

### Public content publication

Editor creates version → reviewer checks source, language, dates, accessibility
and owner → separate approver authorizes → schedule/publish → log publication
→ expiry/review reminder → archive or withdraw with reason.

### Emergency information

Show verified hotline and clear limitations. An online emergency request is
disabled until an accountable agency confirms staffing, monitoring, response
SLA, fallback channel, accessibility, location consent and incident drills.

## 1.8 Non-functional requirements

Targets are proposed pilot targets to validate during discovery:

| ID | Requirement / initial target |
|---|---|
| NFR-AVL-01 | 99.5% monthly availability for pilot, excluding announced maintenance |
| NFR-PERF-01 | p95 read API ≤ 500 ms and p95 ordinary write ≤ 1 s at agreed pilot load |
| NFR-PERF-02 | Citizen first contentful render ≤ 3 s on agreed low-bandwidth profile |
| NFR-SEC-01 | TLS 1.2+ in transit; managed encryption at rest; secrets outside source |
| NFR-SEC-02 | MFA for staff; short-lived access; revocable sessions; least privilege |
| NFR-PRIV-01 | Purpose and retention set for every PII field before production |
| NFR-AUD-01 | 100% of defined privileged actions and sensitive reads produce audit events |
| NFR-ACC-01 | WCAG 2.2 AA target, verified with automated and manual testing |
| NFR-L10N-01 | Burmese Unicode and English, locale-aware dates/numbers, reviewed translations |
| NFR-RES-01 | RPO ≤ 24 h and RTO ≤ 8 h initially; tighten only after funded DR design |
| NFR-REL-01 | Idempotent submissions and recoverable queue processing |
| NFR-COMP-01 | Supported current Chrome, Edge, Firefox, Safari; Android/iOS versions agreed at pilot |
| NFR-MNT-01 | Versioned OpenAPI, migration rollback plan, documented runbooks |

## 1.9 Assumptions, dependencies and open decisions

- Government sponsor, service owner, lawful authority, data controller and
  incident-response owner must be identified.
- Approving authorities must verify the latest local laws and procurement
  requirements; this specification is not legal advice.
- Confirm initial pilot geography, service catalogue, service hours and
  languages.
- Decide whether anonymous intake is lawful and operationally supportable;
  if allowed, it has a separate review queue and is not represented as a
  formal complaint or emergency report.
- Decide data residency, hosting operator, support access, and cross-border
  restrictions.
- Confirm emergency contact owner, hotline validity and response process.
- Confirm SMS/email/push vendors, identity provider, storage and payment
  integrations.
- Set approved field-level retention and legal-hold rules.

## 1.10 Release acceptance

A release is not accepted until all mandatory requirements are traceable to
tests; no critical/high security issue is open; legal, privacy and
human-rights reviews are signed; role and scope tests pass; citizen access
isolation passes; backup restore is demonstrated; Burmese/English and
accessibility review is complete; operational owners and fallback channels
are confirmed; and the production notice explicitly describes what the service
does and does not do.
