# 7. Security and Data Governance

**Status:** Baseline proposal; must be replaced/validated by independent
security, privacy, legal and human-rights reviews before any real data use.

## 7.1 Governance gates

No pilot data collection until all items below have accountable owners and
signed approval:

1. Written sponsor, service authority, data controller/processor roles and
   public-service purpose.
2. Local counsel's review of current applicable law, cross-border hosting,
   notices/consent, records retention, disclosure and procurement.
3. Data Protection Impact Assessment (DPIA) and Human Rights Impact
   Assessment (HRIA), including vulnerable groups and retaliation risks.
4. Independent security threat model and architecture review.
5. Independent complaint/oversight route and appeals/correction process.
6. Field-level data catalogue, lawful basis, minimization, retention and
   deletion schedule.
7. Service owner, office staffing, emergency fallback and integration
   operational acceptance.
8. User research and accessible Burmese/English notices.

## 7.2 Threat model

Protect against account takeover, privilege misuse, cross-office data leakage,
citizen-reference enumeration, upload malware, API abuse, insider bulk
search/export, notification leakage, mispublication, stolen device, backup
exposure, compromised integration, denial of service and audit tampering.
Consider risks of coercive access, retaliation, mistaken identity, vulnerable
citizen exposure and misuse of legitimate administrative tools.

## 7.3 Identity and access controls

- OIDC with PKCE; MFA mandatory for staff; phishing-resistant MFA for
  privileged access where available.
- Staff accounts individually assigned; no shared accounts.
- Short sessions for privileged actions; reauthentication for export, role
  change and restricted attachment access.
- Server-enforced RBAC plus office, assignment, purpose and record-state
  checks; default deny.
- Quarterly/transfer-triggered access review; time-bound grants; rapid
  revocation and session termination.
- Break-glass access is time-limited, reasoned, alerted, reviewed next
  business day and reported to independent oversight.
- Citizen account recovery uses verified channels and anti-enumeration
  responses; do not reveal registered contact existence.

## 7.4 Data protection

- TLS 1.2+; managed encryption at rest for database, backups and object
  storage; separate key-management roles and rotation.
- Field-level encryption/tokenization only for justified highly sensitive
  values; keys held in managed KMS/HSM-equivalent service, not database.
- Minimize identity attributes; no national ID, biometrics, political,
  religious or unrelated profile data in general service intake.
- Citizen and internal administrative services use separate APIs and
  authorization boundaries; no direct internet access to internal database.
- Mask sensitive fields in lists, logs, notifications and support tools.
- Retention by purpose and class; automatic expiry/deletion with legal-hold
  controls, deletion evidence and backup-expiry handling.
- Data subject correction/access/deletion workflow with documented response
  and lawful exception reason.
- Analytics use aggregation, suppression and non-identifying identifiers;
  no individual ranking or risk scoring.

## 7.5 Application and infrastructure security

- Input schemas, output encoding, CSRF protections where cookie auth applies,
  strict CORS, security headers, request size/time limits and endpoint rate
  limits.
- Upload quarantine, file-signature validation, malware scanning, private
  buckets, short-lived download URLs and download audit.
- Dependency/container scanning, SBOM, signed artifacts, protected CI/CD,
  peer review and separation of duties.
- Separate dev/staging/prod; synthetic data only outside production; no
  production data in developer machines or support tickets.
- Network segmentation; private database endpoints; no direct public DB
  ports; restricted egress and managed secrets.
- WAF/DDoS controls, centralized monitoring and tested alert ownership.
- Independent penetration test before pilot and after material changes;
  do not test against live government systems without written authorization.

## 7.6 Audit and oversight

Audit events include actor, scope, action, resource ID, purpose, timestamp,
result and correlation ID. Sensitive reads, denied access, export requests,
role changes, publication and retention exceptions are recorded.

- Append-only sink with integrity verification, restricted writer and
  independent monitoring.
- No passwords, tokens, full narratives or file content in logs.
- Alert on unusual bulk access/export, repeated denied access, role changes
  and audit pipeline failure; alerts require human review and do not score
  citizens.
- Independent auditor can inspect audit completeness without editing records.
- Access justifications are reviewed on a defined schedule; abusive access
  triggers documented investigation and due process.

## 7.7 Human-rights and safe-use constraints

Prohibited by design, contract and access policy:

- Mass surveillance or profiling by political opinion, ethnicity, religion,
  peaceful assembly, association or protected expression.
- Continuous/background location tracking, covert device collection or mass
  biometric/facial recognition.
- Secret citizen profiles, individual risk scores or automated suspicion.
- AI recommendations on guilt, arrest, detention, force, eligibility denial,
  or legal case outcome.
- Bulk cross-database citizen search without a separately lawful, narrow,
  independently reviewed purpose.

AI assistance (if separately approved) is limited to low-impact administrative
support, clearly labeled, human verified, logged and appealable. Provide
non-AI alternative. No model vendor may retain citizen content for training.

## 7.8 Incident response

Maintain a named response owner, 24/7 escalation arrangement appropriate to
the service, severity matrix, containment steps, evidence preservation,
credential/key rotation, authority/user notification decision process, safe
restore, independent post-incident review and corrective-action tracking.
Conduct tabletop and restore exercises before launch and at least annually.

## 7.9 Risk register (initial)

| Risk | Impact | Required mitigation / gate |
|---|---|---|
| Unclear lawful authority or public trust | Unlawful or harmful collection | Do not launch; legal + HRIA approval |
| Staff overbroad access | Citizen exposure/misuse | Scoped access, justifications, alerts, review |
| Emergency form mistaken as monitored SOS | Delayed assistance | Verified hotline, explicit limitation, agency drill |
| Re-identification in reports | Privacy/retaliation | Aggregation threshold, suppression, review |
| Upload disclosure or malware | Safety/security incident | Quarantine, AV, private storage, access audit |
| Unverified public notice | Harmful/misleading publication | Source, independent approval, expiry and correction |
| Cross-border hosting/data access | Legal and trust risk | Counsel review, residency decision and vendor controls |

## 7.10 Legal source note

The supplied brief includes legal claims and a February 2026 amendment
reference. This pack does not independently verify them and does not provide
legal advice. Local counsel must check current primary legal sources and
applicability before procurement or collection.
