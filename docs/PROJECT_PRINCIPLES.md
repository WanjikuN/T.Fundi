# T.Fundi — Project Principles

| Field        | Value              |
| ------------ | ------------------ |
| Document     | Project Principles |
| Product      | T.Fundi            |
| Version      | 1.0.0              |
| Status       | Draft              |
| Owner        | Patricia Njoroge   |
| Last Updated | 2026-08-09         |

---

# 1. Purpose

This document defines the principles that guide product, architecture, engineering, security, and operational decisions for T.Fundi.

These principles provide a common decision-making framework as the platform evolves from an initial MVP into a multi-tenant furniture technology platform.

When a new decision conflicts with an established principle, the conflict should be explicitly identified and resolved through the appropriate product or architecture decision process.

---

# 2. Product Principles

## 2.1 Customer Confidence First

T.Fundi should reduce uncertainty when customers purchase furniture online.

The platform should prioritize experiences that help customers answer:

* What will this furniture look like?
* Can I customize it?
* Will the selected material and color work?
* What happens after I purchase?
* Where is my order?

AI visualization, customization, and production transparency should support this goal.

---

## 2.2 Business Value Over Feature Volume

T.Fundi should prioritize capabilities that solve meaningful problems for furniture businesses and their customers.

A feature should have a clear relationship to:

* Customer value
* Business value
* Operational value
* Strategic differentiation

The platform should avoid adding features solely because they are technically interesting.

---

## 2.3 Design for Real Furniture Workflows

The platform should reflect how furniture businesses actually operate.

This includes:

```text
Catalog
  ↓
Customization
  ↓
Order
  ↓
Production
  ↓
Quality Control
  ↓
Delivery
```

The system should support variation between businesses rather than forcing every furniture business into an identical operational process.

---

## 2.4 Professionals Are First-Class Users

Interior designers are not simply customers with a different interface.

Their workflows may involve:

* Creating designs
* Customizing furniture
* Visualizing spaces
* Sharing designs
* Receiving client approval
* Purchasing directly
* Influencing client purchases

The architecture should therefore allow designer workflows to evolve independently of the standard customer journey.

---

# 3. Multi-Tenancy Principles

## 3.1 Multi-Tenancy Is a First-Class Concern

T.Fundi is designed as a multi-tenant SaaS platform.

The architecture must assume multiple independent furniture businesses from the beginning.

Tenant boundaries should not be treated as an optional future feature.

---

## 3.2 Tenant Isolation Is Mandatory

Data belonging to one furniture business must not be accessible to another tenant without explicit platform-level authorization.

Tenant isolation must be enforced by the backend.

The frontend must never be treated as the security boundary.

---

## 3.3 Tenants Own Their Business Context

A furniture business should control its own:

* Store configuration
* Catalog
* Products
* Customers
* Orders
* Workshop operations
* Organizational structure
* Tenant-level roles

The platform provides the underlying capabilities and security model.

---

## 3.4 Tenant Configuration Over Hard-Coding

Where businesses naturally differ, T.Fundi should prefer configurable models over hard-coded assumptions.

Examples include:

* Organizational hierarchy
* Roles
* Production workflows
* Store configuration
* Product customization options

Configuration must remain within platform-defined boundaries.

---

# 4. Authorization Principles

## 4.1 Permission-Based Authorization

Authorization should be based on permissions and scope rather than hard-coded role names.

Conceptually:

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

Roles are collections of permissions rather than the authorization mechanism itself.

---

## 4.2 Platform Controls the Permission Vocabulary

T.Fundi defines the available permissions.

Tenants may combine those permissions into custom roles but cannot create arbitrary platform capabilities.

Example:

```text
production.view
production.assign
production.update
production.complete
```

A tenant may combine these permissions into a role such as:

```text
Workshop Supervisor
```

---

## 4.3 Least Privilege

Users should receive only the permissions required to perform their responsibilities.

Access should be restricted by:

* Permission
* Tenant
* Resource
* Context

Privileged operations should be auditable.

---

## 4.4 Platform and Tenant Authority Are Separate

Platform administrators operate T.Fundi.

Tenant administrators operate their furniture businesses.

Platform-level authority should not automatically imply unrestricted access to tenant data.

Privileged tenant access must be explicitly authorized and auditable.

---

# 5. Data Principles

## 5.1 Purchased Configurations Are Immutable Snapshots

A historical order must preserve the configuration purchased at the time of purchase.

Changes to the current product catalog must not silently alter historical orders.

An order should retain relevant information such as:

* Product
* Variant
* Material
* Color
* Dimensions
* Quantity
* Price
* Customization

---

## 5.2 Separate Business Concepts

Conceptually different entities should remain separate even when they are related.

For example:

```text
Design Creator
      ≠
Purchaser
      ≠
Customer
      ≠
Furniture Business
```

Similarly:

```text
Product
      ≠
Purchased Product Snapshot
```

and:

```text
Production Stage
      ≠
Quality Check
```

This separation allows the system to evolve without creating ambiguous ownership or state.

---

## 5.3 Preserve Important User Inputs

User-provided assets that influence generated or purchased outcomes should be preserved where required.

For AI room visualization:

```text
Original Room Image
        +
Product Configuration
        +
Generated Visualization
```

The generated output should not replace the original input.

---

# 6. AI Principles

## 6.1 AI Enhances the Product

AI should solve specific user problems rather than exist as a standalone feature.

Initial AI capabilities focus on:

* Color matching
* Room visualization

Future AI capabilities may expand into:

* Recommendations
* Design assistance
* Intelligent product discovery

---

## 6.2 AI Must Respect Product Reality

AI-generated results should not imply that unsupported furniture configurations are available.

Where possible, AI recommendations should map back to actual:

* Products
* Materials
* Colors
* Configurations

available from the relevant furniture business.

---

## 6.3 AI Operations Should Be Resilient

AI operations may be expensive, slow, or unavailable.

The architecture should therefore support:

* Asynchronous processing
* Job states
* Retries
* Failure handling
* Timeouts
* Provider abstraction where appropriate

---

## 6.4 AI Costs Must Be Observable

AI functionality should have measurable operational costs.

The platform should eventually track:

* AI operations
* Processing time
* Failure rates
* Regeneration rates
* Provider costs

---

# 7. Architecture Principles

## 7.1 Domain Boundaries Matter

The system should maintain clear boundaries between major domains.

Initial domains include:

```text
Identity
Tenant Management
Catalog
AI Studio
Orders
Workshop
Payments
Notifications
Analytics
```

Domain boundaries should guide:

* API design
* Database modeling
* Authorization
* Testing
* Ownership

---

## 7.2 Prefer Modular Architecture

T.Fundi should be designed so that domains can evolve independently where practical.

This does not require premature microservices.

A modular monolith is acceptable while the platform is small.

Service extraction should be driven by actual operational or scaling needs.

---

## 7.3 Avoid Premature Complexity

The system should use the simplest architecture that satisfies current requirements.

Complexity should be introduced when justified by:

* Scale
* Reliability
* Security
* Performance
* Team structure
* Operational requirements

---

## 7.4 Architecture Decisions Must Be Explicit

Important architectural decisions should be documented as ADRs.

Examples already established:

* ADR-0001 — Multi-Tenant Platform Architecture
* ADR-0002 — Tenant-Configurable Authorization

Future decisions that materially affect system boundaries, security, data ownership, or infrastructure should follow the same process.

---

# 8. Security Principles

## 8.1 Security by Design

Security must be considered during design rather than added after implementation.

Security requirements apply to:

* Identity
* Authorization
* Tenant isolation
* APIs
* Data storage
* File uploads
* AI processing
* Payments
* Audit logging

---

## 8.2 Backend-Enforced Security

Client-side checks improve user experience but are not authorization controls.

Every protected backend operation must independently verify:

```text
Authenticated Identity
        ↓
Permission
        ↓
Tenant Scope
        ↓
Resource Access
```

---

## 8.3 Sensitive Operations Are Auditable

Important operations should produce audit records where appropriate.

Examples:

* Permission changes
* Role changes
* Tenant configuration changes
* Privileged access
* Order state changes
* Production state changes
* Security events

---

## 8.4 Secure File Handling

T.Fundi handles user-uploaded assets including:

* Product images
* Room images
* Color references
* Production images
* Design visualizations

File uploads must therefore be validated, securely stored, access-controlled, and protected against malicious content.

---

# 9. Engineering Principles

## 9.1 Correctness Before Optimization

The system should first be correct, secure, and maintainable.

Optimization should be driven by evidence.

---

## 9.2 Test Critical Business Rules

Tests should prioritize business-critical behavior.

Especially:

* Authentication
* Authorization
* Tenant isolation
* Product configuration
* Orders
* Payments
* Production state transitions
* Quality control
* AI job handling

---

## 9.3 Observable Systems

Important system behavior should be observable through appropriate:

* Logs
* Metrics
* Traces
* Audit events
* Alerts

A system that cannot explain what happened is difficult to operate safely.

---

## 9.4 Automation Where It Creates Confidence

Automation should be used for:

* Testing
* Validation
* Builds
* Deployment
* Quality checks
* Security checks

Automation should reduce human error rather than hide system behavior.

---

# 10. Product and Engineering Trade-Offs

When trade-offs are required, T.Fundi should generally prioritize:

```text
Security
   ↓
Correctness
   ↓
User Value
   ↓
Maintainability
   ↓
Reliability
   ↓
Performance
   ↓
Convenience
```

This ordering is not absolute.

A decision that materially changes this priority should be explicitly discussed and documented.

---

# 11. Evolution Principles

## 11.1 Design for Growth, Not Hypothetical Scale

The architecture should support T.Fundi's intended growth without implementing infrastructure for scale that does not yet exist.

---

## 11.2 Preserve Extension Points

The initial architecture should avoid unnecessarily blocking future capabilities such as:

* Multiple business locations
* Multiple workshops
* Client project management
* Design versioning
* Mood boards
* Collections
* Bulk ordering
* Delivery integrations
* Customer reviews
* Advanced analytics
* Mobile applications
* AR experiences
* International expansion

These capabilities should not force premature implementation.

---

## 11.3 Backward Compatibility Matters

Changes to APIs, data models, permissions, and workflows should consider existing users and historical records.

Historical orders and important business records must remain interpretable after future system changes.

---

# 12. Decision-Making Framework

When evaluating a significant technical or product decision, ask:

### 1. Does it create user value?

If not, reconsider the decision.

### 2. Does it respect tenant boundaries?

If not, it cannot proceed without addressing the security concern.

### 3. Does it fit the domain model?

Avoid introducing concepts that conflict with established product terminology.

### 4. Does it increase unnecessary complexity?

Prefer the simpler viable solution.

### 5. Can it evolve?

Avoid decisions that unnecessarily prevent future product capabilities.

### 6. Is the decision architectural?

If it materially affects:

* Security
* Data ownership
* System boundaries
* Infrastructure
* Authorization
* Scalability

document it through an ADR.

---

# 13. Definition of a Good T.Fundi Decision

A good decision should be:

* User-focused
* Secure
* Tenant-aware
* Explicit
* Testable
* Observable
* Maintainable
* Reversible where practical
* Justified by current requirements

---

# 14. Related Documents

* `product/PRODUCT_VISION.md`
* `product/PRODUCT_REQUIREMENTS.md`
* `product/USER_PERSONAS.md`
* `product/USER_JOURNEYS.md`
* `product/SUCCESS_METRICS.md`
* `product/ROADMAP.md`
* `architecture/MULTI_TENANCY.md`
* `architecture/SYSTEM_ARCHITECTURE.md`
* `database/DATABASE_DESIGN.md`
* `security/SECURITY.md`
* `engineering/ADR/ADR-0001-multi-tenant-platform.md`
* `engineering/ADR/ADR-0002-tenant-configurable-authorization.md`

---

# 15. Document Status

This document establishes the initial principles for T.Fundi.

These principles should guide Sprint 1 implementation and future product and architecture decisions.

Material changes to these principles should be explicitly reviewed rather than silently modifying the project's foundational assumptions.
