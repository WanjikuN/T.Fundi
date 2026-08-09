# T.Fundi — Database Design

| Field        | Value            |
| ------------ | ---------------- |
| Document     | Database Design  |
| Product      | T.Fundi          |
| Version      | 1.0.0            |
| Status       | Draft            |
| Owner        | Patricia Njoroge |
| Last Updated | 2026-08-09       |

---

# 1. Purpose

This document defines the initial logical database model for T.Fundi.

The design supports:

* Multi-tenancy
* Identity
* Tenant membership
* Configurable authorization
* Catalog management
* Product customization
* Designs
* Orders
* Payments
* Production
* Quality control
* Delivery
* Notifications
* Auditability

The model is intentionally logical rather than tied to a specific database engine implementation.

---

# 2. Database Principles

The database should follow these principles:

1. Tenant ownership must be explicit.
2. Tenant isolation is mandatory.
3. Business concepts should remain separate.
4. Historical orders must preserve purchased configurations.
5. Authorization should be permission-based.
6. Tenant roles should be configurable.
7. Production workflows should be configurable.
8. Important state transitions should be auditable.
9. Referential integrity should be enforced.
10. The schema should support future growth without premature complexity.

---

# 3. Tenant Model

The primary tenant entity is:

```text
tenants
```

A tenant represents an independent furniture business operating on T.Fundi.

Conceptual attributes:

```text
tenant
├── id
├── name
├── slug
├── status
├── configuration
├── created_at
└── updated_at
```

Possible tenant states:

```text
PENDING
ACTIVE
SUSPENDED
ARCHIVED
```

---

# 4. Identity Model

Users are platform identities.

```text
users
```

A user may interact with multiple tenants.

Conceptually:

```text
User
  ↓
Tenant Membership
  ↓
Tenant
```

This prevents the identity itself from being permanently tied to one furniture business.

---

# 5. Tenant Membership

A membership represents a user's relationship with a tenant.

```text
tenant_memberships
```

Conceptual attributes:

```text
tenant_membership
├── id
├── tenant_id
├── user_id
├── status
├── joined_at
└── updated_at
```

A membership should be unique for a given:

```text
tenant_id + user_id
```

---

# 6. Roles and Permissions

Authorization uses:

```text
roles
permissions
role_permissions
membership_roles
```

Conceptual model:

```text
Tenant
  ↓
Membership
  ↓
Role
  ↓
Permission
```

A role may contain multiple permissions.

A permission may belong to multiple roles.

---

## 6.1 Platform Roles

Platform roles are associated with platform identities rather than tenant ownership.

Examples:

```text
PLATFORM_OWNER
PLATFORM_ADMIN
PLATFORM_OPERATIONS
PLATFORM_SUPPORT
```

---

## 6.2 Tenant Roles

Tenant roles belong to a specific tenant.

Example:

```text
Tenant
 └── Workshop Supervisor
       ├── production.view
       ├── production.assign
       ├── production.update
       └── production.complete
```

---

## 6.3 Permission Vocabulary

Permissions are controlled by T.Fundi.

Example permissions:

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
users.manage

roles.view
roles.manage
```

The exact permission catalog will evolve with implementation.

---

# 7. Organizational Hierarchy

Tenant organizational structure should be configurable.

Potential entity:

```text
organizational_units
```

A tenant may define:

```text
Owner
 ├── General Manager
 │     ├── Sales
 │     └── Operations
 │           ├── Workshop
 │           └── Quality Control
 └── Catalog
```

The database should support parent-child relationships rather than requiring a fixed hierarchy.

Conceptually:

```text
organizational_unit
├── id
├── tenant_id
├── parent_id
├── name
├── type
├── created_at
└── updated_at
```

---

# 8. User Positions

A user may have an organizational position.

Conceptually:

```text
user_positions
```

A position may reference:

* Tenant
* User
* Organizational unit
* Position title
* Manager/reporting relationship

The organizational model is not intended to become a full HR system.

---

# 9. Catalog Model

Core catalog entities:

```text
categories
products
product_images
product_models
materials
colors
product_materials
product_colors
```

Relationships:

```text
Tenant
  ↓
Category
  ↓
Product
  ├── Images
  ├── 3D Model
  ├── Materials
  └── Colors
```

Products are tenant-owned.

---

# 10. Product Configuration

A product may support configurable options.

Example:

```text
Product
 ├── Material
 ├── Color
 ├── Dimensions
 └── Other Options
```

Configuration options should be represented separately from purchased order snapshots.

This allows the catalog to evolve without rewriting historical orders.

---

# 11. Designs

Designs represent saved furniture configurations.

```text
designs
```

A design may contain:

```text
design
├── id
├── tenant_id
├── created_by
├── product_id
├── configuration
├── status
├── created_at
└── updated_at
```

A design creator and purchaser are separate concepts.

---

# 12. Design Sharing

Designs may be shared with clients or other users.

Potential entity:

```text
design_shares
```

Conceptually:

```text
Design
   ↓
Design Share
   ↓
Recipient
```

A shared design may support states such as:

```text
SHARED
VIEWED
APPROVED
CHANGES_REQUESTED
EXPIRED
```

---

# 13. AI Operations

AI operations should be represented as jobs rather than assuming synchronous processing.

Potential entity:

```text
ai_jobs
```

Conceptual structure:

```text
AI Job
├── tenant_id
├── user_id
├── type
├── status
├── input_reference
├── output_reference
├── error
├── started_at
├── completed_at
└── created_at
```

Possible states:

```text
PENDING
PROCESSING
COMPLETED
FAILED
CANCELLED
```

---

# 14. Room Visualizations

A room visualization should preserve its source input and generated result.

Conceptually:

```text
room_visualizations
```

Relationship:

```text
Original Room Image
        +
Product Configuration
        ↓
AI Job
        ↓
Generated Visualization
```

The original image should not be overwritten by the generated image.

---

# 15. Orders

Core order entities:

```text
orders
order_items
```

An order belongs to exactly one tenant.

Conceptually:

```text
Tenant
  ↓
Order
  ↓
Order Items
```

---

# 16. Order Snapshot

Order items must preserve the purchased configuration.

Potential fields include:

```text
product_name_snapshot
variant_snapshot
material_snapshot
color_snapshot
dimensions_snapshot
configuration_snapshot
unit_price
quantity
```

The exact implementation may use normalized references combined with immutable snapshots.

The important invariant is:

> Historical orders must remain accurate even if the catalog changes.

---

# 17. Cart

Authenticated users may have carts.

Potential entities:

```text
carts
cart_items
```

A cart belongs to a user and must respect tenant boundaries.

A design configuration added to a cart should preserve the intended configuration until checkout.

---

# 18. Payments

Potential entities:

```text
payments
payment_transactions
```

Conceptually:

```text
Order
  ↓
Payment
  ↓
Payment Transaction
```

Payment state should be represented independently from order state.

Possible payment states:

```text
PENDING
AUTHORIZED
PAID
FAILED
REFUNDED
CANCELLED
```

---

# 19. Production

Production should be configurable per tenant.

Potential entities:

```text
production_workflows
production_stages
production_jobs
production_stage_runs
```

Conceptually:

```text
Tenant
  ↓
Production Workflow
  ↓
Production Stages
  ↓
Production Job
  ↓
Stage Runs
```

---

# 20. Production Workflow

A tenant may define its own stages.

Example:

```text
Materials
   ↓
Frame Construction
   ↓
Upholstery
   ↓
Finishing
   ↓
Quality Check
```

Another tenant may use different stages.

The database must therefore avoid hard-coding a universal production sequence.

---

# 21. Production Jobs

A production job represents manufacturing work associated with an order.

Conceptually:

```text
production_jobs
```

Relationships:

```text
Order
  ↓
Production Job
  ↓
Stage Runs
```

A production job may have an assigned employee.

---

# 22. Production Stage Runs

A stage run represents the execution of a production stage for a specific job.

Possible states:

```text
PENDING
ASSIGNED
IN_PROGRESS
COMPLETED
REWORK
BLOCKED
```

Production is not necessarily linear because quality failures may return work to an earlier stage.

---

# 23. Production Updates

Production updates may include:

* Photos
* Notes
* Stage
* Employee
* Timestamp
* Visibility

Visibility should distinguish:

```text
INTERNAL
CUSTOMER_VISIBLE
```

---

# 24. Quality Control

Quality control should be represented independently from production completion.

Potential entities:

```text
quality_checks
quality_issues
```

Conceptually:

```text
Production
   ↓
Quality Check
   ├── PASS
   └── FAIL
         ↓
       Rework
```

---

# 25. Delivery

Potential entities:

```text
deliveries
delivery_events
```

Conceptual flow:

```text
Quality Passed
      ↓
Delivery
      ↓
Delivery Events
```

Possible delivery states:

```text
PENDING
SCHEDULED
OUT_FOR_DELIVERY
DELIVERED
FAILED
CANCELLED
```

---

# 26. Notifications

Potential entities:

```text
notifications
notification_preferences
```

Notifications may be triggered by:

* Order creation
* Payment events
* Production updates
* Delivery events
* Design sharing
* Client approval

---

# 27. Audit Events

Security-sensitive and operationally important events should be recorded.

Potential entity:

```text
audit_events
```

Conceptual attributes:

```text
audit_event
├── id
├── tenant_id
├── actor_id
├── action
├── resource_type
├── resource_id
├── metadata
├── created_at
└── correlation_id
```

Platform-level events may have no tenant.

---

# 28. Tenant Ownership Rules

Tenant-owned entities should carry an explicit tenant relationship directly or through an unambiguous ownership chain.

Examples:

```text
Product → Tenant
Order → Tenant
Design → Tenant
Production Job → Tenant
AI Job → Tenant
```

This simplifies authorization and reduces the risk of ambiguous tenant resolution.

---

# 29. Referential Integrity

The database should enforce appropriate relationships using:

* Foreign keys
* Unique constraints
* Check constraints
* Not-null constraints
* Appropriate indexes

Application-level validation should complement database constraints rather than replace them.

---

# 30. Indexing Principles

Indexes should prioritize:

* Tenant filtering
* User lookup
* Membership lookup
* Product search
* Order lookup
* Production job lookup
* Status queries
* Timestamp-based queries

Tenant-aware indexes should be considered for high-volume tenant-owned tables.

---

# 31. Deletion Strategy

Historical business records should generally not be physically deleted merely because a related catalog record is removed.

Examples:

* Orders
* Payments
* Production history
* Audit events

Soft deletion or archival may be appropriate depending on the entity.

Exact retention policies remain deferred.

---

# 32. Data Lifecycle

Conceptually:

```text
Create
  ↓
Active
  ↓
Updated
  ↓
Archived
  ↓
Retention / Deletion
```

Different entities may have different lifecycle rules.

---

# 33. Transaction Boundaries

Operations that must remain atomic should be performed within appropriate database transactions.

Examples include:

* Order creation
* Payment state updates
* Production stage transitions
* Role and permission assignments

External integrations should use appropriate consistency and retry strategies rather than relying on a distributed database transaction.

---

# 34. Concurrency

The system must account for concurrent operations such as:

* Multiple users editing catalog products.
* Multiple workshop employees updating production.
* Payment callbacks.
* Duplicate requests.
* Concurrent order operations.

Where required, use:

* Idempotency
* Optimistic locking
* Unique constraints
* State transition validation

---

# 35. Deferred Database Decisions

The following are intentionally deferred:

* Exact PostgreSQL schema.
* UUID vs other identifier implementation.
* JSONB usage boundaries.
* Database partitioning.
* Row-level security implementation.
* Full-text search strategy.
* Geospatial extensions beyond current requirements.
* Read replicas.
* Database sharding.
* Backup retention.
* Data archival implementation.

These decisions should be made when implementation requirements justify them.

---

# 36. Related Documents

* `architecture/MULTI_TENANCY.md`
* `architecture/SYSTEM_ARCHITECTURE.md`
* `product/USER_JOURNEYS.md`
* `engineering/ADR/ADR-0001-multi-tenant-platform.md`
* `engineering/ADR/ADR-0002-tenant-configurable-authorization.md`
* `security/SECURITY.md`
* `ERD.md`

---

# 37. Document Status

This document defines the logical database model for T.Fundi.

The implementation schema may evolve while preserving the business and security invariants defined here.
