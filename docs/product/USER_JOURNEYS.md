# T.Fundi — User Journeys

> **Status:** Draft
> **Version:** 1.0
> **Last Updated:** 2026-08-07
> **Document Type:** Product Documentation

---

## 1. Purpose

This document defines the primary user journeys within the T.Fundi platform.

It describes how each user type interacts with the platform, the authentication boundaries, major system interactions, alternative flows, and failure scenarios.

The journeys defined here are intended to guide:

* Product requirements
* UX and UI design
* API design
* Database modeling
* Authorization
* Testing
* System architecture
* Observability
* Future mobile application development

---

# 2. Platform Actors

T.Fundi supports the following primary actors:

| Actor                  | Description                                                                |
| ---------------------- | -------------------------------------------------------------------------- |
| Guest                  | Unauthenticated visitor exploring furniture                                |
| Customer               | Authenticated user purchasing furniture                                    |
| Interior Designer      | Professional creating furniture designs for clients or purchasing directly |
| Furniture Business     | Tenant operating a furniture storefront and workshop                       |
| Workshop Employee      | Employee responsible for production activities                             |
| Platform Administrator | T.Fundi operator responsible for the platform                              |

The platform also supports different permission levels within both T.Fundi and individual furniture businesses.

---

# 3. Core Platform Journey

The primary T.Fundi loop is:

```text
Discovery
   ↓
Product Exploration
   ↓
Customization
   ↓
AI Visualization
   ↓
Design / Configuration
   ↓
Purchase
   ↓
Production
   ↓
Production Updates
   ↓
Quality Check
   ↓
Delivery
   ↓
Completion
```

T.Fundi connects the customer experience with the furniture business's operational workflow.

---

# 4. Guest Discovery Journey

## 4.1 Goal

Allow users to explore furniture without requiring authentication.

## 4.2 Entry Point

User visits a T.Fundi-powered furniture storefront.

## 4.3 Primary Flow

```text
Landing Page
    ↓
Browse Catalog
    ↓
Search / Filter
    ↓
Product Details
    ↓
3D Product Viewer
    ↓
Basic Customization
```

## 4.4 Guest Capabilities

Guests can:

* Browse furniture
* Search products
* Filter products
* View product details
* View product images
* View available materials
* View available colors
* Interact with 3D furniture models
* Perform basic product customization

Authentication should not be required for basic product discovery.

## 4.5 Authentication Boundary

Authentication is required when the user accesses resource-intensive or persistent features such as:

* AI color matching
* AI room visualization
* Saving designs
* Personal designs
* Checkout
* Order tracking

---

# 5. Customer Journey

## 5.1 Goal

Allow a customer to discover, customize, purchase, and track furniture through delivery.

## 5.2 Primary Flow

```text
Browse Catalog
    ↓
Product Details
    ↓
3D Customization
    ↓
Authentication
    ↓
AI Color Matching / Room Visualization
    ↓
Save Design
    ↓
Add to Cart
    ↓
Checkout
    ↓
Payment
    ↓
Order Created
    ↓
Manufacturing
    ↓
Production Updates
    ↓
Quality Check
    ↓
Delivery
    ↓
Order Completed
```

## 5.3 Basic Customization

A customer may:

* Change available colors
* Change available materials
* Interact with the 3D model
* Preview different configurations

Basic customization does not require authentication.

## 5.4 AI Color Matching

The customer can upload an image containing a desired color.

```text
Upload Color Image
       ↓
Image Validation
       ↓
AI Color Analysis
       ↓
Map to Available Product Options
       ↓
Generate Product Preview
       ↓
Apply Color
```

Authentication is required before performing this operation.

The system should prioritize colors/materials actually available from the furniture business rather than generating unsupported product configurations.

## 5.5 AI Room Visualization

The customer can upload an image of the intended room.

```text
Upload Room Image
       ↓
Validate Image
       ↓
Analyze Room
       ↓
Generate Furniture Visualization
       ↓
Display Result
       ↓
Save / Regenerate
```

The original image must be preserved separately from the generated visualization.

A saved visualization should retain:

* Original room image
* Product
* Product configuration
* Material
* Color
* Generated visualization
* User
* Timestamp

## 5.6 Purchase

```text
Cart
 ↓
Checkout
 ↓
Delivery Details
 ↓
Payment
 ↓
Order Confirmation
```

A confirmed order must have a successful payment state before being considered ready for fulfillment.

## 5.7 Order Tracking

Customers can track production progress.

Example:

```text
✓ Order Confirmed
✓ Materials Prepared
✓ Frame Completed
● Upholstery
○ Finishing
○ Quality Check
○ Delivery
```

Customer-facing production updates may include:

* Stage
* Progress image
* Timestamp
* Customer-facing message

Internal workshop notes must not automatically become customer-visible.

---

# 6. Interior Designer Journey

## 6.1 Goal

Allow interior designers to create furniture configurations/designs for their own projects or clients.

## 6.2 Primary Flow

```text
Browse Catalog
    ↓
Select Furniture
    ↓
Customize
    ↓
3D Preview
    ↓
AI Color Matching
    ↓
AI Room Visualization
    ↓
Save Design
    ↓
Choose Purchase Path
```

## 6.3 Designer Purchase Paths

### Path A — Designer → Client → Purchase

```text
Designer Creates Design
        ↓
Share Design
        ↓
Client Reviews
        ↓
┌──────────────┴──────────────┐
│                             │
Approve                     Request Changes
│                             │
▼                             ▼
Purchase                    Designer Updates
                              │
                              └──→ Client Review
```

### Path B — Designer Purchases Directly

```text
Designer Creates Design
        ↓
Save Design
        ↓
Add to Cart
        ↓
Checkout
        ↓
Payment
        ↓
Order
```

## 6.4 Design Ownership

The designer is recorded as the creator of the design.

The purchaser is recorded separately.

Example:

```text
Design
├── created_by → Designer
├── shared_with → Client
└── ordered_by → Customer / Designer
```

This allows T.Fundi to distinguish:

* Who created the design
* Who approved it
* Who purchased it
* Which furniture business fulfilled it

---

# 7. Furniture Business Journey

A furniture business operates as a tenant within T.Fundi.

## 7.1 Business Onboarding

```text
Business Application
       ↓
Verification
       ↓
Business Profile
       ↓
Store Configuration
       ↓
Workshop Configuration
       ↓
Production Workflow Configuration
       ↓
Dashboard
```

The customer-facing storefront should be tenant-branded so that each business feels like it owns its own digital space.

## 7.2 Product Management

```text
Business Dashboard
       ↓
Products
       ↓
Create Product
       ↓
Product Information
       ↓
Customization Options
       ↓
3D Assets
       ↓
Preview
       ↓
Publish
```

A product can contain:

* Name
* Description
* Category
* Dimensions
* Price
* Images
* Materials
* Colors
* 3D model
* Customization options

## 7.3 Order Management

When an order is created:

```text
Order Received
      ↓
Order Review
      ↓
Accept
      ↓
Ready for Production
```

If information is missing:

```text
Order Review
      ↓
Clarification Required
      ↓
Customer / Designer
      ↓
Clarification
      ↓
Order Review
```

## 7.4 Product Snapshot

The order must preserve the configuration purchased at the time of purchase.

This includes:

* Product
* Variant
* Material
* Color
* Dimensions
* Quantity
* Price
* Customization

Changes to the current catalog product must not modify historical orders.

---

# 8. Production Journey

Production workflows are configurable by each furniture business.

For example:

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

Another business may use a different workflow.

T.Fundi should provide the workflow capability without requiring every business to use the same production stages.

## 8.1 Production Job

```text
Accepted Order
      ↓
Production Job
      ↓
Assign Employee
      ↓
Production Stage
```

## 8.2 Production State

A production stage may transition through:

```text
PENDING
   ↓
ASSIGNED
   ↓
IN_PROGRESS
   ↓
COMPLETED
```

A quality failure may cause:

```text
COMPLETED
   ↓
QUALITY_CHECK_FAILED
   ↓
REWORK
   ↓
IN_PROGRESS
```

Production should therefore not be treated as a strictly linear workflow.

---

# 9. Workshop Employee Journey

## 9.1 Goal

Allow workshop employees to perform assigned production work without exposing unnecessary business or customer information.

## 9.2 Primary Flow

```text
Login
  ↓
Workshop Dashboard
  ↓
Assigned Jobs
  ↓
Production Job
  ↓
Production Specification
  ↓
Start Stage
  ↓
Work In Progress
  ↓
Production Update
  ↓
Complete Stage
  ↓
Next Stage
```

## 9.3 Production Specification

Employees should see the exact configuration required to manufacture the order.

Example:

```text
Product:
Modern 3-Seater Sofa

Dimensions:
220cm × 85cm × 95cm

Frame:
Oak

Material:
Velvet

Color:
Warm Beige

Quantity:
1
```

The employee may also see approved reference images or design visualizations.

## 9.4 Production Updates

Employees may:

* Upload progress photos
* Add notes
* Report issues
* Complete stages

Production updates should contain:

```text
Stage
Employee
Timestamp
Image
Notes
Visibility
```

Visibility should distinguish between:

```text
INTERNAL
CUSTOMER_VISIBLE
```

V1 should default employee updates to internal visibility unless the business grants appropriate publishing permissions.

## 9.5 Production Issues

An employee can report an issue:

```text
Report Issue
     ↓
Issue Created
     ↓
Business Admin Review
     ↓
Resolution
```

Possible resolutions include:

* Continue with current specification
* Use an approved alternative
* Request customer approval
* Pause production
* Cancel order
* Rework

Employees should not directly modify the purchased order configuration.

---

# 10. Quality Control Journey

```text
Production Complete
       ↓
Quality Check
       ↓
┌──────┴──────┐
│             │
PASS          FAIL
│             │
▼             ▼
Delivery     Rework
              │
              ▼
           Production
              │
              ▼
         Quality Check
```

Quality control must be represented independently from production completion.

---

# 11. Delivery Journey

```text
Quality Check Passed
       ↓
Ready for Delivery
       ↓
Schedule Delivery
       ↓
Customer Notification
       ↓
Out for Delivery
       ↓
Delivered
       ↓
Order Completed
```

V1 may support business-managed delivery without requiring third-party delivery integrations.

---

# 12. Platform Access and Authorization

T.Fundi is a multi-tenant platform.

Authorization must therefore distinguish between:

1. Platform scope
2. Tenant scope
3. Resource scope
4. Context

The conceptual authorization flow is:

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

---

# 13. Platform Hierarchy

Platform-level roles are controlled by T.Fundi.

Initial system roles:

```text
PLATFORM_OWNER
PLATFORM_ADMIN
PLATFORM_OPERATIONS
PLATFORM_SUPPORT
```

Platform roles and permissions are controlled by T.Fundi.

Platform users must not automatically receive unrestricted access to tenant data.

Privileged tenant access must be explicitly authorized and auditable.

---

# 14. Tenant Organization Hierarchy

Furniture businesses should have a dynamic organizational structure.

T.Fundi should provide the permission system and permission catalog while allowing each tenant to define its own organizational hierarchy.

Example:

```text
Tenant Owner
    │
    ├── General Manager
    │      ├── Sales Manager
    │      └── Operations Manager
    │             ├── Workshop Supervisor
    │             └── Quality Control
    │
    └── Catalog Manager
```

Another tenant may use:

```text
Owner
├── Admin
├── Workshop Lead
└── Artisan
```

T.Fundi should support both structures.

## 14.1 Tenant Custom Roles

Tenants can create custom roles using permissions exposed by T.Fundi.

Example:

```text
Workshop Supervisor

✓ production.view
✓ production.assign
✓ production.update
✓ production.complete
✓ user.view
```

Tenants cannot create arbitrary platform capabilities or permissions.

The permission vocabulary remains controlled by T.Fundi.

---

# 15. User Role Assignment

A user may have one or more roles.

```text
User
 ├── Role A
 └── Role B
```

Effective permissions are derived from the user's assigned roles.

A user may also have an organizational position and reporting relationship.

Example:

```text
User
 ├── Role
 ├── Position
 ├── Reports To
 └── Location
```

Organizational hierarchy is primarily used for authorization and operational organization, not as a full HR management system.

---

# 16. Tenant Isolation

Tenant isolation is a core security requirement.

A user belonging to Tenant A must not access Tenant B resources unless explicitly authorized at the platform level.

For example:

```text
Tenant A
└── User A
      ↓
   order.view
      ↓
Tenant A Orders ✓

Tenant B Orders ✗
```

Authorization must therefore evaluate tenant ownership as part of every protected resource operation.

---

# 17. Platform Administrator Journey

Platform administrators operate T.Fundi itself rather than a specific furniture business.

## 17.1 Platform Dashboard

```text
Platform Dashboard
       │
       ├── Tenant Management
       ├── User Management
       ├── System Health
       ├── Platform Analytics
       ├── Security
       └── Audit Logs
```

## 17.2 Tenant Management

```text
Business Application
       ↓
Review
       ↓
Approve / Reject
       ↓
Tenant Created
       ↓
Tenant Onboarding
```

Possible tenant states include:

```text
PENDING
ACTIVE
SUSPENDED
ARCHIVED
```

## 17.3 Platform Monitoring

Platform administrators may monitor:

* API availability
* Error rates
* Latency
* Database health
* Storage
* Background jobs
* AI processing
* Payment integrations
* Infrastructure health

Detailed observability requirements will be defined separately.

---

# 18. Incident Management

Platform incidents should follow:

```text
Detection
   ↓
Alert
   ↓
Investigation
   ↓
Mitigation
   ↓
Resolution
   ↓
Incident Record
   ↓
Postmortem where required
```

An incident record should eventually capture:

```text
Severity
Started At
Detected At
Resolved At
Impact
Root Cause
Resolution
Postmortem
```

---

# 19. Failure Scenarios

## 19.1 Authentication Failure

```text
Login
 ↓
Invalid Credentials
 ↓
Error
 ↓
Retry
```

## 19.2 AI Processing Failure

```text
AI Request
 ↓
Processing
 ↓
Failure
 ↓
Retry / Cancel
```

AI operations should eventually use asynchronous processing rather than blocking the main request.

Conceptually:

```text
Client
  ↓
Create AI Job
  ↓
202 Accepted
  ↓
Background Processing
  ↓
Completed / Failed
```

## 19.3 Payment Failure

```text
Checkout
 ↓
Payment
 ↓
Failure
 ↓
Retry Payment
```

A failed payment must not automatically result in a confirmed paid order.

## 19.4 Production Issue

```text
Production
 ↓
Issue Detected
 ↓
Issue Reported
 ↓
Business Review
 ↓
Resolution
 ↓
Production Resumes
```

## 19.5 Quality Failure

```text
Production Complete
 ↓
Quality Check
 ↓
FAIL
 ↓
Rework
 ↓
Quality Check
```

---

# 20. Cross-Journey Business Rules

The following rules apply across multiple journeys.

### Rule 1 — Authentication should not block discovery

Guests can browse and explore products before creating an account.

### Rule 2 — Resource-intensive AI capabilities require authentication

AI color matching and room visualization require authenticated users.

### Rule 3 — Original visualization input must be preserved

The original room image must remain separate from generated results.

### Rule 4 — Orders preserve purchased configuration

Historical orders must not change when the catalog changes.

### Rule 5 — Production workflows are tenant-configurable

Different furniture businesses may use different production stages.

### Rule 6 — Internal and customer-facing production updates are separate

Internal workshop information must not automatically become customer-visible.

### Rule 7 — Production supports rework

Production cannot be modeled as an irreversible linear sequence.

### Rule 8 — Designer and purchaser are separate concepts

The creator of a design does not necessarily become the purchaser.

### Rule 9 — Tenant hierarchy is configurable

Tenants can create organizational roles using T.Fundi-defined permissions.

### Rule 10 — Tenant isolation is mandatory

Tenant users cannot access another tenant's resources.

### Rule 11 — Authorization is permission-based

The journeys establish the need for permission-based authorization,
tenant-scoped access, and configurable tenant roles.

The detailed authorization model will be defined in [ADR-0002](../engineering/ADR/ADR-0002-tenant-configurable-authorization.md).
---

# 21. Future Journeys

The following are intentionally outside the initial release but should remain compatible with the architecture:

* Multiple locations per furniture business
* Multiple workshops
* Client project management for designers
* Design versioning
* Mood boards
* Collections
* Bulk ordering
* Delivery provider integrations
* Customer reviews
* Advanced business analytics
* Advanced tenant organization management
* Mobile applications

---

# 22. Journey-to-System Mapping

These journeys will eventually map to the following technical domains:

```text
Guest / Customer
        ↓
Catalog
        ↓
Product Configuration
        ↓
AI Services
        ↓
Identity & Access
        ↓
Cart / Checkout
        ↓
Payments
        ↓
Orders
        ↓
Production
        ↓
Notifications
        ↓
Delivery
```

Business operations:

```text
Tenant
 ↓
Users / Roles
 ↓
Catalog
 ↓
Orders
 ↓
Workshop
 ↓
Production
 ↓
Quality Control
```

Platform operations:

```text
Platform
 ↓
Tenant Management
 ↓
Identity & Authorization
 ↓
Observability
 ↓
Audit
 ↓
Infrastructure
```

---

# 23. Architectural Principles Emerging From These Journeys

The journeys imply the following architectural principles:

1. **Multi-tenancy is a first-class concern.**
2. **Tenant isolation must be enforced at the backend.**
3. **Authorization should be permission and scope based.**
4. **Tenant organizational hierarchies should be configurable.**
5. **Products and purchased configurations are separate concepts.**
6. **Production workflows must be configurable.**
7. **Production is stateful and supports rework.**
8. **AI operations should be asynchronous.**
9. **Customer-facing and internal operational information must be separated.**
10. **Every important operational transition should be auditable.**
11. **The architecture should support future mobile clients.**
12. **The system should scale beyond a single furniture business.**

---

## 24. Document Status

This document represents the current product journey definition for Sprint 0.

Changes that materially affect architecture, security, data ownership, or system boundaries should be reflected in the appropriate ADR or technical documentation before implementation.
