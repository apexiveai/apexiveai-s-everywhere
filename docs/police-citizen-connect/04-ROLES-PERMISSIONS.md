# 4. User Roles and Permission Matrix

**Model:** RBAC + hierarchical scope + resource assignment + purpose checks

Frontend controls are convenience only. The API is the enforcement point.
Every grant has an issuer, reason, scope, effective date and expiry/review
date. Deny by default; elevated access is temporary and audited.

## 4.1 Roles

| Role | Intended scope |
|---|---|
| Platform Super Admin | Platform configuration; no routine citizen-record access |
| Police HQ Admin | Approved HQ administration and minimized aggregate reporting |
| Regional Admin | Authorized assigned region and subordinate offices |
| District Admin | Authorized assigned district and subordinate offices |
| Station Admin | One assigned office; staff, queues and directory within office |
| Service Reviewer | Assigned service queue; initial review and clarification |
| Assigned Service Officer | Explicitly assigned service requests only |
| Content Editor | Draft and edit assigned public information |
| Content Approver | Independent review/approval; cannot approve own draft |
| Privacy / Compliance Officer | Governance requests, access review and retention oversight |
| Independent Auditor | Read-only approved audit scope; no content mutation |
| Citizen | Own profile, consent, submissions and appointments |
| Public Visitor | Published public information only |

Roles such as Case Officer, Legal Reviewer, Evidence Custodian, HR Officer and
Finance Officer are **future restricted roles**, not enabled in the citizen
service pilot. They require a separate SRS, data classification and written
authority.

## 4.2 Permission matrix

Legend: **R** read, **C** create, **U** update, **A** approve, **X** export,
**—** denied. All staff cells are limited by assigned organization/office;
assigned-record and purpose checks may further restrict access.

| Resource / action | Platform Admin | HQ Admin | Regional/District Admin | Station Admin | Reviewer | Assigned Officer | Editor | Approver | Privacy | Auditor | Citizen | Visitor |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Platform configuration | U | — | — | — | — | — | — | — | R | R | — | — |
| Staff account lifecycle | C/U | R/U | R/U | R/U* | — | — | — | — | R | R | — | — |
| Role/scope grant | U** | C/U** | C/U** | C/U** | — | — | — | — | R | R | — | — |
| Public directory | R | R/U | R/U | R/U | R | R | R | A | R | R | R |
| Service catalogue | R | R/U | R/U | R/U | R | R | C/U | A | R | R | R |
| Own service request | — | — | — | — | — | — | — | — | — | — | R/C/U*** | — |
| Assigned request | — | R/X** | R/X** | R/U** | R/U | R/U | — | — | R**** | R**** | — | — |
| Internal notes | — | R** | R** | R** | C/R | C/R | — | — | R**** | R**** | — | — |
| Public content draft | — | R | R | R | R | — | C/U | A | R | R | — | — |
| Publish/unpublish | — | A** | A** | — | — | — | — | A | R | R | — | — |
| Aggregate metrics | — | R | R | R | R | R | — | — | R | R | — | — |
| Person-level export | — | Request only | Request only | Request only | — | — | — | — | A** | R*** | Own-data request | — |
| Audit event mutation | — | — | — | — | — | — | — | — | — | — | — | — |
| Audit event read | — | R** | R** | R** | — | — | — | — | R | R | — | — |
| Retention schedule | — | R | R | — | — | — | — | — | U/A | R | — | — |
| Sensitive attachment | — | Purpose + grant | Purpose + grant | Purpose + grant | Purpose + grant | Assigned + purpose | — | — | Limited review | Read-only scope | Own upload only | — |

`*` Only accounts within delegated office; cannot grant privileged roles.
`**` Requires step-up MFA, reason, scoped approval and audit; high impact
actions require a second approver.
`***` Only fields permitted by service policy; citizens cannot set staff-only
fields or inspect internal notes.
`****` Governance/audit role is read-only and scoped; access to content requires
a documented review purpose.

## 4.3 Scope and authorization rules

1. Effective access = role permission ∩ organizational scope ∩ resource
   assignment ∩ purpose ∩ record state.
2. No access is granted from a client-supplied office, region, account, or
   citizen ID without server-side validation.
3. Staff may not search or export all citizen records. Search is queue- and
   purpose-bounded; bulk export is disabled by default.
4. Citizens can query only their own records; anonymous-reference retrieval
   requires a separate high-entropy secret and throttling.
5. Access to restricted attachments requires an assignment, stated purpose,
   recent MFA and audit log. Repeated access without an active case/task is
   denied and alerted.
6. Platform operations use separate privileged identities and time-limited
   elevation; infrastructure access does not confer business-record access.
7. Separation of duties: request creator cannot approve own privileged role,
   sensitive export, retention exception, content publication or legal hold.
8. Account removal revokes sessions and tokens promptly; historical audit
  actor IDs remain pseudonymized instead of erased from immutable events.

## 4.4 Access review

- Quarterly review for privileged/staff access and at every transfer/role
  change; shorter interval if required by the approved threat model.
- Managers attest account, office scope, purpose and end date.
- Unattested grants expire or are disabled; exceptions require reason and
  privacy-owner approval.
- Test both allowed and denied access for every role/scope combination before
  release.
