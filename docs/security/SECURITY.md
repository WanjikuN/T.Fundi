# T.Fundi — Security Architecture

| Field        | Value                 |
| ------------ | --------------------- |
| Document     | Security Architecture |
| Product      | T.Fundi               |
| Version      | 1.0.0                 |
| Status       | Draft                 |
| Owner        | Patricia Njoroge      |
| Last Updated | 2026-08-09            |

---

# 1. Purpose

This document defines the security principles, controls, authorization boundaries, tenant isolation requirements, and security considerations for the T.Fundi platform.

T.Fundi is a multi-tenant SaaS platform. Security must therefore protect both the platform itself and the data belonging to individual furniture businesses.

---

# 2. Security Objectives

T.Fundi security objectives are:

* Protect user identities.
* Enforce tenant isolation.
* Prevent unauthorized resource access.
* Protect customer and business data.
* Protect uploaded files and generated assets.
* Secure payment-related operations.
* Protect privileged platform operations.
* Maintain auditable security events.
* Detect and respond to security incidents.
* Minimize the impact of compromised accounts.

---

# 3. Security Boundaries

Security decisions operate across several boundaries:

```text
Platform
   ↓
Tenant
   ↓
User
   ↓
Role / Permission
   ↓
Resource
   ↓
Operation
```

Every protected operation must evaluate the appropriate boundaries.

The frontend must not be treated as a security boundary.

---

# 4. Identity

## 4.1 Authentication

Authenticated users must establish their identity before accessing protected resources.

Initial authentication capabilities include:

* Registration
* Login
* Password reset
* Session management
* Logout

Authentication implementation details may evolve as the platform develops.

---

## 4.2 Password Security

Passwords must:

* Never be stored in plaintext.
* Be securely hashed.
* Never appear in logs.
* Never be returned through APIs.
* Follow appropriate password security requirements.

Password reset tokens must be:

* Time limited.
* Single use.
* Securely generated.
* Invalidated after successful use.

---

# 5. Authorization

Authorization is permission-based.

The authorization model follows:

```text
Identity
   ↓
Permission
   ↓
Tenant Scope
   ↓
Resource
   ↓
Context
   ↓
Authorization Decision
```

Roles are collections of permissions.

A role does not independently define security behavior.

---

# 6. Tenant Isolation

Tenant isolation is mandatory.

A user belonging to Tenant A must not access Tenant B resources unless explicitly authorized through a valid platform-level mechanism.

Example:

```text
Tenant A
 └── User A
       └── Order A ✓

Tenant B
 └── Order B ✗
```

Tenant ownership must be verified by backend services for every protected tenant resource.

---

## 6.1 Tenant Context

Requests involving tenant-owned resources must resolve the tenant context before authorization.

Conceptually:

```text
Request
  ↓
Authenticate
  ↓
Resolve Tenant
  ↓
Verify Membership
  ↓
Evaluate Permission
  ↓
Evaluate Resource
  ↓
Allow / Deny
```

---

## 6.2 No Client-Supplied Trust

A tenant identifier supplied by a client must never be trusted by itself.

The backend must verify that the authenticated identity has access to the requested tenant.

---

# 7. Roles and Permissions

## 7.1 Platform Roles

Initial platform roles include:

```text
PLATFORM_OWNER
PLATFORM_ADMIN
PLATFORM_OPERATIONS
PLATFORM_SUPPORT
```

Platform permissions are controlled by T.Fundi.

---

## 7.2 Tenant Roles

Tenants may create custom roles from the permission vocabulary exposed by T.Fundi.

Example:

```text
Workshop Supervisor

production.view
production.assign
production.update
production.complete
```

Tenants cannot create arbitrary permissions that bypass platform security.

---

# 8. Least Privilege

Users should receive the minimum access required to perform their responsibilities.

Access should be restricted by:

* Permission
* Tenant
* Resource
* Context

Privileged permissions should be reviewed and audited.

---

# 9. Resource Authorization

Authorization must occur at the resource level where required.

For example, having:

```text
orders.view
```

does not automatically mean a user can view every order in the platform.

The system must additionally determine whether the requested order belongs to a scope the user is permitted to access.

---

# 10. API Security

Protected APIs must:

* Authenticate requests.
* Authorize operations.
* Validate input.
* Enforce tenant scope.
* Apply rate limits where appropriate.
* Avoid leaking sensitive information.
* Return safe error responses.

APIs must not rely on frontend authorization checks.

---

# 11. Input Validation

All external input must be treated as untrusted.

Validation should cover:

* Request bodies
* Query parameters
* Path parameters
* Uploaded files
* User-generated content
* AI inputs
* Payment-related callbacks

Validation must occur server-side.

---

# 12. File Security

T.Fundi handles files including:

* Product images
* Room images
* Color references
* 3D assets
* Production photos
* Generated visualizations

Uploaded files must be:

* Validated.
* Size-limited.
* Stored securely.
* Access-controlled.
* Associated with the appropriate tenant.
* Protected from unauthorized direct access.

File type validation should not rely solely on filename extensions.

---

# 13. AI Security

AI inputs may contain user-provided images and potentially sensitive information.

AI operations must therefore consider:

* Access control
* File validation
* Data retention
* Provider security
* Processing failures
* Cost abuse
* Rate limiting
* Prompt or input manipulation

AI-generated output must not automatically be treated as authoritative business data.

---

# 14. Payment Security

Payment processing must minimize the amount of sensitive payment information handled directly by T.Fundi.

Payment provider integrations should use secure provider mechanisms.

The platform should not store sensitive payment credentials unless explicitly required and appropriately protected.

Payment callbacks/webhooks must be authenticated or verified according to the provider's security mechanism.

---

# 15. Data Protection

Tenant-owned business data must remain isolated.

Sensitive data should be protected:

### In transit

Use encrypted transport such as HTTPS/TLS.

### At rest

Sensitive data and infrastructure storage should use appropriate encryption mechanisms.

### In logs

Sensitive information should not be logged unnecessarily.

---

# 16. Audit Logging

Security-sensitive operations should be auditable.

Examples include:

* Login events
* Failed authentication attempts
* Role changes
* Permission changes
* Tenant configuration changes
* Privileged platform access
* Order state changes
* Production state changes
* Security events

Audit records should capture appropriate metadata such as:

```text
Actor
Tenant
Action
Resource
Timestamp
Result
Request / Correlation ID
```

Audit logs must themselves be protected from unauthorized modification.

---

# 17. Session Security

Authenticated sessions should:

* Expire appropriately.
* Be invalidated on logout where applicable.
* Protect authentication credentials.
* Prevent session fixation.
* Use secure transport.
* Avoid exposing sensitive tokens unnecessarily.

Exact token and session implementation will be finalized during Identity implementation.

---

# 18. Rate Limiting and Abuse Prevention

Rate limiting should be applied to operations susceptible to abuse.

Examples include:

* Login
* Password reset
* AI generation
* File uploads
* Public APIs
* Payment attempts

AI endpoints require particular attention because they may have external processing costs.

---

# 19. Security Headers

Production web applications should use appropriate security headers.

The exact configuration will be determined by the frontend and deployment architecture.

Potential controls include:

* Content Security Policy
* HSTS
* X-Content-Type-Options
* Referrer Policy
* Frame protections

---

# 20. Secrets Management

Secrets must not be committed to source control.

Examples include:

* Database credentials
* API keys
* AI provider credentials
* Payment provider secrets
* Signing keys
* Infrastructure credentials

Secrets should be provided through an appropriate secrets-management mechanism.

---

# 21. Database Security

Database access must follow least privilege.

Application users should not receive unnecessary administrative database privileges.

Tenant-scoped queries must be enforced by the application authorization layer and, where appropriate, reinforced by database-level controls.

---

# 22. Background Jobs

Background workers must preserve tenant context.

An asynchronous job should contain sufficient information to determine:

```text
Job
 ├── Tenant
 ├── User / Actor where applicable
 ├── Resource
 └── Operation
```

Workers must not process tenant resources without validating the appropriate scope.

---

# 23. Security Monitoring

Security monitoring should eventually cover:

* Authentication anomalies
* Authorization failures
* Suspicious tenant access
* Excessive API usage
* File upload abuse
* AI abuse
* Payment anomalies
* Infrastructure security events

---

# 24. Incident Response

Security incidents should follow:

```text
Detection
   ↓
Containment
   ↓
Investigation
   ↓
Mitigation
   ↓
Recovery
   ↓
Post-Incident Review
```

Incidents should be documented according to severity and impact.

---

# 25. Security Testing

Security testing must include:

### Authentication

* Invalid credentials
* Password reset abuse
* Session handling

### Authorization

* Permission bypass
* Privilege escalation
* Resource access violations

### Multi-Tenancy

* Cross-tenant reads
* Cross-tenant writes
* Cross-tenant updates
* Cross-tenant deletes

### APIs

* Input validation
* Rate limiting
* Authentication bypass

### Files

* Malicious file uploads
* Unauthorized file access
* Oversized files

### AI

* Unauthorized AI access
* Excessive generation
* Invalid inputs
* Cross-tenant asset access

---

# 26. Security Invariants

The following must always remain true:

1. An unauthenticated user cannot access protected resources.
2. A tenant user cannot access another tenant's resources.
3. Permissions cannot be bypassed through the frontend.
4. Tenant roles cannot create unrestricted platform capabilities.
5. Historical orders cannot be modified through catalog changes.
6. Sensitive credentials must never be stored in plaintext.
7. Secrets must never be committed to source control.
8. Protected files must respect tenant authorization.
9. Privileged operations must be auditable.
10. Background jobs must preserve tenant scope.

---

# 27. Deferred Security Decisions

The following implementation details are intentionally deferred:

* Exact authentication protocol.
* Access and refresh token strategy.
* Session storage strategy.
* Database-level row-level security implementation.
* Exact password policy.
* Secrets-management provider.
* WAF configuration.
* SIEM integration.
* Security scanning tooling.
* Penetration testing provider.
* Data retention periods.
* Backup encryption strategy.

These decisions should be documented when implementation begins.

---

# 28. Related Documents

* `PROJECT_PRINCIPLES.md`
* `product/PRODUCT_REQUIREMENTS.md`
* `product/USER_JOURNEYS.md`
* `architecture/MULTI_TENANCY.md`
* `architecture/SYSTEM_ARCHITECTURE.md`
* `engineering/ADR/ADR-0001-multi-tenant-platform.md`
* `engineering/ADR/ADR-0002-tenant-configurable-authorization.md`
* `database/DATABASE_DESIGN.md`
* `database/ERD.md`

---

# 29. Document Status

This document defines the initial security architecture for T.Fundi.

Implementation-specific security decisions may evolve as the platform is built, but they must preserve the security invariants defined here.
