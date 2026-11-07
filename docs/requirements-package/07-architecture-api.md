# Solution Architecture, MongoDB Model, Audit Model, and API Contract

## 1. Architecture

```text
Staff browser
    |
    | HTTPS + secure cookie + CSRF/origin protection
    v
Next.js App Router
    |- Server Components: permission-scoped reads
    |- Route Handlers: API boundary, Zod validation
    |- Services: authorization, business rules, audit
    |- Repositories: MongoDB queries only
    |- Background worker: exports, retention, reminders
    |
    +--> MongoDB Atlas (private/restricted network access)
    +--> Private object storage (temporary exports)
    +--> Protected logs/metrics/error monitoring (redacted)
```

### Technology decisions

- Next.js App Router, strict TypeScript, Node runtime for database/auth routes.
- Official MongoDB Node.js driver. Do not connect to MongoDB from Edge middleware or client components.
- React Hook Form + Zod; the server imports the same field contracts but independently applies workflow/authorization.
- Tailwind CSS + accessible Radix-style primitives; TanStack Table for state/UI, with server-owned queries.
- Opaque session tokens generated with a cryptographically secure RNG; only SHA-256/HMAC token hash stored; Argon2id password hashes.
- A worker/queue is required before large exports or scheduled retention. The concrete queue provider is an implementation decision constrained by deployment.

## 2. Module boundaries

```text
features/
  auth/          session, password, account policy
  intake/        form definitions, draft/save/submit, validation
  cases/         querying, assignment, workflow, revisions
  referrals/     directory, referral lifecycle, disclosure authorization
  exports/       profiles, jobs, temporary files
  privacy/       requests, holds, anonymization workflow
  audit/         append-only event API and query policy
  administration/users, teams, locations, form deployment
lib/
  db/ security/ observability/ errors/ i18n/
```

Repositories cannot authorize. Services require an `ActorContext` and make the authorization decision before repository access. All sensitive mutations write business data and an audit outbox/event in the same MongoDB transaction when supported.

## 3. Common document requirements

Every tenant-owned document contains:

```ts
type TenantDocument = {
  _id: ObjectId;
  tenantId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  version: number;
};
```

- Store dates as BSON dates in UTC.
- API IDs are UUIDs or opaque references; raw ObjectIds are never exposed as user-facing case identifiers.
- `version` supports optimistic concurrency.
- Do not store localized labels in case answers; store stable keys/values and render via the referenced form definition.

## 4. MongoDB collections

### `tenants`

```ts
{
  _id, slug, displayNameUr, displayNameEn,
  defaultLanguage: "ur",
  timezone: "Asia/Karachi",
  status: "active" | "suspended",
  securityPolicy: { inactivityMinutes, absoluteSessionHours },
  createdAt, updatedAt, version
}
```

Indexes: unique `{slug: 1}`.

### `users`

```ts
{
  _id, tenantId,
  userId: UUID,
  emailNormalized,
  emailDisplay,
  name,
  passwordHash,
  status: "invited" | "active" | "disabled",
  roles: [{ role, teamIds, locationIds, fieldClearance, expiresAt }],
  safeguardingTrainingValidUntil,
  passwordChangedAt,
  failedLoginState: { count, windowStartedAt, lockedUntil },
  lastLoginAt,
  createdAt, updatedAt, version
}
```

Indexes:

- unique `{tenantId: 1, emailNormalized: 1}`.
- `{tenantId: 1, status: 1}`.
- `{tenantId: 1, "roles.teamIds": 1}`.

Password hashes are excluded from standard projections and never returned by API.

### `sessions`

```ts
{
  _id, tenantId, sessionId: UUID,
  userId,
  tokenHash,
  createdAt, lastSeenAt, expiresAt, absoluteExpiresAt,
  revokedAt, revokeReason,
  userAgentHash, ipRiskPrefix,
  version
}
```

Indexes:

- unique `{tokenHash: 1}`.
- TTL `{expiresAt: 1}` with `expireAfterSeconds: 0`.
- `{tenantId: 1, userId: 1, revokedAt: 1}`.

### `teams` and `locations`

Contain opaque ID, tenant, bilingual name, active state, manager IDs, and hierarchy/region as approved.

Indexes: unique active code per tenant; tenant/status.

### `formDefinitions`

```ts
{
  _id, tenantId,
  formKey: "migration-intake",
  version: "1.0.0",
  status: "draft" | "approved" | "deployed" | "retired",
  schemaHash,
  sections: [...], fields: [...], rules: [...],
  privacyNoticeVersions: { ur, en },
  approvedBy, approvedAt, deployedAt,
  createdAt, updatedAt
}
```

Indexes: unique `{tenantId: 1, formKey: 1, version: 1}`; partial unique deployed version by formKey/tenant.

### `cases`

Operational summary and query projection only; the complete submitted answer snapshots live in revisions.

```ts
{
  _id, tenantId,
  caseId: UUID,
  caseReference,
  formKey, formVersion,
  currentRevision: 2,
  workingRevision: 3 | null,
  status,
  language,
  sourceChannel, officeLocationId,
  applicantSummary: {
    displayName,
    phoneSearchHash?,
    phoneLast4?,
    district?, provinceOrTerritory?
  },
  migrationSummary: {
    stage, purpose, destinationCountry?, targetSector?
  },
  attentionSignalCodes: [],
  reviewPriority,
  assignedTeamId, assignedUserId,
  referralSummary: { activeCount, overdueCount, latestStatus? },
  submittedAt, closedAt, archivedAt,
  retention: { category, reviewAt, holdIds: [] },
  createdBy, createdAt, updatedAt, version
}
```

Indexes:

- unique `{tenantId: 1, caseReference: 1}`.
- unique `{tenantId: 1, caseId: 1}`.
- `{tenantId: 1, status: 1, updatedAt: -1, _id: -1}`.
- `{tenantId: 1, assignedTeamId: 1, status: 1, updatedAt: -1}`.
- `{tenantId: 1, assignedUserId: 1, status: 1, updatedAt: -1}`.
- `{tenantId: 1, officeLocationId: 1, status: 1, updatedAt: -1}`.
- `{tenantId: 1, "migrationSummary.destinationCountry": 1, status: 1}`.
- `{tenantId: 1, attentionSignalCodes: 1, status: 1}`.
- `{tenantId: 1, "retention.reviewAt": 1}`.

Name/phone search: prefer exact/prefix-specific normalized search with protected deterministic hash where required. Do not create a broad public text index across PII/free text.

### `caseRevisions`

```ts
{
  _id, tenantId, caseId,
  revisionNumber,
  formVersion,
  state: "working" | "submitted" | "superseded",
  answers: { /* stable field keys, encrypted fields where architecture approves */ },
  applicableFieldKeys: [],
  validation: { ruleVersion, validatedAt, errors: [] },
  consentSnapshot: { noticeVersion, language, deliveryMode, capturedAt, capturedBy },
  changeReason?, correctionRequestId?,
  createdBy, submittedBy?, createdAt, submittedAt?, version
}
```

Indexes:

- unique `{tenantId: 1, caseId: 1, revisionNumber: 1}`.
- partial unique `{tenantId: 1, caseId: 1, state: 1}` for `state = working`.
- `{tenantId: 1, caseId: 1, submittedAt: -1}`.

Submitted snapshots are immutable through application permissions.

### `caseTransitions`

```ts
{
  _id, tenantId, transitionId: UUID, caseId,
  fromStatus, toStatus,
  reasonCode, rationale,
  affectedFieldKeys?,
  actorId, actorRole,
  occurredAt, requestId,
  caseVersionBefore, caseVersionAfter
}
```

Indexes: `{tenantId: 1, caseId: 1, occurredAt: 1}`; `{tenantId: 1, actorId: 1, occurredAt: -1}`.

### `referralDirectory`

```ts
{
  _id, tenantId, directoryEntryId: UUID,
  category, countryCode?,
  nameUr, nameEn,
  contactDisplay,
  officialSource,
  verifiedAt, verifiedBy, reviewDueAt,
  status: "draft" | "active" | "stale" | "retired",
  createdAt, updatedAt, version
}
```

Indexes: unique tenant/directoryEntryId; tenant/category/status; tenant/reviewDueAt.

### `referrals`

Contains the dictionary fields plus `caseId`, actor timestamps, status history, and version.

Indexes:

- unique `{tenantId: 1, referralId: 1}`.
- `{tenantId: 1, caseId: 1, createdAt: -1}`.
- `{tenantId: 1, ownerId: 1, status: 1, dueAt: 1}`.
- `{tenantId: 1, status: 1, dueAt: 1}`.

### `exportJobs`

```ts
{
  _id, tenantId, exportId: UUID,
  requestedBy, purpose,
  filterSnapshot, fieldProfile, fieldKeys,
  status: "queued" | "running" | "ready" | "failed" | "expired",
  rowCount?, objectKey?, checksum?,
  requestedAt, completedAt?, expiresAt,
  downloadedAt?, version
}
```

Indexes: unique tenant/exportId; tenant/requestedBy/requestedAt; TTL on a separate cleanup marker only after metadata retention decision. Delete object at expiry while retaining safe audit metadata.

### `privacyRequests` and `retentionHolds`

Restricted collections with explicit owner, decision, due/review date, reason, actions, and completion metadata. These are not embedded into cases to keep access separately enforceable.

### `auditEvents`

See section 6.

### `idempotencyKeys`

```ts
{
  tenantId, actorId, keyHash, operation,
  requestHash, responseStatus, responseBodySafe,
  resourceId, createdAt, expiresAt
}
```

Unique tenant/actor/operation/keyHash; TTL expiry. Never store raw auth/session token.

## 5. Transaction and consistency rules

- Draft save: update working revision + case summary/version + audit outbox/event atomically where transactions are available.
- Submit: validate, freeze revision, update case status/currentRevision, create transition and audit atomically.
- Referral: create referral, update case referral summary/status as applicable, create audit atomically.
- If external log delivery is separate, use an outbox collection/stream so audit delivery can be retried without losing the business action.
- Summary fields are derived from approved answers; repository code must not accept arbitrary summary patches from the client.

## 6. Audit event model

```ts
type AuditEvent = {
  _id: ObjectId;
  tenantId: ObjectId;
  eventId: string;
  occurredAt: Date;
  category: "authentication" | "authorization" | "case" | "referral" |
            "export" | "privacy" | "administration" | "security";
  action: string;
  outcome: "success" | "denied" | "failure";
  actor: {
    type: "user" | "system";
    userId?: string;
    roleSnapshot?: string[];
  };
  target: { type: string; id?: string; caseReference?: string };
  request: { requestId: string; sessionId?: string; ipRiskPrefix?: string };
  reasonCode?: string;
  metadata: Record<string, string | number | boolean | string[]>;
  integrity?: { previousHash?: string; eventHash?: string };
};
```

### Required audit actions

- Auth: login success/failure, logout, password/reset change, session revoke/expiry.
- Authorization: denied protected access, break-glass start/end.
- Case: create, draft save (coalesced), view P3, submit, assign, transition, revision, archive/anonymize.
- Referral: create, disclosure authorized, status/outcome, field-list preview/record.
- Export: request, approve, generate, download, expire, fail.
- Admin: user/role/scope/team/form/directory/config change.
- Privacy/security: request decision/action, retention hold, incident-related access.

### Prohibited audit content

Passwords, reset/session/CSRF tokens, full request bodies, names, phone/email, CNIC/passport values, narratives, document contents, raw search terms, or exported values.

Indexes: unique tenant/eventId; `{tenantId: 1, occurredAt: -1}`; `{tenantId: 1, "target.id": 1, occurredAt: 1}`; `{tenantId: 1, "actor.userId": 1, occurredAt: -1}`; `{tenantId: 1, category: 1, outcome: 1, occurredAt: -1}`.

## 7. API conventions

- Base: `/api/v1`; JSON UTF-8; dates ISO 8601 UTC; IDs opaque strings.
- Success envelope: `{ data, meta?, links? }`.
- Error envelope: `{ error: { code, message, fieldErrors?, requestId } }`.
- Pagination: cursor-based for operational lists (`limit <= 100`); no client-provided Mongo offsets/operators.
- Concurrency: mutations require `If-Match: "<version>"` or body version; stale writes return 409.
- State-changing requests require session + CSRF/origin validation.
- Retryable creation/submission/export requests require `Idempotency-Key`.
- Cache: private/no-store for PII endpoints; never CDN-cache authenticated case responses.

## 8. API contract

### Authentication

| Method | Endpoint | Permission | Request/response |
| --- | --- | --- | --- |
| POST | `/auth/login` | public rate-limited | email/password -> safe user/session result + cookie |
| POST | `/auth/logout` | authenticated | revoke current session |
| GET | `/auth/session` | authenticated | current user, roles/scopes, expiry; no sensitive internals |
| POST | `/auth/password/forgot` | public rate-limited | neutral acknowledgement |
| POST | `/auth/password/reset` | valid reset token | new password; revoke sessions |
| GET | `/auth/sessions` | self | list safe session metadata |
| DELETE | `/auth/sessions/:sessionId` | self/admin policy | revoke session |

### Form definitions

| Method | Endpoint | Permission | Purpose |
| --- | --- | --- | --- |
| GET | `/forms/migration-intake/current?lang=ur` | intake create | deployed form, labels, rules, notice |
| GET | `/forms/migration-intake/:version` | case read | render historical revision |
| POST | `/admin/forms/:version/deploy` | approved admin | deploy signed-off version; audited |

### Cases and revisions

| Method | Endpoint | Permission | Purpose |
| --- | --- | --- | --- |
| POST | `/cases` | `case.create` | create consented draft; idempotent |
| GET | `/cases` | `case.list` | scoped cursor list/filter/sort |
| GET | `/cases/:reference` | `case.read` + scope | summary, permitted current answers, actions |
| PATCH | `/cases/:reference/draft` | `case.edit` + version | save applicable draft fields |
| POST | `/cases/:reference/submit` | `case.submit` | validate/freeze/transition; idempotent |
| GET | `/cases/:reference/revisions` | `case.revision.read` | revision metadata; content separately scoped |
| GET | `/cases/:reference/revisions/:number` | scoped | permitted immutable snapshot |
| POST | `/cases/:reference/assignment` | `case.assign` | team/user assignment |
| POST | `/cases/:reference/transitions` | action-specific | perform allowed state transition |
| POST | `/cases/:reference/reopen` | `case.reopen` + reason | reopen closed case |
| GET | `/cases/:reference/activity` | `case.audit.read` | permission-safe activity timeline |

Example transition request:

```json
{
  "toStatus": "needs_correction",
  "reasonCode": "missing_or_inconsistent_information",
  "rationale": "Please confirm the recruitment route and receipt status.",
  "affectedFieldKeys": ["recruitmentChannel", "paymentReceiptStatus"],
  "caseVersion": 8
}
```

### Referrals

| Method | Endpoint | Permission | Purpose |
| --- | --- | --- | --- |
| GET | `/referrals` | `referral.list` | scoped workload/overdue list |
| POST | `/cases/:reference/referrals` | `referral.create` | create minimum-necessary referral |
| GET | `/cases/:reference/referrals` | `referral.read` | case referrals |
| GET | `/referrals/:referralId` | scoped | referral detail |
| PATCH | `/referrals/:referralId` | `referral.manage` + version | status, owner, due date, outcome |
| POST | `/referrals/:referralId/disclosure-authorization` | trained/scoped | record authorization and field allowlist |
| GET | `/referral-directory` | authenticated | active, verified entries |

### Dashboard and reporting

| Method | Endpoint | Permission | Purpose |
| --- | --- | --- | --- |
| GET | `/dashboard/workload` | portal | scoped operational counts and queue age |
| GET | `/reports/service-summary` | manager | de-identified aggregate with small-cell controls |

### Exports

| Method | Endpoint | Permission | Purpose |
| --- | --- | --- | --- |
| POST | `/exports` | `export.create` + step-up | create job with filters/profile/purpose |
| GET | `/exports` | own/manager policy | list permitted export jobs |
| GET | `/exports/:exportId` | owner/approver | status and expiry |
| POST | `/exports/:exportId/approve` | second approver when required | approve high-impact job |
| GET | `/exports/:exportId/download` | owner + valid step-up | short-lived streamed download |
| DELETE | `/exports/:exportId/file` | owner/admin policy | expire file early |

### Administration and privacy

| Method | Endpoint | Permission | Purpose |
| --- | --- | --- | --- |
| GET/POST | `/admin/users` | `user.manage` | list/create provisioned users |
| PATCH | `/admin/users/:userId` | `user.manage` | state/profile; no self-elevation |
| POST | `/admin/users/:userId/roles` | `role.assign` | approved role/scope change; revoke sessions |
| POST | `/admin/users/:userId/revoke-sessions` | `session.revoke.any` | immediate revoke |
| GET/POST/PATCH | `/admin/referral-directory` | directory permissions | versioned official directory |
| GET | `/audit-events` | `audit.read` | scoped event query; no raw values |
| POST | `/privacy-requests` | privacy role | record request |
| PATCH | `/privacy-requests/:id` | privacy role + version | decision/actions/completion |
| POST | `/cases/:reference/retention-holds` | privacy/legal role | create reviewed hold |
| POST | `/retention-jobs/:id/approve` | second approver | authorize batch action |

## 9. Query contract for cases

Allowed query parameters:

```text
cursor, limit
status[]
migrationStage[]
destinationCountry[]
assignedUserId[]
assignedTeamId[]
attentionSignal[]
referralStatus[]
updatedFrom, updatedTo
q (case reference, exact/prefix approved identifiers only)
sort (updatedAt, submittedAt, caseReference, status)
direction (asc, desc)
```

Scope is derived from the actor, never accepted as a widening parameter. The response returns `allowedActions` per record so UI does not infer permissions, but the server still checks every mutation.

## 10. Deployment and operational requirements

- Separate development, staging, and production databases/accounts/secrets; no production data in development.
- MongoDB network access restricted to application/worker; backups and monitoring use separate least-privilege credentials.
- Environment schema validation fails startup safely.
- CI: typecheck, lint, unit, integration, build, dependency/secret/container scans; protected production deployment.
- Health endpoint exposes only status/version, not secrets/database topology.
- Graceful shutdown closes clients and stops accepting work; worker jobs are retryable/idempotent.
- Configuration/form/directory deployment records version, approver, deployer, hash, and rollback version.
