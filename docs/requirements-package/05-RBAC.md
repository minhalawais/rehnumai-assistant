# Role-Based Access Control and Record Scope

## 1. Authorization model

Authorization is the intersection of:

```text
permission granted to role
AND record within organizational scope
AND field classification allowed
AND workflow precondition satisfied
AND account/session active
```

All checks run on the server in the service layer. Middleware and hidden buttons are usability controls, not authorization boundaries.

## 2. Roles

| Role | Purpose | Default record scope |
| --- | --- | --- |
| `data_entry` | collect, save, correct, submit intake | own drafts and assigned/created cases as configured |
| `case_manager` | review, assign within team, refer, follow up, close | assigned team/locations |
| `program_manager` | operational oversight, workload, controlled aggregate/export | managed teams/locations |
| `privacy_auditor` | privacy requests, audit and access review | audit/config plus case metadata; content only when justified |
| `admin` | user/team/configuration administration | tenant-wide administration; no default case-content edit |
| `super_admin` | break-glass platform administration | tenant-wide, step-up + reason; not routine operations |

Do not combine `admin` and `case_manager` implicitly. A person needing both responsibilities receives both approved role assignments, each auditable.

## 3. Scope dimensions

- `tenantId`: organization boundary; mandatory even for a single-tenant launch to avoid later ambiguity.
- `teamIds`: service/review teams.
- `locationIds`: centers/outreach locations.
- `assignedUserId`: direct assignment.
- `createdBy`: draft ownership.
- `fieldClearance`: `P0`, `P1`, `P2`, `P3` access level, with P3 optionally split into safeguarding and privacy-request domains.

## 4. Permission matrix

Legend: `O` own, `T` authorized team/location, `M` managed scope, `A` all tenant, `-` denied, `C` conditional/step-up.

| Capability | Data entry | Case manager | Program manager | Privacy auditor | Admin | Super admin |
| --- | --- | --- | --- | --- | --- | --- |
| Sign in/manage own password | Yes | Yes | Yes | Yes | Yes | Yes |
| Create intake draft | O | T | - | - | - | C |
| Read draft | O/assigned | T | M metadata | - | - | C |
| Edit draft | O/assigned | T if operationally assigned | - | - | - | C |
| Submit draft | O/assigned | T | - | - | - | C |
| Read submitted case P1/P2 | assigned | T | M | C for request/investigation | - | C |
| Read P3 safeguarding fields | - or trained/assigned | trained T | aggregate only; C detail | C | - | C |
| Claim/assign case | - | T | M | - | - | C |
| Start review | - | T | - | - | - | C |
| Approve for program purposes | - | T | - | - | - | C |
| Request correction | - | T | - | - | - | C |
| Place/remove hold | - | T | C | C legal/privacy hold | - | C |
| Create/manage referral | - | T | M oversight | - | - | C |
| Close/reopen case | - | T; reopen C | C | C privacy action | - | C |
| Archive by policy | - | - | C | approve/review | execute job only | C |
| Anonymize/purge | - | - | request | approve/review | execute approved job | C two-person |
| View operational dashboard | own | T | M | privacy metrics | admin metrics only | C |
| Export de-identified aggregate | - | T limited | M | privacy metrics | - | C |
| Export row-level P1/P2 | - | C approved profile | C step-up | C case-specific | - | C |
| Export P3 | - | - | - | C case-specific, approved | - | C exceptional |
| View case audit timeline | own/limited | T | M | A audit | admin events | C |
| View security audit stream | - | - | limited | A | A admin/security | C |
| Manage users | - | - | - | read assignments | A except own elevation | C |
| Assign roles/scopes | - | - | - | review | C; cannot self-elevate | C |
| Disable users/revoke sessions | - | - | - | recommend | A | C |
| Manage form definition | - | - | approve content | privacy review | deploy approved | C |
| Manage referral directory | - | propose | approve operations | privacy review | publish approved | C |
| Read privacy requests | - | case-specific status only | aggregate | A | metadata only | C |

## 5. Field-access matrix

| Data group | Data entry | Case manager | Program manager | Privacy auditor | Admin |
| --- | --- | --- | --- | --- | --- |
| P0 form/config | read | read | read | read | manage approved |
| P1 plan/readiness | own/assigned | team | managed scope/aggregate | conditional | none by default |
| P2 name/contact/employer | own/assigned | team | masked list; detail conditional | request-specific | none by default |
| P3 safety narrative | no by default; trained assigned exception | trained assigned/team | aggregate only | investigation/request-specific | none |
| P3 internal review notes | no | team reviewer | managed detail | audit as justified | none |
| P3 privacy request | no | minimal case status | aggregate | full | metadata only |
| Audit metadata | own actions | case timeline | managed scope | tenant-wide | admin/security events |

## 6. Segregation-of-duties rules

- Users cannot grant themselves a role, add their own scope, approve their own privileged export, or approve their own purge request.
- `data_entry` cannot approve a case, even if they created it.
- A reviewer should not approve a case they entered when an alternative reviewer is available; the policy must be configurable and deviations require a reason.
- Bulk export of row-level PII requires step-up authentication and, above configured thresholds, second-person approval.
- Production anonymization/purge and break-glass access require two-person control.
- Database operators must not use application accounts; application administrators must not receive database owner credentials.

## 7. Sensitive actions and re-authentication

Require recent authentication/MFA when enabled for:

- Role/scope changes.
- Row-level exports.
- P3 exceptional export.
- User disablement/session revocation affecting another administrator.
- Break-glass case access.
- Retention hold, anonymization, or purge approval.
- Secret/configuration change.

## 8. Break-glass process

- Available only to named `super_admin` accounts protected with MFA.
- Requires case/incident reference and reason before access.
- Grants a short-lived scoped permission, not a permanent role change.
- Alerts privacy/security owner immediately.
- Logs actor, target, fields accessed, start/end, and follow-up review without logging values.
- Must be reviewed within one business day.

## 9. Access lifecycle

1. Manager requests access with role, teams, locations, P3 training status, and expiry if temporary.
2. Approver checks least privilege and segregation of duties.
3. Administrator applies access; user receives no password in plaintext.
4. Role/scope change revokes active sessions.
5. Managers certify access quarterly; P3 and export permissions monthly or quarterly according to risk.
6. Employment/assignment termination disables account and revokes sessions immediately.

## 10. Authorization acceptance tests

- Every endpoint/action has allow and deny tests for each relevant role.
- Out-of-scope and nonexistent cases return indistinguishable `404` where appropriate.
- Search, counts, filter options, dashboards, exports, and audit data all apply the same record scope.
- Client-provided tenant/team/owner values cannot widen scope.
- Role changes take effect on the next protected request after session revocation.
- No admin route provides implicit case-content access.
