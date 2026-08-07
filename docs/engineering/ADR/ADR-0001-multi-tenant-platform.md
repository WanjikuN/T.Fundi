# ADR-0001: Multi-Tenant Platform Architecture

| Field               | Value                              |
| ------------------- | ---------------------------------- |
| **ADR**             | ADR-0001                           |
| **Title**           | Multi-Tenant Platform Architecture |
| **Status**          | Accepted                           |
| **Date**            | 2026-08-07                         |
| **Decision Owners** | T.Fundi Engineering                |
| **Related Product** | T.Fundi                            |

---

## 1. Context

T.Fundi is designed as a multi-tenant, AI-powered SaaS platform for furniture businesses.

The platform will allow multiple independent furniture businesses to operate their digital storefronts, catalogs, customization experiences, orders, workshops, production workflows, and customer interactions through the same underlying platform.

Each furniture business should experience T.Fundi as its own digital space.

A business using T.Fundi should be able to:

* Maintain its own business profile.
* Manage its own catalog.
* Manage its own products and product configurations.
* Manage its own customers and orders.
* Configure its workshop operations.
* Manage its employees and organizational structure.
* Track production.
* Upload production updates.
* Manage its own business data.

At the same time, T.Fundi itself must retain control over the platform as a whole.

This creates two distinct scopes:

```text
T.Fundi Platform
        │
        ├── Tenant A
        │     ├── Users
        │     ├── Catalog
        │     ├── Orders
        │     ├── Workshop
        │     └── Business Data
        │
        ├── Tenant B
        │     ├── Users
        │     ├── Catalog
        │     ├── Orders
        │     ├── Workshop
        │     └── Business Data
        │
        └── Tenant C
              ├── Users
              ├── Catalog
              ├── Orders
              ├── Workshop
              └── Business Data
```

The architecture must therefore allow many businesses to share the same platform while maintaining strong logical isolation between tenants.

---

# 2. Decision

T.Fundi will use a **shared-platform, logically isolated multi-tenant architecture**.

Each furniture business will be represented as a **tenant**.

Tenant-owned resources will be associated with a tenant identity and protected by tenant-scoped authorization.

The platform will use a common application and infrastructure stack rather than deploying a separate application instance for every furniture business.

Conceptually:

```text
                    T.Fundi Platform
                           │
              ┌────────────┴────────────┐
              │                         │
        Shared Platform            Platform Services
              │                         │
              └────────────┬────────────┘
                           │
                    Tenant Context
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
     Tenant A           Tenant B           Tenant C
        │                  │                  │
   Business Data      Business Data      Business Data
```

The platform will enforce tenant isolation at the application and authorization boundaries, with tenant ownership represented explicitly throughout protected resources.

---

# 3. Tenant Definition

A tenant represents an independent furniture business operating on T.Fundi.

A tenant is not simply a user account.

The relationship is:

```text
Platform
   │
   └── Tenant
         │
         ├── Users
         ├── Roles
         ├── Products
         ├── Designs
         ├── Orders
         ├── Workshop
         ├── Production Jobs
         ├── Customers
         └── Business Configuration
```

A tenant owns and controls its business resources within the capabilities provided by T.Fundi.

---

# 4. Tenant Isolation

Tenant isolation is a core security requirement.

A resource belonging to Tenant A must not be accessible to Tenant B merely because the requesting user is authenticated.

For example:

```text
Tenant A
   │
   └── Order A-001
          │
          └── Tenant A ✓

Tenant B
   │
   └── Request Order A-001
          │
          └── Access Denied ✗
```

Authentication alone is therefore insufficient.

A protected request must establish:

```text
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

Client-side tenant filtering is not considered a security boundary.

---

# 5. Tenant-Owned Resources

The following resource categories are expected to be tenant-scoped.

## 5.1 Catalog

* Categories
* Products
* Product images
* 3D assets
* Materials
* Colors
* Product configurations

## 5.2 Customers

Customer relationships associated with a furniture business must be tenant-scoped.

## 5.3 Designs

Saved furniture configurations and designs associated with a tenant must respect tenant ownership and access rules.

## 5.4 Orders

Every order belongs to exactly one tenant.

```text
Order
 └── tenant_id
```

An order must never belong simultaneously to multiple furniture businesses.

## 5.5 Workshop

Workshop resources are tenant-scoped, including:

* Production jobs
* Production stages
* Production updates
* Production photos
* Quality-control records
* Workshop employees
* Production issues

## 5.6 Business Configuration

Tenant-specific configuration may include:

* Business profile
* Store branding
* Product configuration
* Production workflow
* Organizational roles
* Operational settings

---

# 6. Platform Scope

T.Fundi itself operates at a separate platform scope.

Platform-level resources and operations include:

* Tenant management
* Platform administration
* Platform configuration
* Platform monitoring
* Platform security
* Platform audit
* Infrastructure operations
* System-wide analytics

Platform users are distinct from tenant users.

Conceptually:

```text
Platform Scope
│
├── Platform Administrators
├── Tenant Management
├── Platform Operations
├── Security
└── Infrastructure
```

Platform-level access must not automatically imply unrestricted access to tenant business data.

Privileged access to tenant resources must be explicitly authorized and auditable.

---

# 7. Tenant Context

Protected tenant operations must execute within an explicit tenant context.

Conceptually:

```text
Request
   ↓
Authenticate User
   ↓
Resolve Tenant Context
   ↓
Evaluate Permission
   ↓
Validate Resource Tenant
   ↓
Execute Operation
```

The exact mechanism for resolving tenant context is an implementation concern and will be defined in the system architecture.

The important architectural requirement is that tenant context must not be implicitly trusted from client-controlled resource identifiers.

---

# 8. Authentication and Authorization

Authentication answers:

> Who is this user?

Authorization answers:

> What is this user allowed to do, and within which scope?

T.Fundi will treat these as separate concerns.

A valid authenticated identity does not automatically grant access to tenant resources.

The authorization model must account for:

* Identity
* Tenant membership
* Permissions
* Resource ownership
* Scope
* Organizational context where applicable

The detailed permission and role model will be defined separately in:

```text
ADR-0002: Tenant-Configurable Authorization
```

---

# 9. Tenant Organizational Structure

T.Fundi will support tenant-specific organizational structures.

Different furniture businesses may organize themselves differently.

For example:

```text
Tenant A

Owner
 ├── General Manager
 │    ├── Sales Manager
 │    └── Workshop Manager
 │         ├── Workshop Supervisor
 │         └── Artisan
 └── Catalog Manager
```

Another tenant may use:

```text
Tenant B

Owner
 ├── Admin
 ├── Workshop Lead
 └── Artisan
```

The platform must not require every tenant to use the same organizational hierarchy.

T.Fundi will provide the underlying permission capabilities while tenants may configure their own organizational roles within the boundaries of the platform authorization model.

The detailed design is deferred to ADR-0002.

---

# 10. Cross-Tenant Access

Cross-tenant access is denied by default.

A tenant user must not be able to access another tenant's resources by:

* Changing a URL.
* Modifying an ID.
* Manipulating request parameters.
* Modifying request bodies.
* Calling APIs directly.
* Accessing predictable resource identifiers.
* Bypassing the frontend.
* Using a different client application.

For example:

```text
GET /orders/{tenant-a-order-id}

User belongs to Tenant B
        ↓
Authorization
        ↓
DENY
```

Tenant isolation must therefore be implemented as a backend security requirement rather than as a UI behavior.

---

# 11. Data Isolation

Tenant-owned data must carry sufficient ownership information to enforce isolation.

The initial architecture will favor explicit tenant ownership relationships.

Conceptually:

```text
tenant
   │
   ├── users
   ├── products
   ├── customers
   ├── designs
   ├── orders
   ├── workshops
   └── production_jobs
```

Where appropriate, tenant-owned records should include an explicit tenant identifier.

The database strategy for enforcing tenant isolation will be defined in the database architecture and related security documentation.

This ADR does not mandate a specific database isolation mechanism.

For example, the following remain implementation decisions:

* Shared database with tenant identifiers.
* Database row-level security.
* Separate schemas.
* Separate databases.
* Hybrid approaches.

The selected mechanism must satisfy the isolation requirements established by this ADR.

---

# 12. API Isolation

Every protected API operation involving tenant-owned resources must enforce tenant scope.

The API must not rely on the frontend to provide correct tenant boundaries.

For example:

```text
Client
   ↓
GET /api/orders/123
   ↓
Authentication
   ↓
Tenant Context
   ↓
Permission Check
   ↓
Order Ownership Check
   ↓
Response
```

An API request that attempts to access a resource outside the user's authorized tenant scope must fail.

---

# 13. Storage Isolation

Tenant isolation applies to uploaded assets as well as database records.

Tenant-owned files may include:

* Product images
* 3D models
* Color reference images
* Room images
* AI-generated visualizations
* Production photographs
* Design assets

Storage paths and access mechanisms must prevent unauthorized cross-tenant access.

Conceptually:

```text
storage/
├── tenant-a/
│   ├── products/
│   ├── designs/
│   └── production/
│
├── tenant-b/
│   ├── products/
│   ├── designs/
│   └── production/
```

The exact storage implementation is an architecture decision.

Publicly accessible assets must still be intentionally published rather than exposed merely because they exist in tenant storage.

---

# 14. Background Jobs and Asynchronous Processing

Tenant context must be preserved when work moves from an API request into asynchronous processing.

This is particularly important for:

* AI color matching
* AI room visualization
* Image processing
* Notifications
* Production processing
* Order workflows
* Background reports

Conceptually:

```text
API Request
    ↓
Create Job
    ↓
tenant_id + user_id + resource_id
    ↓
Queue
    ↓
Worker
    ↓
Process Within Tenant Context
```

A background worker must not lose tenant context when processing a tenant-owned job.

Cross-tenant processing caused by missing or incorrect tenant context must be treated as a security failure.

---

# 15. Caching

Tenant boundaries must also be respected by caching mechanisms.

Cached tenant-specific data must not be returned to users belonging to another tenant.

Cache keys for tenant-scoped resources should therefore incorporate sufficient tenant context.

Conceptually:

```text
tenant:{tenant_id}:product:{product_id}
```

The exact caching strategy will be defined in the system architecture.

---

# 16. Observability

Observability must support tenant-aware troubleshooting without compromising tenant privacy.

Relevant logs, metrics, traces, and audit events should contain sufficient context to identify the affected tenant where appropriate.

Conceptually:

```text
Request
├── request_id
├── user_id
├── tenant_id
└── operation
```

Tenant identifiers should not be exposed unnecessarily to customers or other tenants.

Sensitive tenant data must not be written to logs merely for debugging convenience.

Detailed observability requirements are defined separately.

---

# 17. Auditability

Important tenant-boundary and privileged operations must be auditable.

Examples include:

* Tenant creation
* Tenant suspension
* Tenant activation
* Permission changes
* Role changes
* Privileged platform access
* Sensitive data access
* Security-related configuration changes

Audit records should provide sufficient context to determine:

```text
Who
What
When
Which Tenant
Which Resource
What Action
```

The detailed audit architecture is outside the scope of this ADR.

---

# 18. Tenant Lifecycle

A tenant may move through lifecycle states.

Initial conceptual states are:

```text
PENDING
   ↓
ACTIVE
   ↓
SUSPENDED
   ↓
ARCHIVED
```

Possible transitions include:

```text
PENDING → ACTIVE
PENDING → ARCHIVED

ACTIVE → SUSPENDED
ACTIVE → ARCHIVED

SUSPENDED → ACTIVE
SUSPENDED → ARCHIVED
```

A suspended tenant should not be able to operate normally while its data remains preserved according to platform policies.

Tenant deletion and retention policies are separate concerns and must be explicitly defined before implementation.

---

# 19. Branding and Tenant Experience

Each tenant should be able to present a distinct customer-facing experience.

The goal is:

> Each furniture business should feel like it owns its own digital storefront.

The underlying T.Fundi platform may be shared, but the customer-facing experience should support tenant-specific:

* Business identity
* Branding
* Catalog
* Products
* Materials
* Colors
* Store configuration
* Business information

A customer interacting with Tenant A should not inadvertently perceive Tenant B's business data or configuration.

The exact white-label and custom-domain strategy is deferred to future product and architecture decisions.

---

# 20. Scalability

The architecture must support the platform growing from:

```text
1 Furniture Business
        ↓
10 Businesses
        ↓
100 Businesses
        ↓
1000+ Businesses
```

without requiring a separate application deployment for each business.

Scaling must therefore consider:

* Database growth
* Storage growth
* API traffic
* Background jobs
* AI workloads
* Image processing
* 3D assets
* Notifications
* Observability
* Tenant-specific traffic patterns

The platform must avoid architectural assumptions that only work for a single furniture business.

---

# 21. Reliability

A failure affecting one tenant should not unnecessarily cause failures for unrelated tenants.

The architecture should therefore consider tenant-aware failure boundaries.

For example:

```text
Tenant A
High AI workload
       │
       ▼
AI Processing Capacity
       │
       ├── Must not unnecessarily
       │   exhaust resources
       │
       ▼
Tenant B
Normal workload
```

Future architecture may introduce:

* Rate limits
* Workload isolation
* Queue prioritization
* Resource quotas
* Tenant-specific limits
* Circuit breakers

These mechanisms will be evaluated as the platform scales.

---

# 22. Security Requirements

The following are mandatory architectural principles:

1. Tenant isolation is enforced server-side.
2. Cross-tenant access is denied by default.
3. Authentication does not imply tenant authorization.
4. Tenant ownership must be validated for protected resources.
5. Client-controlled tenant identifiers must not be blindly trusted.
6. Background jobs must preserve tenant context.
7. Tenant-specific cached data must remain isolated.
8. Tenant-specific storage must remain isolated.
9. Privileged platform access must be explicitly authorized.
10. Sensitive privileged operations must be auditable.

---

# 23. Consequences

## Positive Consequences

### 23.1 Efficient Platform Scaling

A shared platform allows T.Fundi to serve many furniture businesses without maintaining an entirely separate deployment for every tenant.

### 23.2 Centralized Platform Development

Features and security improvements can be developed centrally and made available to tenants without rebuilding an independent application for each business.

### 23.3 Consistent Platform Capabilities

The platform can maintain a common set of capabilities while allowing tenants to configure their business operations.

### 23.4 Strong Business Isolation

Explicit tenant boundaries provide a foundation for preventing accidental cross-business data access.

### 23.5 Future Mobile Support

A centralized multi-tenant backend can support multiple clients:

```text
Web Application
      │
      ├──────────────┐
      │              │
Mobile Application  Future Clients
      │              │
      └──────┬───────┘
             ↓
        T.Fundi API
             ↓
        Tenant Context
```

---

## Negative Consequences

### 23.6 Increased Authorization Complexity

Every protected operation must account for tenant scope.

This introduces more complexity than building a single-business application.

### 23.7 Higher Security Requirements

A tenant isolation failure could expose one business's data to another.

Tenant isolation therefore becomes a critical security concern.

### 23.8 More Complex Testing

Tests must cover:

* Same-tenant access
* Cross-tenant access
* Platform access
* Tenant membership
* Background jobs
* Storage
* Caching
* API access

### 23.9 Operational Complexity

The platform must monitor tenant-aware workloads, storage, traffic, and background processing.

### 23.10 Noisy-Neighbor Risk

One tenant with unusually high traffic or AI usage could affect other tenants if resource controls are not implemented.

This will require capacity management as the platform grows.

---

# 24. Alternatives Considered

## 24.1 Separate Application Per Furniture Business

```text
Tenant A → Application A
Tenant B → Application B
Tenant C → Application C
```

### Rejected

This would provide strong isolation but would introduce significant operational overhead.

Every new furniture business would potentially require:

* Application deployment
* Infrastructure provisioning
* Database provisioning
* Monitoring
* Updates
* Security maintenance
* Backup management

This does not align with T.Fundi's goal of becoming a scalable SaaS platform.

---

## 24.2 Separate Database Per Tenant

```text
Tenant A → Database A
Tenant B → Database B
Tenant C → Database C
```

### Not selected as the initial architectural requirement

Separate databases can provide strong isolation but introduce operational complexity as tenant count increases.

The platform may consider separate database isolation for specific enterprise requirements in the future.

The initial architecture therefore does not mandate this approach.

---

## 24.3 Shared Database Without Explicit Tenant Boundaries

```text
All tenants
    ↓
Shared tables
    ↓
No tenant ownership enforcement
```

### Rejected

This creates unacceptable security risk.

Tenant ownership must be explicit and enforced.

---

## 24.4 Shared Platform With Logical Tenant Isolation

```text
Shared Platform
       ↓
Tenant Context
       ↓
Tenant-Owned Resources
```

### Selected

This provides a strong balance between:

* Scalability
* Operational efficiency
* Centralized development
* Tenant isolation
* Future extensibility

---

# 25. Decisions Deferred

This ADR establishes the multi-tenant architectural model but intentionally does not decide every implementation detail.

The following require separate decisions or architecture documentation.

### Authorization

How tenant roles, permissions, hierarchy, and organizational relationships work.

**Deferred to:**

```text
ADR-0002 — Tenant-Configurable Authorization
```

### Database Isolation Mechanism

The specific mechanism used to enforce tenant isolation at the database layer.

### Tenant Identification

The exact mechanism for identifying tenants through:

* Domain
* Subdomain
* Request context
* Authentication claims
* Headers
* Other mechanisms

### Storage Architecture

The exact object-storage structure and access mechanism.

### Caching Architecture

The exact caching technology and invalidation strategy.

### AI Infrastructure

The architecture for:

* AI jobs
* Queues
* Workers
* Providers
* Cost controls
* Model selection

### Custom Domains

Whether tenants can use custom domains or subdomains.

### Tenant Billing

Subscription plans, usage limits, billing, and metering are outside this ADR.

### Tenant Data Retention

Deletion, archival, export, and retention requirements require separate decisions.

---

# 26. Implementation Constraints

Future implementation must preserve the following invariants:

```text
Invariant 1
Every tenant-owned resource has an enforceable tenant boundary.

Invariant 2
Cross-tenant access is denied by default.

Invariant 3
Tenant isolation is enforced server-side.

Invariant 4
Authentication alone does not grant tenant access.

Invariant 5
Background processing preserves tenant context.

Invariant 6
Tenant-scoped storage and caching cannot leak data across tenants.

Invariant 7
Platform privileges are distinct from tenant privileges.

Invariant 8
Tenant organizational structures may differ.

Invariant 9
The architecture must support multiple independent furniture businesses.

Invariant 10
Tenant isolation must remain enforceable as the system scales.
```

---

# 27. Testing Implications

Multi-tenancy must be treated as a first-class testing concern.

Tests should eventually cover:

## Authentication

```text
Authenticated user → allowed
Unauthenticated user → denied
```

## Tenant Membership

```text
Tenant A user → Tenant A resources ✓
Tenant A user → Tenant B resources ✗
```

## Resource Ownership

```text
Tenant A user
    ↓
Tenant A order ✓

Tenant A user
    ↓
Tenant B order ✗
```

## API Security

Attempted cross-tenant access through direct API requests must fail.

## Storage

Tenant A must not access Tenant B's private assets.

## Background Jobs

A job created for Tenant A must execute using Tenant A's context.

## Caching

Tenant A cached resources must not be returned to Tenant B.

## Platform Access

Platform administrators must only access tenant data when explicitly authorized.

## Regression

Tenant isolation tests must run continuously in CI/CD because a regression could create a critical security vulnerability.

---

# 28. Relationship to Other Documents

This ADR establishes the foundation for other T.Fundi documentation.

```text
ADR-0001
Multi-Tenant Platform
       │
       ├───────────────┐
       │               │
       ▼               ▼
ADR-0002          System Architecture
Authorization           │
       │                │
       └────────┬───────┘
                ▼
         Database Design
                │
                ▼
           API Design
                │
                ▼
          Implementation
```

Related documentation includes:

* `docs/product/PRODUCT_REQUIREMENTS.md`
* `docs/product/USER_PERSONAS.md`
* `docs/product/USER_JOURNEYS.md`
* `docs/architecture/MULTI_TENANCY.md`
* `docs/architecture/SYSTEM_ARCHITECTURE.md`
* `docs/database/DATABASE_DESIGN.md`
* `docs/security/SECURITY.md`
* `docs/engineering/TESTING_STRATEGY.md`

---

# 29. Relationship to Product Requirements

The multi-tenant architecture directly supports the following product requirements:

* T.Fundi supports multiple independent furniture businesses.
* Every furniture business operates as an isolated tenant.
* Businesses cannot access another tenant's data.
* Orders belong to exactly one tenant.
* The platform supports furniture businesses as primary users.
* The platform must scale to support multiple businesses.

The architecture also supports the longer-term product vision of T.Fundi becoming a digital operating system for the furniture industry.

---

# 30. Relationship to User Journeys

The user journeys establish several behaviors that depend on this ADR.

Examples include:

* Furniture businesses operate independently.
* Tenant-specific catalogs exist.
* Tenant-specific orders exist.
* Tenant-specific workshops exist.
* Tenant-specific production workflows exist.
* Tenant-specific users and organizational structures exist.
* Customers interact with a specific furniture business.
* Platform administrators operate above tenant scope.
* Cross-tenant access is prohibited.

The journeys describe the user behavior.

This ADR establishes the multi-tenant architectural boundary required to support that behavior.

---

# 31. Migration and Evolution

T.Fundi should be designed so that tenant isolation mechanisms can evolve without changing the product's fundamental tenant model.

For example, the platform may initially use:

```text
Shared Infrastructure
+
Logical Tenant Isolation
```

and later introduce stronger isolation for specific tenants:

```text
Standard Tenant
→ Shared Infrastructure

Enterprise Tenant
→ Dedicated Resources
```

Such evolution should preserve the same conceptual tenant boundary.

The tenant abstraction should therefore remain independent of the physical infrastructure used to host tenant resources.

---

# 32. Review Triggers

This ADR should be revisited when:

* Enterprise tenants require dedicated infrastructure.
* Tenant count grows significantly.
* Cross-region deployment is introduced.
* Data residency requirements are introduced.
* Tenant-specific infrastructure becomes necessary.
* A security incident exposes a weakness in tenant isolation.
* The database isolation strategy changes.
* The authorization model changes materially.
* Custom domains become part of the platform.
* Tenant billing or usage isolation becomes significant.

Any material change to the decision should result in an updated ADR or a new superseding ADR.

---

# 33. Final Decision Summary

T.Fundi will be built as a **shared, multi-tenant SaaS platform**.

Each furniture business is represented as an independent tenant.

Tenant-owned resources must be explicitly scoped to their tenant and protected through server-side authorization.

Cross-tenant access is denied by default.

Platform-level users operate at a separate platform scope and do not automatically receive unrestricted tenant access.

Tenant organizational structures may differ between businesses, while the platform retains control over the capabilities and permissions available to tenants.

The detailed authorization model will be defined separately in **ADR-0002**.

The architecture must support strong tenant isolation across:

```text
Database
API
Storage
Caching
Background Jobs
Authorization
Observability
```

while remaining scalable enough to support the long-term vision of T.Fundi as a digital operating system for the furniture industry.

---

## Status

**Accepted**

This ADR establishes the foundational multi-tenant architectural decision for T.Fundi.
