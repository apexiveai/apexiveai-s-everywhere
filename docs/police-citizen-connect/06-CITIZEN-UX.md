# 6. Citizen Mobile App and Web UX

**Platforms:** responsive web, Android and iOS app shell  
**Languages:** Burmese and English  
**Status:** concept; no actual public service is connected

## 6.1 Experience principles

- Clear, plain language; no implication that a submission is an emergency
  call, formal case filing, or guaranteed response.
- A non-digital alternative and verified contact channel wherever available.
- Collect minimum data for the selected service, explain why before requesting
  it, and do not require identity verification for unrelated browsing.
- Do not request background location. Location sharing is off by default and
  tied to a specific request.
- Never display another person's submission, internal notes, witness details
  or restricted case information.
- Provide large touch targets, keyboard/screen-reader support and safe
  behavior on shared devices.

## 6.2 Navigation and screens

Bottom navigation:

1. Home
2. Services
3. My requests
4. Information
5. Profile

### Home

- Language selector and accessibility settings.
- Search approved public information.
- Cards for “Report a non-emergency concern”, “Emergency contacts”,
  “Track my request”, “Find a service office”.
- Emergency contacts card displays verified hotlines and the notice:
  “This app is not monitored for emergencies” unless a live, tested service
  is explicitly enabled.
- Status banner for planned maintenance and service availability.

### Service directory

- Search/filter by service type and location label; no user tracking.
- Each service has owner, eligibility, required data/documents, fees if
  authorized, expected next step, office address/hours and last-reviewed date.
- Out-of-date or unverified listings are hidden or marked unavailable.

### Request wizard

1. Choose service and read purpose/limitations.
2. Review privacy notice and choose account/contact option.
3. Enter only service-required details; use progressive disclosure.
4. Optional attachment: accepted types, size, audience, retention and
  redaction guidance shown before upload.
5. Optional location: explicit one-request permission and editable map/text;
  no background collection and no exact coordinates in push notification.
6. Review all information, edit, then submit with an idempotency token.
7. Confirmation shows a random reference, receipt time and next step.
8. Offline: save an encrypted local draft only; clearly label “Not submitted”
  until the server confirms receipt. Allow view/delete draft.

### My requests and tracking

- Authentication or a high-entropy private reference flow.
- Status timeline displays only approved citizen-visible events.
- Internal notes, restricted attachments, staff identities and investigative
  details are never shown.
- Clarification reply, withdrawal request and correction request are separate
  actions with confirmation.
- Generic push/SMS text (“You have an update”) rather than sensitive content.

### Emergency assistance

- One-tap device call link only to a currently verified number.
- Clearly show data charged/phone-call behavior and alternate channels.
- If an in-app request is approved, before submit explain monitoring hours,
  response process, location use, data recipients and fallback.
- Test accidental activation safeguards and accessibility with users.

### Missing-person / family assistance (gated)

- Not included in the initial pilot without safeguarding approval.
- Private-by-default intake; public notice requires documented authority and
  consent appropriate to age/capacity.
- Child and vulnerable-person data receives restricted handling, short
  review/expiry dates and immediate withdrawal/correction path.
- Never display contact details, exact home/school, or unverified allegation
  publicly.

### Profile, privacy and help

- Minimal profile; optional contact verification only when needed.
- View sessions and sign out all devices.
- Language, notification, consent and accessibility preferences.
- Request correction, account deactivation, data access or deletion subject to
  approved legal retention; show case/reference and review status.
- Explain limitation of self-service deletion where an authorized retention
  hold applies, with contact/escalation route.

## 6.3 Visual and interaction system

- Neutral public-service palette with clear contrast and restrained blue
  primary actions; status not conveyed by color alone.
- Burmese Unicode typography with fallback fonts and tested line wrapping.
- 44×44 CSS pixel minimum touch target; visible focus and screen-reader labels.
- No dark patterns, pre-checked consent, forced account creation for public
  information, or manipulative emergency prompts.
- Plain-language microcopy is professionally translated and community-tested.

## 6.4 Low-connectivity and device privacy

- Cache only public information by default; never cache private records in a
  shared/public browser cache.
- Offline drafts encrypted by platform storage where available, with local
  expiration and explicit delete.
- Queue user action only after clear confirmation; show pending/sent/failed.
- Avoid storing uploads in gallery by default; clear temporary files.
- Sign-out clears local tokens and private cached content.

## 6.5 Usability acceptance

- At least 90% of recruited pilot participants can locate a verified office
  and submit a test request without moderator assistance (target to confirm).
- Participants can distinguish “saved draft” from “submitted” in all tests.
- Burmese/English critical flows pass manual translation, screen-reader,
  keyboard and low-bandwidth review.
- A safety review confirms emergency fallback text is visible and not
  misleading.
