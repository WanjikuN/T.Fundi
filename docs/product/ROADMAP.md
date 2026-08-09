# T.Fundi — Product Roadmap

| Field        | Value            |
| ------------ | ---------------- |
| Document     | Product Roadmap  |
| Product      | T.Fundi          |
| Version      | 1.0.0            |
| Status       | Draft            |
| Owner        | Patricia Njoroge |
| Last Updated | 2026-08-09       |

---

# 1. Purpose

This roadmap defines the planned evolution of T.Fundi from its foundational architecture through the initial product release and future platform capabilities.

The roadmap is organized around product outcomes and technical dependencies rather than arbitrary feature volume.

Dates are intentionally approximate. Priorities may change as implementation and user validation provide new information.

---

# 2. Product Direction

T.Fundi aims to become a digital operating system for furniture businesses.

The platform connects:

```text
Discovery
   ↓
Customization
   ↓
Visualization
   ↓
Commerce
   ↓
Production
   ↓
Quality Control
   ↓
Delivery
```

---

# 3. Sprint 0 — Foundation

## Objective

Establish the product, architecture, security, and data foundations required for implementation.

### Product

* Product Vision
* Product Requirements
* User Personas
* User Journeys
* Success Metrics

### Architecture

* System Architecture
* Multi-Tenancy Architecture
* Project Principles
* Database Design
* ERD

### Security and Authorization

* Security Architecture
* Multi-Tenant Architecture ADR
* Tenant-Configurable Authorization ADR

### Outcome

Sprint 0 is complete when the team can begin implementation with clear answers to:

* What are we building?
* Who uses it?
* How do they use it?
* How are tenants isolated?
* How does authorization work?
* What are the major system boundaries?
* What are the core data relationships?

---

# 4. Sprint 1 — Identity and Tenancy

## Objective

Build the platform foundation that allows users and furniture businesses to securely operate within T.Fundi.

### Identity

* User registration
* Login
* Logout
* Password reset
* Session/token management

### Tenant Management

* Tenant creation
* Tenant onboarding
* Tenant status
* Tenant configuration
* Tenant membership

### Authorization

* Permissions
* Roles
* Tenant custom roles
* Membership-role assignments
* Permission checks
* Tenant-scoped authorization

### Organizational Structure

* Organizational units
* Parent-child hierarchy
* User positions
* Reporting relationships

### Security

* Tenant isolation tests
* Authorization tests
* Authentication tests
* Audit events

### Outcome

A furniture business can onboard, invite users, configure its organizational structure, and securely control access to its resources.

---

# 5. Sprint 2 — Catalog

## Objective

Enable furniture businesses to create and manage digital catalogs.

### Catalog

* Categories
* Products
* Product descriptions
* Dimensions
* Pricing
* Product images
* Materials
* Colors
* Product customization options

### 3D

* 3D model uploads
* 3D product viewer
* Product configuration preview

### Customer Experience

* Public catalog
* Search
* Filtering
* Product details

### Outcome

A furniture business can operate a tenant-branded digital storefront with configurable furniture products.

---

# 6. Sprint 3 — AI Studio

## Objective

Increase customer confidence through customization and visualization.

### Color Matching

* Upload color reference
* Validate image
* AI color analysis
* Map result to available business options
* Preview configuration

### Room Visualization

* Upload room image
* Product selection
* Configuration selection
* AI visualization job
* Generated visualization
* Save visualization

### AI Infrastructure

* AI job model
* Background processing
* Job status
* Retry handling
* Failure handling
* Usage tracking

### Outcome

Customers and designers can visualize furniture before purchasing.

---

# 7. Sprint 4 — Commerce

## Objective

Enable customers and designers to purchase furniture.

### Cart

* Add to cart
* Update quantity
* Remove items
* Preserve configuration

### Checkout

* Delivery details
* Order summary
* Payment initiation
* Payment confirmation

### Orders

* Order creation
* Order history
* Order status
* Order configuration snapshot

### Designer Commerce

* Designer-created designs
* Client sharing
* Client approval
* Designer direct purchase

### Outcome

A customer can move from product discovery through successful purchase.

---

# 8. Sprint 5 — Workshop

## Objective

Connect orders to furniture production.

### Production

* Production workflows
* Configurable production stages
* Production jobs
* Employee assignment
* Stage transitions

### Production Updates

* Progress photos
* Notes
* Internal visibility
* Customer-visible updates

### Issues

* Issue reporting
* Business review
* Resolution
* Rework

### Quality Control

* Quality checks
* Pass/fail
* Quality issues
* Rework flow

### Outcome

Furniture businesses can manage production from order acceptance through quality approval.

---

# 9. Sprint 6 — Delivery and Notifications

## Objective

Complete the post-production customer journey.

### Delivery

* Delivery scheduling
* Delivery status
* Delivery events
* Customer notifications

### Notifications

* Order notifications
* Payment notifications
* Production updates
* Delivery updates
* Design sharing notifications

### Outcome

Customers can follow their furniture from production through delivery.

---

# 10. Sprint 7 — Analytics and Operations

## Objective

Give furniture businesses and T.Fundi operators visibility into platform activity.

### Business Analytics

* Orders
* Revenue
* Product performance
* Customer activity
* Production performance

### Platform Analytics

* Tenant activity
* System usage
* AI usage
* Error rates
* Operational health

### Observability

* Logging
* Metrics
* Tracing
* Alerts
* Audit monitoring

### Outcome

Businesses and platform operators can make informed decisions from reliable operational data.

---

# 11. Sprint 8 — Hardening

## Objective

Prepare the platform for reliable production usage.

### Security

* Security review
* Authorization audit
* Tenant isolation testing
* Dependency scanning
* File security testing
* Abuse prevention

### Performance

* API performance
* Image optimization
* Database optimization
* AI processing optimization

### Reliability

* Retry strategies
* Failure recovery
* Background job resilience
* Backup verification

### Testing

* Unit tests
* Integration tests
* End-to-end tests
* Security tests
* Critical journey tests

### Outcome

The platform is sufficiently secure, observable, tested, and reliable for broader release.

---

# 12. Release 1.0

Release 1.0 should provide the complete core furniture-business loop:

```text
Business Onboarding
       ↓
Catalog
       ↓
Customization
       ↓
AI Visualization
       ↓
Cart
       ↓
Checkout
       ↓
Payment
       ↓
Order
       ↓
Production
       ↓
Quality Control
       ↓
Delivery
```

The release should support the primary actors:

* Guest
* Customer
* Interior Designer
* Furniture Business
* Workshop Employee
* Platform Administrator

---

# 13. Future Platform Capabilities

The following capabilities are intentionally deferred from the initial release.

## 13.1 Multiple Locations

Support businesses operating multiple branches or physical locations.

---

## 13.2 Multiple Workshops

Allow a business to operate multiple production facilities.

---

## 13.3 Designer Project Management

Support:

* Projects
* Clients
* Furniture collections
* Project-level designs
* Client approvals

---

## 13.4 Design Versioning

Allow designers to maintain multiple versions of a furniture configuration.

---

## 13.5 Mood Boards and Collections

Enable designers and customers to organize furniture into collections and visual boards.

---

## 13.6 Bulk Ordering

Support commercial and professional orders containing larger quantities of furniture.

---

## 13.7 Delivery Integrations

Integrate with external delivery providers.

---

## 13.8 Customer Reviews

Enable customers to review purchased furniture and businesses.

---

## 13.9 Advanced AI

Potential capabilities include:

* Product recommendations
* Automated design suggestions
* Intelligent product discovery
* Furniture matching
* Design assistance

---

## 13.10 Mobile Applications

Native or cross-platform mobile applications may eventually support:

* Customers
* Designers
* Workshop employees
* Business administrators

---

## 13.11 AR Experiences

Augmented reality may extend room visualization into real-time placement experiences.

---

## 13.12 Marketplace

A future marketplace could connect multiple furniture businesses.

This is explicitly outside the initial product scope.

---

## 13.13 Supplier Ecosystem

Future versions may support relationships with furniture material and component suppliers.

---

## 13.14 Learning Platform

A future learning ecosystem may provide education for:

* Furniture makers
* Designers
* Customers
* Business owners

---

## 13.15 International Expansion

Future releases may support:

* Multiple currencies
* Internationalization
* Regional payment providers
* Regional delivery

---

# 14. Prioritization Principles

Roadmap priorities should consider:

1. Customer value
2. Business value
3. Security
4. Architectural dependency
5. Operational complexity
6. Implementation effort
7. Evidence from real users

Features should not move into implementation merely because they appear on the roadmap.

---

# 15. Roadmap Change Process

A roadmap item may change when:

* User research changes priorities.
* Technical constraints are discovered.
* Business requirements change.
* Security requirements change.
* A dependency changes.
* Validation demonstrates a different path.

Material architecture changes should be reflected in the relevant ADR or architecture documentation.

---

# 16. Success Criteria

The roadmap is successful if T.Fundi progressively enables:

### Customers

```text
Discover
 → Customize
 → Visualize
 → Purchase
 → Track
 → Receive
```

### Designers

```text
Discover
 → Design
 → Visualize
 → Share
 → Approve
 → Purchase
```

### Furniture Businesses

```text
Onboard
 → Configure
 → Sell
 → Manufacture
 → Inspect
 → Deliver
```

### Platform

```text
Operate
 → Secure
 → Observe
 → Scale
```

---

# 17. Related Documents

* `PROJECT_PRINCIPLES.md`
* `product/PRODUCT_VISION.md`
* `product/PRODUCT_REQUIREMENTS.md`
* `product/USER_PERSONAS.md`
* `product/USER_JOURNEYS.md`
* `product/SUCCESS_METRICS.md`
* `architecture/MULTI_TENANCY.md`
* `architecture/SYSTEM_ARCHITECTURE.md`
* `database/DATABASE_DESIGN.md`
* `database/ERD.md`
* `security/SECURITY.md`

---

# 18. Document Status

This roadmap represents the current planned evolution of T.Fundi.

It should be treated as a planning document rather than a fixed delivery commitment.
