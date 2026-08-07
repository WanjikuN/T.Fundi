# ADR-0002: Tenant-Configurable Authorization

| Field               | Value                                         |
| ------------------- | --------------------------------------------- |
| **ADR**             | ADR-0002                                      |
| **Title**           | Tenant-Configurable Authorization             |
| **Status**          | Accepted                                      |
| **Date**            | 2026-08-07                                    |
| **Decision Owners** | T.Fundi Engineering                           |
| **Related ADR**     | ADR-0001 — Multi-Tenant Platform Architecture |

---

# 1. Context

T.Fundi is a multi-tenant SaaS platform where multiple independent furniture businesses operate through the same underlying platform.

Each furniture business may have a different organizational structure.

For example, one furniture business may operate as:

```text
Owner
├── General Manager
│   ├── Sales Manager
│   └── Workshop Manager
│       ├── Workshop Supervisor
│       └── Artisan
└── Catalog Manager
```

Another business may operate as:

```text
Owner
├── Admin
├── Workshop Lead
└── Artisan
```

The platform must support both structures without hard-coding business-specific roles into the application.

At the same time, T.Fundi must maintain control over the capabilities that users are allowed to perform.

A tenant should be able to define:

* Its own roles.
* Its own organizational hierarchy.
* Which platform-defined permissions belong to each role.
* Which users belong to which roles.
* Reporting relationships where required.

A tenant must not be able to create arbitrary security capabilities outside the platform's permission model.

For example, a tenant should be able to create:

```text
Workshop Supervisor
```

and assign:

```text
production.view
production.assign
production.update
production.complete
```

But the tenant should not be able to invent an unrestricted capability such as:

```text
bypass.tenant.isolation
```

Tenant authorization therefore needs to balance:

```text
Platform Control
        +
Tenant Flexibility
        +
Strong Security
```

---

# 2. Decision

T.Fundi will use a **permission-based, tenant-configurable Role-Based Access Control (RBAC) model with optional organizational hierarchy and scoped authorization**.

The platform will own and define the available permission vocabulary.

Each tenant may configure its own roles using those platform-defined permissions.

Users receive permissions through their tenant memberships and assigned roles rather than through hard-coded application roles.

The conceptual model is:

```text
User
  ↓
Tenant Membership
  ↓
Role
  ↓
Permissions
  ↓
Scope
  ↓
Resource
  ↓
Authorization Decision
```

The platform therefore separates:

* Identity
* Tenant membership
* Organizational roles
* Permissions
* Scope
* Resource ownership
* Authorization

---

# 3. Core Authorization Model

The core relationship is:

```text
User
 │
 ├── Tenant Membership
 │       │
 │       └── Tenant
 │
 └── Role Assignment
         │
         └── Role
              │
              └── Permissions
```

For example:

```text
Patricia
   │
   ▼
Tenant Membership
   │
   ▼
Timber Furniture
   │
   ▼
Workshop Supervisor
   │
   ├── production.view
   ├── production.assign
   ├── production.update
   └── production.complete
```

The user's effective permissions are evaluated within the appropriate tenant and scope.

---

# 4. Platform Permission Catalog

T.Fundi owns the permission catalog.

Permissions represent capabilities that the platform understands.

Examples:

```text
catalog.view
catalog.create
catalog.update
catalog.delete

orders.view
orders.create
orders.update
orders.cancel

production.view
production.assign
production.update
production.complete

users.view
users.invite
users.update
users.disable

roles.view
roles.create
roles.update
roles.assign
```

The exact permission catalog will evolve with the platform.

Permissions should represent meaningful application capabilities rather than arbitrary UI actions.

---

# 5. Tenant Roles

A role is a named collection of permissions within a tenant.

Examples:

```text
Workshop Supervisor
Sales Manager
Catalog Manager
Production Lead
Artisan
Customer Service
```

Roles are tenant-specific.

Therefore:

```text
Tenant A
└── Workshop Supervisor
```

and:

```text
Tenant B
└── Workshop Supervisor
```

may have completely different permission assignments.

The role name does not determine authorization.

The permissions assigned to the role determine what the role can do.

---

# 6. Tenant Role Configuration

A tenant may create and manage roles within the capabilities provided by T.Fundi.

For example:

```text
Role:
Workshop Supervisor

Permissions:
✓ production.view
✓ production.assign
✓ production.update
✓ production.complete
✓ production.report_issue
```

Another tenant may define:

```text
Role:
Workshop Lead

Permissions:
✓ production.view
✓ production.assign
✓ production.update
```

T.Fundi does not require the role names to be standardized.

The platform controls the available permissions.

The tenant controls how those permissions are grouped into business roles.

---

# 7. Tenant Organizational Hierarchy

T.Fundi will support configurable organizational hierarchies.

A tenant may organize its users into a hierarchy such as:

```text
Owner
   │
   ├── General Manager
   │      ├── Sales Manager
   │      └── Workshop Manager
   │             ├── Supervisor
   │             └── Artisan
   │
   └── Catalog Manager
```

The hierarchy is tenant-specific.

Another tenant may use:

```text
Owner
   │
   ├── Admin
   ├── Workshop Lead
   └── Artisan
```

The platform must not assume a universal organizational hierarchy.

---

# 8. Organizational Hierarchy vs Authorization

Organizational hierarchy and authorization are related but distinct concepts.

A reporting relationship does not automatically grant access.

For example:

```text
Owner
   ↓
Workshop Manager
   ↓
Artisan
```

does not necessarily mean the Owner can automatically access every resource unless the Owner's assigned permissions allow it.

Authorization is determined by permissions and scope.

The organizational hierarchy provides additional context for business operations and may be used by future authorization rules where explicitly supported.

---

# 9. User Membership

A user's relationship with a tenant is represented by a tenant membership.

Conceptually:

```text
User
   │
   ├── Tenant Membership A
   │       └── Tenant A
   │
   └── Tenant Membership B
           └── Tenant B
```

This allows the same platform identity to potentially participate in multiple tenants without merging the businesses' data.

Each membership has its own tenant-specific authorization context.

For example:

```text
User
│
├── Tenant A
│    └── Sales Manager
│
└── Tenant B
     └── Workshop Supervisor
```

The user's effective permissions therefore depend on the tenant context in which an operation occurs.

---

# 10. Role Assignment

A tenant membership may have one or more role assignments.

Conceptually:

```text
User
   ↓
Tenant Membership
   ↓
┌───────────────┐
│ Role A        │
│ Role B        │
└───────────────┘
```

For example:

```text
Patricia
   │
   ▼
Tenant A
   │
   ├── Catalog Manager
   │
   └── Sales Manager
```

Effective permissions may be the union of permissions granted through the user's active roles, subject to scope and authorization rules.

The exact conflict-resolution model is deferred to implementation.

---

# 11. Permission Inheritance

The initial authorization model does **not** require roles to inherit from other roles.

For example:

```text
Workshop Manager
       ↓
Workshop Supervisor
       ↓
Artisan
```

does not automatically mean:

```text
Artisan permissions
⊂
Supervisor permissions
⊂
Manager permissions
```

unless explicit role inheritance is introduced.

This avoids accidental privilege escalation caused by organizational relationships.

Role inheritance may be introduced in a future ADR if real-world requirements justify it.

---

# 12. Scope

Permissions alone are insufficient.

Authorization must also consider scope.

A permission may operate at different scopes:

```text
Platform
Tenant
Organization Unit
Resource
Resource Instance
```

For example:

```text
orders.view
```

might mean:

```text
View all orders within tenant
```

while a future scoped permission could mean:

```text
View orders assigned to my workshop
```

The exact scope model will evolve with the platform.

The authorization architecture must therefore avoid assuming that every permission automatically applies to every resource in the tenant.

---

# 13. Tenant Scope

Tenant scope is mandatory for tenant-owned resources.

For example:

```text
User
 ↓
Tenant A
 ↓
orders.view
 ↓
Order belonging to Tenant A
```

is potentially authorized.

But:

```text
User
 ↓
Tenant A
 ↓
orders.view
 ↓
Order belonging to Tenant B
```

must be denied.

Tenant ownership is therefore an independent authorization requirement.

---

# 14. Resource Authorization

Authorization must evaluate both permission and resource ownership.

Conceptually:

```text
Can User X perform Action Y on Resource Z?
```

The system evaluates:

```text
Identity
   ↓
Tenant Membership
   ↓
Permission
   ↓
Tenant Ownership
   ↓
Resource Scope
   ↓
Authorization Decision
```

For example:

```text
User:
Workshop Supervisor

Permission:
production.update

Resource:
Production Job #123

Tenant:
Tenant A

Result:
ALLOW
```

If Production Job #123 belongs to Tenant B:

```text
Result:
DENY
```

even if the user possesses `production.update`.

---

# 15. Authorization Evaluation Flow

Every protected operation should conceptually follow:

```text
Request
   ↓
Authenticate
   ↓
Identify User
   ↓
Resolve Tenant Context
   ↓
Resolve Tenant Membership
   ↓
Load Effective Roles
   ↓
Resolve Effective Permissions
   ↓
Validate Resource Ownership
   ↓
Evaluate Scope
   ↓
Authorization Decision
   ↓
Allow / Deny
```

A denial at any required stage should prevent the operation.

---

# 16. Deny by Default

T.Fundi will use a **deny-by-default** authorization model.

If the system cannot establish that an operation is permitted, it must deny the operation.

Conceptually:

```text
Permission explicitly granted?
        │
     ┌──┴──┐
    YES    NO
     │      │
   Scope   DENY
    │
    ▼
Resource authorized?
    │
 ┌──┴──┐
YES    NO
 │      │
ALLOW  DENY
```

Authorization must never rely on assumptions such as:

* The user is logged in.
* The user belongs to the business.
* The user has an administrative-looking role name.
* The user accessed the page through the UI.
* The resource ID looks valid.

---

# 17. Platform Roles

Platform-level roles are separate from tenant roles.

Initial platform roles may include:

```text
PLATFORM_OWNER
PLATFORM_ADMIN
PLATFORM_OPERATIONS
PLATFORM_SUPPORT
```

These roles are controlled by T.Fundi.

They are not tenant-configurable.

Platform roles and tenant roles must not be conflated.

---

# 18. Platform vs Tenant Authorization

The authorization model therefore has two major scopes:

```text
Platform Scope
      │
      └── T.Fundi Operations

Tenant Scope
      │
      ├── Tenant Users
      ├── Tenant Roles
      ├── Tenant Products
      ├── Tenant Orders
      └── Tenant Workshop
```

A platform user does not automatically receive unrestricted access to all tenant data.

Privileged tenant access must be explicitly permitted and auditable.

---

# 19. Platform Permission Control

Tenants cannot:

* Create new platform permissions.
* Modify the meaning of platform permissions.
* Grant themselves platform permissions.
* Grant themselves cross-tenant permissions.
* Bypass tenant isolation.
* Modify platform security policies.

The platform remains the authority over security capabilities.

---

# 20. Role Management Permissions

Role management itself must be permission-controlled.

For example:

```text
roles.view
roles.create
roles.update
roles.delete
roles.assign
```

A tenant user should only be able to modify roles when explicitly authorized.

The platform should avoid assuming that every tenant owner requires unrestricted technical access to every authorization operation.

---

# 21. Privileged Roles

Some tenant roles may be considered privileged because they can modify authorization.

For example:

```text
Tenant Owner
Tenant Administrator
```

may have permissions such as:

```text
users.manage
roles.manage
```

The platform should treat authorization-management permissions as security-sensitive.

Changes to roles and permissions should therefore be auditable.

---

# 22. Preventing Privilege Escalation

A user should not be able to grant themselves permissions they do not already have authority to administer.

For example:

```text
User
   ↓
roles.update
   ↓
Attempts to grant:
tenant.security.manage
```

The operation must be evaluated against the user's own authorization authority.

The system must prevent users from using role-management capabilities to escalate themselves or another user beyond their allowed administrative scope.

The exact administrative delegation model is deferred to implementation.

---

# 23. Separation of Duties

Certain sensitive operations may eventually require separation of duties.

For example:

```text
User A
Creates role

User B
Approves role
```

or:

```text
Employee
Completes production

Quality Controller
Approves quality check
```

T.Fundi should not assume that every workflow requires the same person to perform every action.

Specific separation-of-duties requirements will be defined by the relevant product and domain requirements.

---

# 24. Temporary Access

Temporary or delegated access is not required for the initial release.

Potential future capabilities include:

* Temporary role assignment.
* Delegated administration.
* Time-limited access.
* Project-specific access.
* Client-specific access.

These should be introduced through a future authorization decision rather than implicitly included in V1.

---

# 25. Designer Authorization

Interior designers are a professional persona and should not automatically be treated as tenant administrators.

A designer may:

* Create designs.
* Customize products.
* Visualize furniture.
* Share designs.
* Purchase furniture.

The designer's ability to interact with a specific tenant's resources must be determined by the relevant relationship and permissions.

The designer does not automatically gain access to the tenant's internal operations.

---

# 26. Customer Authorization

Customers should only access resources they are authorized to access.

Examples include:

```text
Customer
 ├── Own profile
 ├── Own designs
 ├── Own cart
 ├── Own orders
 └── Own notifications
```

A customer must not access another customer's:

* Orders
* Designs
* Personal information
* Payments
* Private assets

Tenant business users may have broader customer-management permissions according to their assigned roles.

---

# 27. Workshop Authorization

Workshop access must be permission-based.

Example:

```text
Workshop Supervisor
├── production.view
├── production.assign
├── production.update
└── production.complete
```

An artisan may have:

```text
Artisan
├── production.view
└── production.update
```

The artisan should not automatically gain:

```text
production.assign
```

merely because they belong to the workshop.

---

# 28. Internal vs Customer-Visible Actions

Authorization should distinguish between internal operational actions and customer-facing publishing actions where required.

For example:

```text
production.update
```

may allow an employee to update an internal production record.

A separate capability may eventually control:

```text
production.publish_update
```

This prevents internal notes or sensitive operational information from becoming customer-visible accidentally.

The exact permission vocabulary will be refined as workshop requirements evolve.

---

# 29. Authorization and API Security

Authorization must be enforced by backend services.

The frontend may hide unavailable actions for usability, but this is not considered a security mechanism.

For example:

```text
React UI
   ↓
Hide "Delete Product"
```

does not provide security.

The API must independently evaluate:

```text
DELETE /products/:id
       ↓
Authentication
       ↓
Tenant
       ↓
Permission
       ↓
Resource Ownership
       ↓
Authorization
```

A malicious client must not be able to bypass authorization by directly calling the API.

---

# 30. Authorization and Background Jobs

Background jobs must retain authorization context appropriate to the operation.

For example:

```text
Tenant A
   ↓
Create AI Visualization Job
   ↓
Queue
   ↓
Worker
   ↓
Process Tenant A Resources
```

The worker must not process Tenant A's job against Tenant B's resources.

Jobs should carry sufficient context to safely identify:

* Tenant
* User where required
* Resource
* Operation
* Authorization context where required

The exact implementation is deferred to the asynchronous processing architecture.

---

# 31. Authorization and Caching

Tenant-specific authorization must be respected by caching systems.

Cached permission or resource data must not accidentally cross tenant boundaries.

For example:

```text
tenant:A:user:123:permissions
```

must not be reused as:

```text
tenant:B:user:123:permissions
```

The exact caching implementation is deferred.

---

# 32. Authorization and Storage

Access to tenant-specific assets must be authorized independently of the frontend.

Examples:

* Product images
* Room images
* AI-generated visualizations
* Production photographs
* Design assets
* Private documents

Possessing a file identifier must not automatically grant access.

---

# 33. Audit Requirements

Authorization-sensitive operations should generate audit events.

Examples:

```text
Role Created
Role Updated
Role Deleted
Permission Assigned
Permission Removed
User Assigned Role
User Removed From Role
Privileged Access Granted
Privileged Access Used
```

An audit event should eventually provide:

```text
Actor
Tenant
Action
Target
Timestamp
Result
Request Context
```

Detailed audit storage and retention are deferred.

---

# 34. Security Rules

The following rules are mandatory.

### Rule 1 — Deny by default

If authorization cannot be established, deny the request.

### Rule 2 — Tenant isolation is mandatory

Tenant membership must be validated before accessing tenant-owned resources.

### Rule 3 — Permissions are platform-controlled

Tenants may assign platform-defined permissions but cannot invent security capabilities.

### Rule 4 — Role names have no security meaning

A role named `Owner` does not automatically receive permissions.

### Rule 5 — Frontend authorization is not security

Backend authorization is mandatory.

### Rule 6 — Resource ownership must be checked

Possessing a valid permission does not allow access to resources outside the authorized scope.

### Rule 7 — Platform and tenant roles are separate

Tenant administrators cannot grant platform privileges.

### Rule 8 — Authorization changes are sensitive

Role and permission changes must be controlled and auditable.

### Rule 9 — Privilege escalation must be prevented

Users cannot use authorization-management permissions to grant themselves unauthorized privileges.

### Rule 10 — Background processing preserves tenant context

Asynchronous work must remain tenant-safe.

### Rule 11 — Storage must respect authorization

Private tenant assets must not be exposed across tenants.

### Rule 12 — Caches must respect tenant boundaries

Tenant-specific authorization or resource data must not leak through shared caches.

---

# 35. Alternatives Considered

## 35.1 Hard-Coded Application Roles

Example:

```text
ADMIN
MANAGER
WORKSHOP_EMPLOYEE
CUSTOMER
```

### Rejected

Hard-coded roles cannot represent the different organizational structures of furniture businesses.

They would force every tenant into the same hierarchy.

---

# 36. Tenant-Defined Permissions

Another approach would allow tenants to define arbitrary permissions.

Example:

```text
Tenant creates:

can_manage_everything
can_delete_orders
can_bypass_security
```

### Rejected

This would make authorization difficult to reason about and could create significant security risks.

T.Fundi must control the platform's security vocabulary.

---

# 37. Fixed Hierarchy

Another approach would require every tenant to use:

```text
Owner
 ↓
Manager
 ↓
Supervisor
 ↓
Employee
```

### Rejected

Furniture businesses may have very different structures.

The platform must support organizational flexibility.

---

# 38. Fully Dynamic Authorization Engine

A completely policy-driven authorization engine could allow arbitrary rules such as:

```text
User can update production jobs
IF
user.department = workshop
AND
job.location = user.location
AND
job.status != completed
```

### Deferred

This may become valuable as T.Fundi grows, but it introduces substantial complexity.

The initial authorization architecture should establish a strong RBAC foundation with scoped authorization capabilities.

More advanced policy-based authorization can be introduced later if required.

---

# 39. Selected Approach

The selected model is:

```text
Platform-Controlled Permissions
             ↓
Tenant-Configurable Roles
             ↓
Tenant-Configurable Organization
             ↓
User Membership
             ↓
Permission + Scope Evaluation
             ↓
Resource Authorization
```

This provides a balance between flexibility and security.

---

# 40. Consequences

## Positive Consequences

### Flexible Tenant Organizations

Each furniture business can model its own organizational structure.

### Centralized Security Model

T.Fundi maintains control over the available capabilities.

### Reusable Authorization

The same authorization infrastructure can serve:

* Furniture businesses
* Workshop employees
* Interior designers
* Customers
* Platform operations

### Future Extensibility

The model can evolve toward:

* Resource-level permissions
* Organizational units
* Project permissions
* Location-based permissions
* Temporary access
* Policy-based authorization

### Better Product Fit

The authorization model reflects the requirement that each furniture business should feel independently operated while sharing the same platform.

---

# 41. Negative Consequences

## Increased Complexity

Dynamic roles and permissions are more complex than hard-coded roles.

## Authorization Queries

The backend may need to resolve:

```text
User
→ Membership
→ Roles
→ Permissions
→ Scope
→ Resource
```

efficiently.

## Administrative UX

T.Fundi will eventually need a secure interface for tenants to configure:

* Roles
* Permissions
* Users
* Organizational structures

## Testing Complexity

Authorization requires extensive positive and negative testing.

## Security Risk

A bug in authorization could result in privilege escalation or tenant data exposure.

Authorization must therefore be treated as security-critical infrastructure.

---

# 42. Performance Considerations

Authorization must be efficient enough to avoid introducing unacceptable latency into normal API requests.

The implementation should consider:

* Permission caching
* Tenant membership caching
* Efficient database queries
* Precomputed effective permissions where appropriate
* Cache invalidation
* Avoiding unnecessary authorization queries

Performance optimizations must never weaken tenant isolation.

---

# 43. Testing Requirements

Authorization must have dedicated automated tests.

Testing should cover both:

```text
ALLOW
```

and:

```text
DENY
```

scenarios.

---

## 43.1 Authentication Tests

Verify that:

```text
Authenticated user → can authenticate
Unauthenticated user → cannot access protected resources
```

---

## 43.2 Tenant Membership Tests

```text
User belongs to Tenant A
        ↓
Tenant A resource
        ↓
ALLOW
```

and:

```text
User belongs to Tenant A
        ↓
Tenant B resource
        ↓
DENY
```

---

## 43.3 Permission Tests

Verify:

```text
Role has permission
→ operation allowed
```

and:

```text
Role lacks permission
→ operation denied
```

---

## 43.4 Role Assignment Tests

Verify that permissions change correctly when:

* A role is assigned.
* A role is removed.
* A user receives multiple roles.
* A role's permissions change.

---

## 43.5 Privilege Escalation Tests

Attempt to:

* Grant unauthorized permissions.
* Modify privileged roles.
* Assign privileged roles without permission.
* Modify one's own authorization.
* Access platform-level capabilities from tenant scope.

All unauthorized attempts must fail.

---

## 43.6 Resource Ownership Tests

A user with:

```text
orders.view
```

must only access orders within the authorized scope.

---

## 43.7 API Tests

Authorization must be tested directly against backend endpoints.

Tests must not depend solely on frontend behavior.

---

## 43.8 Background Job Tests

Verify that jobs maintain the correct tenant context.

Example:

```text
Tenant A Job
     ↓
Worker
     ↓
Tenant A Resources ✓
Tenant B Resources ✗
```

---

## 43.9 Storage Tests

Verify that tenant-private assets cannot be accessed by unauthorized users.

---

## 43.10 Cache Tests

Verify that cached permissions and resources cannot cross tenant boundaries.

---

## 43.11 Regression Tests

Authorization tests must run in CI/CD.

A change to:

* Authentication
* Roles
* Permissions
* Middleware
* Database access
* API handlers
* Background workers

should trigger relevant authorization tests.

---

# 44. Observability Requirements

Authorization failures should be observable without exposing sensitive information.

Useful telemetry may include:

```text
authorization_denied
authorization_allowed
permission
tenant_id
resource_type
operation
```

Sensitive information should not be logged unnecessarily.

Repeated authorization failures may indicate:

* Application bugs
* Misconfigured roles
* Malicious activity
* Attempted privilege escalation

The detailed observability architecture is deferred.

---

# 45. Implementation Invariants

The following invariants must remain true regardless of implementation details.

```text
Invariant 1
Every tenant user operates through a tenant membership.

Invariant 2
Permissions are controlled by T.Fundi.

Invariant 3
Tenants can configure roles using available permissions.

Invariant 4
Role names do not determine authorization.

Invariant 5
Tenant organizational structures can differ.

Invariant 6
Tenant membership does not automatically grant every permission.

Invariant 7
Authorization is deny-by-default.

Invariant 8
Resource ownership is evaluated for protected resources.

Invariant 9
Frontend restrictions are never treated as security.

Invariant 10
Platform permissions cannot be granted by tenant administrators.

Invariant 11
Authorization changes are auditable.

Invariant 12
Background processing preserves tenant context.

Invariant 13
Tenant boundaries are preserved across database, API, storage, caching, and asynchronous processing.

Invariant 14
Users cannot grant themselves unauthorized privileges.

Invariant 15
The authorization model must support future mobile clients.
```

---

# 46. Deferred Implementation Decisions

This ADR establishes the authorization model but intentionally does not define every technical implementation detail.

The following decisions are deferred.

## 46.1 Database Schema

The exact tables/entities for:

* Users
* Memberships
* Roles
* Permissions
* Role assignments
* Organizational units
* Role hierarchy

will be defined in the database architecture.

---

## 46.2 Permission Storage

The exact representation of permissions is deferred.

Potential approaches include:

```text
Permission table
+
Role-permission relationship
```

or another equivalent implementation.

---

## 46.3 Authentication Technology

The exact authentication mechanism and token strategy are not defined by this ADR.

This includes:

* JWT
* Sessions
* Refresh tokens
* OAuth
* Identity providers

---

## 46.4 Token Claims

Whether tenant context and permissions are represented in tokens is deferred.

The platform must avoid relying on stale authorization information indefinitely.

---

## 46.5 Authorization Middleware

The exact backend middleware/service architecture is deferred.

---

## 46.6 Database-Level Enforcement

Whether database-level mechanisms such as Row-Level Security are used is deferred to database architecture.

---

## 46.7 Role Inheritance

Role inheritance is not required for V1.

It may be introduced through a future ADR.

---

## 46.8 Attribute-Based Authorization

Rules based on attributes such as:

```text
location
department
project
employment status
```

are deferred.

---

## 46.9 Temporary Access

Temporary roles and delegated permissions are deferred.

---

## 46.10 Approval Workflows

Multi-person approval for sensitive authorization changes is deferred.

---

## 46.11 Permission Versioning

Versioning of permission definitions and historical authorization states is deferred.

---

# 47. Relationship to ADR-0001

ADR-0001 establishes:

> T.Fundi is a multi-tenant platform where furniture businesses are isolated tenants.

ADR-0002 establishes:

> Authorization within those tenants is permission-based, while tenant organizations and roles remain configurable.

Together:

```text
ADR-0001
Multi-Tenant Architecture
        │
        ▼
Tenant Boundary
        │
        ▼
ADR-0002
Authorization Model
        │
        ├── Membership
        ├── Roles
        ├── Permissions
        └── Scope
```

ADR-0002 therefore depends on the tenant boundary established by ADR-0001.

---

# 48. Relationship to User Journeys

The User Journeys document establishes that:

* Furniture businesses can have different organizational structures.
* Tenant hierarchies are configurable.
* T.Fundi controls the permission vocabulary.
* Users may have one or more roles.
* Tenant isolation is mandatory.
* Platform and tenant authorization are distinct.

This ADR formalizes those requirements as an architectural authorization decision.

---

# 49. Relationship to Future Architecture

ADR-0002 will influence:

```text
Database Design
      ↓
API Design
      ↓
Backend Authorization
      ↓
Admin UI
      ↓
Testing
      ↓
Observability
```

The eventual implementation should not introduce authorization logic that contradicts the invariants defined here.

---

# 50. Future Evolution

As T.Fundi grows, authorization may evolve beyond basic RBAC.

Potential future capabilities include:

```text
RBAC
 ↓
Scoped RBAC
 ↓
Organizational Authorization
 ↓
Resource-Level Authorization
 ↓
Policy-Based Authorization
```

Potential future requirements include:

* Multi-location businesses
* Multiple workshops
* Project-level permissions
* Designer project access
* Client collaboration
* Temporary permissions
* Delegated administration
* Approval workflows
* Enterprise-specific authorization policies

These capabilities should be introduced through new ADRs where they materially change the authorization architecture.

---

# 51. Final Decision Summary

T.Fundi will implement a **platform-controlled, permission-based authorization model with tenant-configurable roles and organizational hierarchy**.

The platform owns the permission vocabulary.

Tenants can create their own roles and assign platform-defined permissions to those roles.

Users receive authorization through tenant memberships and role assignments.

Authorization decisions must evaluate:

```text
Identity
   ↓
Tenant Membership
   ↓
Permissions
   ↓
Scope
   ↓
Resource Ownership
   ↓
Authorization Decision
```

Authorization is:

```text
Permission-based
+
Tenant-scoped
+
Deny-by-default
+
Server-enforced
+
Auditable
```

Tenant organizational structures remain flexible, while T.Fundi retains control over the security capabilities available to every tenant.

This provides the foundation for T.Fundi to support many independent furniture businesses while allowing each business to operate with its own organizational structure and permissions.

---

# 52. Status

**Accepted**

This ADR establishes the foundational authorization model for T.Fundi.

Implementation-specific decisions will be documented in the appropriate architecture, database, security, or subsequent ADR documents.
