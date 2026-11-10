# 9. Test Cases and Acceptance Criteria

Test identifiers trace to SRS requirements. All test data must be synthetic.
Testing against a real government system requires explicit written
authorization and a separate test plan.

## 9.1 Functional and authorization cases

| ID | Test | Expected result |
|---|---|---|
| TC-F-01 | Public visitor opens an approved notice | Published current version loads with owner/review date |
| TC-F-02 | Visitor requests draft or withdrawn notice | Not found; no draft details leak |
| TC-F-03 | Citizen submits valid request twice with same idempotency key | One request/reference; safe replay response |
| TC-F-04 | Citizen submits missing required field | Field-level validation; nothing persisted |
| TC-F-05 | Unauthenticated visitor views private request | Denied without confirming another person's record exists |
| TC-F-06 | Citizen A requests Citizen B's UUID | Generic not-found/forbidden; no data disclosed |
| TC-F-07 | Citizen changes a staff-only status field | Rejected; state unchanged |
| TC-F-08 | Citizen views their request timeline | Only citizen-visible, approved events |
| TC-F-09 | Assigned officer opens assigned request | Permitted within scope; read is audited |
| TC-A-01 | Officer in Office A queries Office B request | Denied, no metadata leak, denial logged |
| TC-A-02 | Reviewer attempts restricted attachment without purpose | Denied and alerted |
| TC-A-03 | Station Admin grants a privileged global role | Denied |
| TC-A-04 | User with expired/disabled account uses old token | Denied and session revoked |
| TC-A-05 | Author tries to approve own content | Denied |
| TC-A-06 | Staff closes request without resolution/reason | Validation error; request remains open |
| TC-A-07 | Export requested without approval | No export artifact created |
| TC-A-08 | Auditor attempts to modify audit event | Denied by API and database privileges |

## 9.2 Privacy, security and abuse cases

| ID | Test | Expected result |
|---|---|---|
| TC-S-01 | Submit oversized/unsupported upload | Rejected before permanent storage |
| TC-S-02 | Upload EICAR or approved harmless malware test fixture | Quarantined; no staff download |
| TC-S-03 | Upload content with MIME/extension mismatch | Rejected or quarantined |
| TC-S-04 | Enumerate references at high rate | Rate-limited; uniform responses; alert generated |
| TC-S-05 | Submit HTML/script in text fields | Stored safely; rendered as text, no script execution |
| TC-S-06 | Inspect logs/traces after synthetic request | No token, full narrative, phone or attachment contents |
| TC-S-07 | Try background location permission | App does not request it |
| TC-S-08 | Deny optional location on request | Submission remains usable without location |
| TC-S-09 | Inspect app analytics | No person-level location or sensitive request contents |
| TC-S-10 | Attempt access after role revocation | New request denied; active sessions invalidated within target |
| TC-S-11 | Stop audit sink | Sensitive operation fails closed or queues safely and alerts; no silent gap |
| TC-S-12 | Run bulk export as ordinary staff | Denied; no artifact or data leak |
| TC-S-13 | Verify absent forbidden capabilities | No facial recognition, political profile, suspect score or automated arrest feature |

## 9.3 Workflow and integration cases

| ID | Test | Expected result |
|---|---|---|
| TC-W-01 | Request transitions through allowed states | Each transition recorded with actor, time, reason |
| TC-W-02 | Attempt invalid transition | Rejected with current state unchanged |
| TC-W-03 | Send clarification | Citizen sees approved message; internal note stays private |
| TC-W-04 | Citizen requests withdrawal | Pending workflow event; record not silently erased |
| TC-W-05 | Schedule content without approval | Rejected; not publicly accessible |
| TC-W-06 | Content expires at scheduled time | Removed from public API; archival record retained per policy |
| TC-W-07 | Provider webhook replay | Signature/time/idempotency prevent duplicate action |
| TC-W-08 | Notification provider unavailable | Bounded retry, visible status, dead-letter alert; request not lost |
| TC-W-09 | Emergency integration disabled | UI clearly shows verified alternatives and no “request sent” claim |

## 9.4 UX, localization and accessibility cases

| ID | Test | Expected result |
|---|---|---|
| TC-U-01 | Complete request on 320px viewport | No blocking horizontal scroll; controls usable |
| TC-U-02 | Keyboard-only full submission | Logical focus, visible focus, no keyboard trap |
| TC-U-03 | Screen-reader form test | Labels, required/errors/status announced correctly |
| TC-U-04 | 200% zoom and text resize | Content remains readable and operable |
| TC-U-05 | Switch Burmese ↔ English mid-flow | No lost form data; translated status/action consistent |
| TC-U-06 | Simulate low bandwidth | Text-first page usable; images non-blocking |
| TC-U-07 | Save offline draft and restart | Draft remains labeled unsent and can be deleted |
| TC-U-08 | Submit failed/offline | No false success; retry preserves idempotency |
| TC-U-09 | User reads emergency notice | Monitoring/fallback limitation understood in usability test |

## 9.5 Recovery and performance cases

| ID | Test | Expected result |
|---|---|---|
| TC-O-01 | Load test agreed pilot profile | p95 read ≤ 500 ms and writes ≤ 1 s at target load |
| TC-O-02 | Restore database to recovery point | Data integrity verified within approved RPO/RTO |
| TC-O-03 | Restore private attachments from backup | Integrity digest matches; authorization remains enforced |
| TC-O-04 | Deploy backward-compatible migration then rollback app | Service remains available; data not corrupted |
| TC-O-05 | Simulate queue worker restart | Jobs process once logically; no duplicate notification/action |
| TC-O-06 | Verify monthly availability reporting | Exclusions/maintenance are explicit and reproducible |

## 9.6 Release acceptance gates

- All mandatory SRS requirements linked to passing tests.
- No open critical/high security issue; medium issues have documented owner,
  mitigation and approval.
- No cross-citizen or cross-office data access in authorization suite.
- DPIA, HRIA, legal review and data-owner approvals signed.
- Emergency and public-directory information verified by service owners.
- Independent penetration test and remediation evidence accepted.
- Burmese/English accessibility/usability review completed.
- Backup restore and incident-response tabletop completed.
- Monitoring, support, retention, deletion and complaint/appeal processes
  staffed before live data.
- Product and procurement owners accept residual risks in writing.
