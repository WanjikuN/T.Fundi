# T.Fundi User Personas

| Document | User Personas |
|---|---|
| Product | T.Fundi |
| Version | 1.0.0 |
| Status | Draft |
| Owner | Patricia Njoroge |
| Last Updated | 2026-08-07 |

---

## 1. Purpose

This document defines the primary user personas that T.Fundi is designed to serve.

These personas guide product design, user journeys, authorization requirements, feature prioritization, and system architecture.

Personas represent user needs and behaviors. They should not be treated as direct representations of application roles.

---

# 2. Persona Overview

| Persona | Type | Primary Goal |
|---|---|---|
| Guest | External | Explore furniture without commitment |
| Customer | External | Discover, customize, purchase, and track furniture |
| Interior Designer | Professional | Design spaces and help clients select furniture |
| Furniture Business Owner/Admin | Business | Run a furniture business through T.Fundi |
| Workshop Employee | Internal Business | Manufacture and update furniture orders |
| T.Fundi Platform Administrator | Platform | Operate and protect the T.Fundi platform |

---

# 3. Guest

## Profile

A visitor who has not authenticated with T.Fundi.

The guest may be discovering a furniture business, browsing products, comparing options, or considering a future purchase.

## Goals

- Discover furniture.
- Browse products without creating an account.
- Search and filter products.
- View product details.
- Understand available materials and colors.
- Explore 3D product previews.
- Decide whether further interaction is worthwhile.

## Pain Points

- Being forced to create an account before exploring products.
- Difficulty visualizing furniture.
- Uncertainty about dimensions and materials.
- Lack of product information.
- Poor-quality product imagery.

## Needs

- Fast browsing experience.
- Clear product information.
- High-quality imagery.
- Product search and filtering.
- 3D product previews where available.
- Clear authentication boundaries.

## Key Actions

- Browse catalog.
- Search products.
- Filter products.
- View product details.
- View 3D furniture.
- Initiate authentication.

## Access

Guests may access public catalog functionality.

Authentication is required for:

- AI color matching.
- AI room visualization.
- Saving designs.
- Wishlist.
- Checkout.
- Order tracking.

## Success Criteria

The guest can explore the furniture catalog and understand the value of T.Fundi without being forced to create an account.

---

# 4. Customer

## Profile

An authenticated individual purchasing furniture for personal or residential use.

## Goals

- Find suitable furniture.
- Customize furniture.
- Visualize furniture before purchasing.
- Purchase securely.
- Track production and delivery.

## Pain Points

- Uncertainty about how furniture will look in their space.
- Difficulty selecting colors and materials.
- Lack of transparency after ordering.
- Limited communication with furniture businesses.
- Fear of purchasing expensive furniture without seeing it in context.

## Motivations

- Confidence before purchasing.
- Personalization.
- Convenience.
- Transparency.
- Better visualization.

## Needs

- Account management.
- Product customization.
- 3D visualization.
- AI color matching.
- AI room visualization.
- Wishlist.
- Cart.
- Secure checkout.
- Order tracking.
- Production progress updates.
- Delivery updates.

## Key Actions

```text
Browse
→
Select Product
→
Customize
→
Visualize
→
Add to Cart
→
Checkout
→
Track Order
→
Receive Furniture
```

## Access

Customers can access their own:

- Profile
- Designs
- Wishlist
- Cart
- Orders
- Payments
- Notifications

They cannot access another customer's data.

## Success Criteria

The customer can confidently select, customize, purchase, and track furniture from discovery through delivery.

---

# 5. Interior Designer

## Profile

A professional who designs residential or commercial spaces and may recommend or purchase furniture on behalf of clients.

Interior designers are an important professional user segment because they can influence multiple furniture purchases across projects.

## Goals

- Discover furniture suitable for projects.
- Customize furniture.
- Visualize furniture within spaces.
- Compare materials and colors.
- Present furniture concepts to clients.
- Help clients make purchasing decisions.
- Eventually manage multiple design projects.

## Pain Points

- Difficulty visualizing furniture within client spaces.
- Time spent creating manual furniture mockups.
- Difficulty communicating design concepts to clients.
- Limited access to customizable furniture catalogs.
- Repetitive design workflows.

## Motivations

- Faster design workflows.
- Better client presentations.
- Accurate visualization.
- Easier furniture sourcing.
- Professional-quality outputs.

## Needs — Release 1

- Furniture catalog.
- Product search.
- Product customization.
- 3D visualization.
- AI color matching.
- AI room visualization.
- Save designs.
- Share visualizations.

## Future Needs

- Design projects.
- Mood boards.
- Client collaboration.
- Client approval workflows.
- Design versioning.
- Multi-room projects.
- Furniture collections.
- Project-based ordering.
- Professional billing.

## Key Actions — Release 1

```text
Browse Catalog
→
Select Furniture
→
Customize
→
Visualize
→
Save Design
→
Share With Client
```

## Access

Interior designers can access their own saved designs and visualizations.

Future professional capabilities may require a dedicated designer role and subscription.

## Success Criteria

An interior designer can use T.Fundi to quickly explore, customize, visualize, and present furniture concepts to a client.

---

# 6. Furniture Business Owner / Administrator

## Profile

The owner, manager, or authorized administrator of a furniture business operating on T.Fundi.

Each furniture business represents an independent tenant within the platform.

## Goals

- Establish a digital storefront.
- Showcase furniture.
- Manage products.
- Receive and manage orders.
- Manage customers.
- Track production.
- Communicate progress.
- Monitor business performance.

## Pain Points

- Manual order management.
- Limited digital presence.
- Fragmented business systems.
- Poor production visibility.
- Manual customer communication.
- Difficulty managing product information.

## Motivations

- Increase sales.
- Reduce operational overhead.
- Improve customer trust.
- Improve production transparency.
- Access modern technology without building it themselves.

## Needs

- Business profile.
- Branding configuration.
- Product management.
- Category management.
- Material management.
- Order management.
- Customer management.
- Workshop management.
- Production tracking.
- Analytics.
- Notifications.

## Key Actions

```text
Configure Business
→
Add Products
→
Receive Order
→
Process Order
→
Assign Production
→
Monitor Progress
→
Complete Production
→
Arrange Delivery
```

## Access

Business administrators can access data belonging to their tenant according to their permissions.

They must not be able to access another tenant's data.

## Success Criteria

A furniture business can operate its core digital commerce and production workflow through T.Fundi without requiring a separate custom platform.

---

# 7. Workshop Employee

## Profile

A staff member responsible for manufacturing, quality control, preparation, or other operational activities within a furniture business.

## Goals

- Understand assigned production work.
- Know required specifications.
- Update production status.
- Upload progress evidence.
- Flag issues.
- Complete assigned stages.

## Pain Points

- Paper-based workflows.
- Unclear production priorities.
- Poor communication with management.
- Customers asking for updates that employees cannot easily provide.
- Lack of centralized production information.

## Needs

- Assigned production tasks.
- Product specifications.
- Materials and color information.
- Production stages.
- Status updates.
- Image uploads.
- Issue reporting.

## Key Actions

```text
View Assignment
→
Review Specifications
→
Begin Production
→
Update Stage
→
Upload Progress
→
Complete Stage
```

## Access

Workshop employees can access only the operational information required for their assigned business and permissions.

## Success Criteria

Workshop employees can clearly understand their work and provide reliable production updates without unnecessary administrative overhead.

---

# 8. T.Fundi Platform Administrator

## Profile

An authorized member of the T.Fundi platform team responsible for operating and protecting the SaaS platform.

This role is distinct from a furniture business administrator.

## Goals

- Maintain platform health.
- Manage tenants.
- Manage platform users.
- Monitor system activity.
- Handle platform-level incidents.
- Enforce platform policies.
- Protect tenant isolation.

## Needs

- Tenant management.
- Platform user management.
- Platform monitoring.
- Audit logs.
- System configuration.
- Incident management.
- Platform analytics.

## Key Actions

- Create or approve tenants.
- Manage tenant lifecycle.
- Investigate platform issues.
- Monitor system health.
- Review audit events.
- Manage platform-level configuration.

## Access

Platform administrators have platform-level privileges.

These privileges must be explicitly controlled and audited.

Platform administrators should not have unrestricted access to tenant business data by default.

## Success Criteria

T.Fundi administrators can safely operate the platform while maintaining strong tenant isolation and auditability.

---

# 9. Persona Relationships

T.Fundi connects several groups within the furniture ecosystem.

```text
                    T.Fundi
                       │
        ┌──────────────┼──────────────┐
        │              │              │
     Customer     Interior        Furniture
                   Designer        Business
                                      │
                                      │
                                  Workshop
                                   Employee
```

An interior designer may influence a customer's purchase decision.

A furniture business fulfills the order.

A workshop employee manufactures the furniture.

T.Fundi provides the infrastructure connecting these interactions.

---

# 10. Persona-to-Feature Mapping

| Capability | Guest | Customer | Designer | Business Admin | Workshop Employee | Platform Admin |
|---|---:|---:|---:|---:|---:|---:|
| Browse Catalog | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Product Details | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| 3D Viewer | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Product Customization | ✓ | ✓ | ✓ | ✓ | - | ✓ |
| AI Color Matching | - | ✓ | ✓ | - | - | ✓ |
| AI Room Visualization | - | ✓ | ✓ | - | - | ✓ |
| Save Designs | - | ✓ | ✓ | - | - | ✓ |
| Checkout | - | ✓ | ✓ | - | - | - |
| Order Tracking | - | ✓ | ✓* | ✓ | ✓ | ✓ |
| Product Management | - | - | - | ✓ | - | ✓ |
| Production Management | - | - | - | ✓ | ✓ | ✓ |
| Tenant Management | - | - | - | - | - | ✓ |

`*` Interior Designer access to order tracking may depend on their relationship to the order/project and will be refined in future requirements.

---

# 11. Role vs Persona

Personas describe **who users are and what they need**.

Application roles describe **what users are authorized to do**.

A single persona may have different roles depending on the context.

For example:

```text
Interior Designer
      │
      ├── CUSTOMER
      │
      └── DESIGNER

Furniture Business Owner
      │
      └── TENANT_ADMIN
```

The authorization model will be defined separately during system architecture and security design.

---

# 12. Future Personas

The following personas may be introduced in future releases:

- Architect
- Furniture Supplier
- Delivery Partner
- Furniture Student
- Workshop Instructor
- Property Developer
- Hospitality Business
- Procurement Manager

These personas are not part of Release 1.0 unless explicitly added through the product requirements process.

---

# 13. Related Documents

- [Product Vision](PRODUCT_VISION.md)
- [Product Requirements](PRODUCT_REQUIREMENTS.md)
- [User Journeys](USER_JOURNEYS.md)
- [Information Architecture](INFORMATION_ARCHITECTURE.md)

---

## Document History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0.0 | 2026-08-07 | Patricia Njoroge | Initial version |