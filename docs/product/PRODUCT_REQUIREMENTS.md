# Product Requirements Document (PRD)

| Document | Product Requirements Document |
|----------|-------------------------------|
| Product | T.Fundi |
| Version | 1.0.0 |
| Status | Draft |
| Owner | Patricia Njoroge |
| Last Updated | 2026-08-06 |

---

# 1. Executive Summary

T.Fundi is a multi-tenant, AI-powered SaaS platform designed for furniture businesses.

The platform enables businesses to showcase products, customize furniture, manage manufacturing, process orders, communicate with customers, and operate digitally from a single system.

Customers experience an immersive buying journey through AI-powered room visualization, intelligent color matching, and real-time manufacturing updates.

The long-term vision is to become the digital operating system for the furniture industry.

---

# 2. Problem Statement

## Customers

Customers struggle to:

- Visualize furniture in their own spaces.
- Trust online furniture purchases.
- Customize products confidently.
- Understand manufacturing progress.
- Receive transparent delivery updates.

---

## Furniture Businesses

Businesses struggle with:

- Digital transformation.
- Inventory visibility.
- Customer communication.
- Manufacturing tracking.
- Order management.
- Online customization.

---

## Industry

The furniture industry lacks a unified digital platform that combines commerce, manufacturing, AI, customer engagement, and education.

---

# 3. Product Goals

The primary goals of T.Fundi are:

- Digitize furniture businesses.
- Increase customer purchase confidence.
- Reduce abandoned purchases.
- Improve production transparency.
- Enable furniture customization online.
- Simplify workshop operations.
- Build an extensible platform for future innovation.

---

# 4. Non-Goals

The following capabilities are intentionally out of scope for the initial release:

- Marketplace between furniture businesses.
- Supplier portal.
- Learning platform.
- Public developer API.
- Internationalization.
- Multi-currency support.
- Offline desktop application.

These may be introduced in future releases.

---

# 5. Target Users

## Guests

Visitors browsing furniture.

---

## Customers

Authenticated users purchasing furniture.

---
## Interior Designers


## Furniture Businesses (Tenants)

Companies operating on T.Fundi.

---

## Workshop Employees

Workshop staff and business administrators.

---

## Platform Administrators

Internal T.Fundi administrators.

---

# 6. Product Domains

The platform consists of the following domains:

- Identity
- Tenant Management
- Catalog
- AI Studio
- Orders
- Workshop
- Payments
- Notifications
- Analytics

Each domain will have its own detailed functional requirements document.

---

# 7. Release Scope

## Release 1.0

### Identity

- Registration
- Login
- Password Reset
- Role Based Access Control

### Catalog

- Categories
- Furniture
- Search
- Filtering
- Images
- 3D Models

### AI Studio

- Material customization
- Color customization
- Upload color reference
- AI color matching
- Upload room photo
- AI room visualization

### Commerce

- Shopping cart
- Checkout
- Payments
- Orders

### Workshop

- Production stages
- Progress updates
- Photo uploads
- Delivery tracking

### Administration

- Product Management
- Order Management
- Customer Management
- Dashboard

---

# 8. Functional Requirements

Detailed functional requirements are maintained separately.

See:

- FR-001 Authentication
- FR-002 Catalog
- FR-003 AI Studio
- FR-004 Orders
- FR-005 Workshop
- FR-006 Tenant Management
- FR-007 Payments
- FR-008 Notifications

---

# 9. Non-Functional Requirements

The platform must satisfy the following quality attributes.

## Performance

- Fast page loads.
- Optimized image delivery.
- Efficient API responses.

## Scalability

Support multiple independent furniture businesses.

## Security

Authentication, authorization, encryption, and secure storage.

## Reliability

High availability and graceful error handling.

## Accessibility

WCAG-compliant interfaces.

## Maintainability

Modular architecture with clear boundaries.

## Observability

Centralized logging, metrics, tracing, and monitoring.

---

# 10. Business Rules

- Guests may browse without authentication.
- AI features require authentication.
- Every furniture business operates as an isolated tenant.
- Businesses cannot access another tenant's data.
- Orders belong to exactly one tenant.
- Customers only view their own orders.

---

# 11. Success Metrics

The platform should measure:

Business Metrics

- Active businesses
- Monthly orders
- Revenue
- Customer retention

Customer Metrics

- AI feature usage
- Checkout conversion
- Order completion

Engineering Metrics

- Deployment frequency
- API latency
- Error rate
- Availability
- Test coverage

---

# 12. Risks

Potential risks include:

- AI inference cost.
- Large image uploads.
- 3D asset performance.
- Storage growth.
- Vendor lock-in.
- Tenant isolation failures.

Mitigation strategies will be documented in architecture decisions.

---

# 13. Assumptions

The following assumptions are made:

- Businesses have internet access.
- Customers own smartphones.
- Businesses can upload product assets.
- AI providers remain available.
- Cloud infrastructure is available.

---

# 14. Future Roadmap

Future capabilities include:

- Learning platform
- Mobile applications
- Supplier ecosystem
- Marketplace
- AI recommendations
- Public API
- AR experiences
- International expansion

---

# 15. Related Documents

- PRODUCT_VISION.md
- USER_PERSONAS.md
- USER_JOURNEYS.md
- SYSTEM_ARCHITECTURE.md
- DATABASE_DESIGN.md
- ADRs