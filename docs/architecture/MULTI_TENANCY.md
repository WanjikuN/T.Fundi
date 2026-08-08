# T.Fundi — Multi-Tenancy Architecture

| Field | Value |
|---|---|
| Document | Multi-Tenancy Architecture |
| Product | T.Fundi |
| Version | 1.0.0 |
| Status | Accepted |
| Last Updated | 2026-08-08 |

## 1. Purpose

This document defines how T.Fundi supports multiple independent furniture businesses on a single SaaS platform.

Multi-tenancy is a first-class architectural concern. Tenant isolation must be enforced by the backend and must not depend on frontend behavior.

This document complements:

- `docs/product/PRODUCT_REQUIREMENTS.md`
- `docs/product/USER_JOURNEYS.md`
- `docs/engineering/ADR/ADR-0001-multi-tenant-platform.md`
- `docs/engineering/ADR/ADR-0002-tenant-configurable-authorization.md`

## 2. Tenancy Model

T.Fundi uses a shared application platform where multiple furniture businesses operate as independent tenants.

Conceptually:

```
T.Fundi Platform
│
├── Tenant A
│   ├── Users
│   ├── Roles
│   ├── Products
│   ├── Orders
│   ├── Workshop
│   └── Customers
│
├── Tenant B
│   ├── Users
│   ├── Roles
│   ├── Products
│   ├── Orders
│   ├── Workshop
│   └── Customers
│
└── Tenant C
    ├── Users
    ├── Roles
    ├── Products
    ├── Orders
    ├── Workshop
    └── Customers
```

A tenant represents a furniture business operating its own storefront and business operations within T.Fundi.

## 3. Tenant Isolation

Tenant data must be logically isolated.

A request associated with Tenant A must never return or modify Tenant B data.

```
Request
  ↓
Identity
  ↓
Tenant Context
  ↓
Permission
  ↓
Resource Ownership
  ↓
Authorization Decision
```

Tenant isolation must be enforced server-side.

**Frontend filtering is not considered a security boundary.**

## 4. Tenant-Scoped Resources

The following resources are expected to be tenant-scoped where applicable:

- Users and memberships
- Roles
- Organizational positions
- Products
- Categories
- Product configurations
- Product assets
- Orders
- Order items
- Production jobs
- Production stages
- Production updates
- Customer relationships
- Business settings
- Notifications
- Tenant analytics
- Tenant-owned uploaded assets

Resources that are inherently platform-wide, such as the permission catalog, remain platform-scoped.

## 5. Tenant Context

Every authenticated tenant operation must establish the tenant context before accessing protected tenant resources.

Conceptually:

```
Authenticated User
      ↓
Tenant Membership
      ↓
Active Tenant Context
      ↓
Permission Evaluation
      ↓
Resource Access
```

A user may eventually belong to more than one tenant. The active tenant must therefore be explicit in the authorization context.

A request must not infer tenant access solely from user-provided identifiers.

## 6. Tenant Membership

Tenant membership represents a user's relationship with a furniture business.

Conceptually:

```
User
 │
 ├── Membership → Tenant A
 │                  ├── Roles
 │                  └── Organization Position
 │
 └── Membership → Tenant B
                    ├── Roles
                    └── Organization Position
```

Membership determines the tenant context in which the user's permissions are evaluated.

## 7. Tenant Organization

Tenants may define their own organizational hierarchy.

Example:

```
Owner
│
├── General Manager
│   ├── Sales Manager
│   └── Operations Manager
│       ├── Workshop Supervisor
│       └── Quality Control
│
└── Catalog Manager
```

Another tenant may use a different structure.

T.Fundi provides the permission vocabulary while allowing tenants to configure roles and organizational relationships.

The tenant cannot create arbitrary platform capabilities.

## 8. Authorization Boundary

Tenant isolation and authorization are related but separate concerns.

Authorization evaluates:

- Who is making the request?
- Which tenant is in context?
- Which permissions does the user have?
- What resource is being accessed?
- Does the resource belong to the tenant?
- Does the user's organizational context impose additional restrictions?

```
Identity
   ↓
Tenant Scope
   ↓
Permission
   ↓
Resource
   ↓
Context
   ↓
Decision
```

The detailed authorization model is defined in ADR-0002.

## 9. Cross-Tenant Access

Tenant users must not access another tenant's resources.

Example:

```
Tenant A User
    │
    ├── Tenant A Order ✓
    │
    └── Tenant B Order ✗
```

Platform administrators are governed by a separate platform-level authorization model.

Privileged platform access to tenant data must be explicitly authorized and auditable.

## 10. Data Access Rules

Protected data access should follow these rules:

- Tenant ownership must be established before access.
- Queries must be tenant-aware.
- Resource identifiers must not bypass tenant filtering.
- Create operations must assign the correct tenant.
- Update operations must verify tenant ownership.
- Delete operations must verify tenant ownership.
- Cross-tenant references must be explicitly designed and authorized.
- Background jobs must carry tenant context where tenant data is processed.
- Audit records must preserve tenant context where applicable.

## 11. API Boundary

Tenant context must be established at the API boundary.

A protected API operation should conceptually behave as:

```
HTTP Request
     ↓
Authenticate
     ↓
Resolve Tenant
     ↓
Authorize Permission
     ↓
Validate Resource Ownership
     ↓
Execute Operation
     ↓
Return Tenant-Scoped Result
```

An API must never rely on the client to enforce tenant isolation.

## 12. Background Jobs

Background processes must preserve tenant context.

Examples include:

- AI processing
- Image processing
- Notifications
- Production updates
- Analytics aggregation
- Payment reconciliation

Conceptually:

```
Tenant Request
     ↓
Create Job
     ↓
Tenant Context Stored
     ↓
Worker
     ↓
Tenant-Scoped Processing
```

A worker must not process tenant resources without knowing which tenant owns them.

## 13. File and Asset Isolation

Tenant-owned files must be isolated logically.

Examples:

- Product images
- 3D models
- Color reference images
- Room images
- AI-generated visualizations
- Production progress photos
- Business assets

Asset access must be authorized against the owning tenant and resource.

Public URLs must not expose private tenant assets unintentionally.

## 14. Tenant Configuration

Each tenant may configure business-specific behavior without changing the shared platform architecture.

Examples include:

- Store branding
- Product catalog
- Materials
- Colors
- Customization options
- Production stages
- Organizational roles
- Notifications
- Delivery workflow

Tenant configuration must remain scoped to the owning tenant.

## 15. Tenant Lifecycle

A tenant may move through states such as:

```
PENDING
   ↓
ACTIVE
   ↓
SUSPENDED
   ↓
ARCHIVED
```

The exact lifecycle implementation is deferred to the tenant-management implementation.

A suspended or archived tenant must not operate normally, subject to future retention and administrative rules.

## 16. Tenant-Aware Observability

Operational telemetry should support tenant-aware investigation without leaking tenant data.

Relevant telemetry may include:

- Tenant identifier
- Request identifier
- User identifier
- Operation
- Resource type
- Result
- Error
- Latency

Sensitive business data should not be placed directly into logs.

## 17. Security Requirements

The implementation must protect against:

- Cross-tenant data access
- Insecure direct object references
- Missing tenant filters
- Incorrect tenant assignment
- Privilege escalation
- Cross-tenant file access
- Background-job context loss
- Tenant context spoofing

Tenant isolation must be tested at the API, service, data-access, and integration boundaries.

## 18. Testing Requirements

At minimum, tests should verify:

**Read Isolation**
Tenant A cannot read Tenant B resources.

**Write Isolation**
Tenant A cannot modify Tenant B resources.

**Delete Isolation**
Tenant A cannot delete Tenant B resources.

**Create Ownership**
Resources created by Tenant A are assigned to Tenant A.

**Membership Isolation**
A user cannot use Tenant A membership to access Tenant B.

**Background Processing**
Tenant-specific jobs process only resources belonging to their tenant.

**Asset Isolation**
Tenant-owned private assets cannot be accessed by unauthorized tenants.

**Administrative Access**
Platform-level access follows explicit permissions and is auditable.

## 19. Scalability

The tenancy model should support growth from a small number of businesses to many independent furniture businesses without requiring a separate application deployment for every tenant.

The architecture should therefore keep tenant identity and ownership explicit throughout the application.

Future infrastructure decisions may introduce additional isolation strategies if scale or regulatory requirements justify them.

## 20. Future Capabilities

The architecture should remain compatible with:

- Multiple locations per tenant
- Multiple workshops
- Tenant-specific domains
- Advanced organization management
- Tenant-level analytics
- Tenant-specific workflow configuration
- Enterprise isolation strategies
- Mobile applications
- Additional business modules

These capabilities do not change the core requirement for tenant isolation.

## 21. Related Decisions

- ADR-0001: Multi-Tenant Platform Architecture
- ADR-0002: Tenant-Configurable Authorization

## 22. Summary

T.Fundi treats every furniture business as an independent tenant within a shared SaaS platform.

The core principles are:

- Tenant isolation is a backend security requirement.
- Tenant context is established before protected resource access.
- Tenant ownership is validated for every protected operation.
- Tenant organizations can define their own hierarchy.
- T.Fundi controls the available permission vocabulary.
- Background jobs and assets preserve tenant boundaries.
- Platform-level access is separate from tenant-level access.
- Cross-tenant access is denied by default.