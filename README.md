# T.Fundi

### The digital workshop for modern furniture.

T.Fundi is a **multi-tenant furniture commerce and visualization platform** designed to connect furniture businesses, workshops, and customers through a single digital experience.

The platform combines a traditional furniture catalog and commerce experience with **AI-powered product visualization, material and color customization, room visualization, and workshop management**.

> **T.Fundi helps customers see, customize, and understand furniture before they buy it — while giving furniture businesses the tools to manage their digital storefront and operations.**

---

## ✨ What is T.Fundi?

Buying furniture online often comes with a fundamental problem:

**Customers cannot easily visualize what a piece will look like in their space.**

T.Fundi is built to solve that problem.

Customers can:

* Browse furniture catalogs
* Explore detailed product information
* View furniture from different angles
* Customize materials and colors
* Upload a color/reference image
* Use AI to match furniture colors and materials
* Upload a room photo
* Visualize furniture in their own space
* Add products to their cart
* Place and track orders

Businesses, meanwhile, get their own branded digital storefront and management tools.

---

# 🎯 Product Vision

T.Fundi aims to become a digital operating layer for furniture businesses.

Instead of treating a furniture website as simply a catalog, T.Fundi brings together:

```text
                    T.FUNDI
                       │
        ┌──────────────┼──────────────┐
        │              │              │
     CATALOG        AI STUDIO      COMMERCE
        │              │              │
   Products       Customize       Cart
   Materials      Match Colors    Orders
   Categories     Visualize       Payments
   Images         Room AI         Tracking
        │              │              │
        └──────────────┼──────────────┘
                       │
                  WORKSHOP
                       │
              Production & Orders
                       │
                    ADMIN
                       │
             Platform Management
```

---

# 🏗️ Platform Architecture

T.Fundi is designed as a **multi-tenant SaaS platform**.

Each furniture business can operate its own storefront while the underlying platform provides shared infrastructure and functionality.

Conceptually:

```text
                         T.FUNDI PLATFORM
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
           Tenant A          Tenant B          Tenant C
              │                 │                 │
        ┌─────┴─────┐     ┌─────┴─────┐     ┌─────┴─────┐
        │ Storefront│     │ Storefront│     │ Storefront│
        │ Catalog   │     │ Catalog   │     │ Catalog   │
        │ Branding  │     │ Branding  │     │ Branding  │
        │ Orders    │     │ Orders    │     │ Orders    │
        └───────────┘     └───────────┘     └───────────┘
```

Tenant-specific configuration includes:

* Branding
* Color palettes
* Product catalog
* Product characteristics
* Materials
* Categories
* Orders
* Business configuration

The goal is to allow multiple furniture businesses to use the same platform without sacrificing an independent brand experience.

---

# 🚀 Core Features

## 1. Identity & Authentication

T.Fundi provides role-aware authentication and authorization.

The platform supports different levels of access across the ecosystem, including:

* Customers
* Tenant users
* Workshop users
* Platform administrators

Authentication is designed around secure token-based sessions and protected application routes.

---

## 2. Digital Furniture Catalog

The catalog is the foundation of the platform.

Businesses can create and manage furniture products with information such as:

* Product name
* Description
* Category
* Images
* Materials
* Colors
* Dimensions
* Characteristics
* Pricing
* Product status
* Customization options

The catalog is designed to support different furniture businesses without forcing every tenant into the same product structure.

---

## 3. Product Visualization

Furniture is highly visual, so T.Fundi treats product visualization as a first-class feature.

The platform is being designed to support:

* High-quality product imagery
* Multiple product images
* 360° product views
* Interactive product viewing
* 3D furniture models
* Material visualization
* Color customization

The long-term goal is to make browsing furniture feel closer to interacting with a physical showroom.

---

# 🤖 AI Studio

AI Studio is one of T.Fundi's key differentiators.

It allows customers to interact with furniture beyond simply viewing a product image.

### AI Product Analysis

Product images can be analyzed to help identify relevant product information and characteristics.

The analysis pipeline is intended to support product creation and enrichment.

### AI Color Matching

Customers can provide a reference image or color inspiration.

T.Fundi can analyze the reference and help identify a suitable furniture color or material.

Conceptually:

```text
Reference Image
       │
       ▼
   AI Analysis
       │
       ▼
Color / Material
   Identification
       │
       ▼
Product Customization
```

### AI Room Visualization

Customers can upload a photo of their room and visualize how a furniture item could look within the space.

```text
Customer Room Photo
        +
Furniture Product
        │
        ▼
     AI Studio
        │
        ▼
Visualized Room
```

This is intended to reduce uncertainty before purchase.

---

# 🛋️ Furniture Customization

Furniture should not always be one-size-fits-all.

T.Fundi supports configurable product options such as:

* Materials
* Colors
* Finishes
* Dimensions
* Other tenant-defined characteristics

The product data model is designed to allow tenants to define characteristics appropriate to their furniture catalog.

---

# 🛒 Commerce

T.Fundi provides the foundation for a complete furniture purchasing journey.

The commerce layer includes:

* Product discovery
* Product details
* Cart
* Checkout
* Orders
* Order status
* Order tracking

The platform is intended to eventually support the complete journey:

```text
Discover
   ↓
Explore
   ↓
Customize
   ↓
Visualize
   ↓
Add to Cart
   ↓
Checkout
   ↓
Order
   ↓
Production
   ↓
Delivery
```

---

# 🔨 Workshop

Furniture is not just sold — it is often made.

The Workshop module connects the digital order experience with furniture production.

The broader vision includes:

* Production orders
* Workshop workflows
* Order preparation
* Production status
* Manufacturing coordination
* Completion tracking

This creates a connection between:

**Customer → Storefront → Order → Workshop → Delivery**

---

# 🛠️ Admin Platform

T.Fundi contains administrative functionality for managing the platform and individual tenants.

Administrative capabilities include areas such as:

### Platform Management

* Tenant management
* Platform users
* Roles and permissions
* Platform configuration

### Tenant Management

* Tenant branding
* Theme configuration
* Catalog configuration
* Product management
* Characteristics
* Business settings

### Branding

Tenants can configure their visual identity through configurable themes and palettes.

The goal is to make the storefront dynamically adapt to each tenant rather than relying on hardcoded colors.

---

# 🎨 Design System

The frontend is designed around reusable components and tenant-aware theming.

Rather than hardcoding brand colors throughout the application, the UI can resolve colors from tenant configuration.

Conceptually:

```text
Tenant
  │
  ▼
Theme Configuration
  │
  ├── Primary
  ├── Secondary
  ├── Accent
  ├── Background
  └── Text
        │
        ▼
   Application UI
```

This allows the same application infrastructure to power multiple branded storefronts.

---

# 💻 Technology Stack

The project is built using a modern TypeScript-based web stack.

### Frontend

* React
* TypeScript
* Vite
* React Router
* Tailwind CSS
* Material UI
* React Three Fiber / Three.js

### Backend & APIs

The platform architecture integrates API-driven services and is designed to work with technologies including:

* Node.js
* Express
* Python
* Django / Django REST Framework

### Data

* PostgreSQL
* Prisma
* PostGIS where geospatial functionality is required

### Infrastructure

* Docker
* Kubernetes
* CI/CD
* Cloud deployment infrastructure

### AI & Visualization

* AI product analysis
* AI image/color analysis
* AI room visualization
* Three.js / React Three Fiber
* 3D product assets

---

# 📁 Repository Structure

The repository follows a monorepo-style architecture.

A simplified view:

```text
t.fundi/
│
├── apps/
│   ├── web/
│   │   └── src/
│   │       ├── assets/
│   │       ├── components/
│   │       ├── pages/
│   │       ├── routes/
│   │       ├── services/
│   │       ├── providers/
│   │       └── types/
│   │
│   └── ...
│
├── packages/
│   └── ...
│
├── prisma/
│   └── schema.prisma
│
├── docker/
│   └── ...
│
└── README.md
```

> The exact structure may evolve as the platform grows.

---

# 🔐 Security & Access Control

T.Fundi is designed with role-based access control in mind.

Protected application areas require authentication and authorization.

The application separates:

* Public storefront experiences
* Authenticated customer experiences
* Tenant administration
* Platform administration

This ensures that tenant-specific data and administrative functionality are not exposed to unauthorized users.

---

# 🧩 Product Architecture Principles

T.Fundi is being developed around several core principles.

### Multi-tenancy first

The platform should support multiple businesses without duplicating the application.

### Configuration over hardcoding

Tenant-specific information such as branding, characteristics, and catalog configuration should be data-driven.

### Reusable components

Shared UI and business logic should be reusable across different areas of the application.

### API-driven architecture

Frontend functionality should communicate through well-defined services rather than tightly coupling UI components to backend implementation details.

### Progressive enhancement

Core commerce functionality should remain useful even when advanced AI or 3D functionality is unavailable.

### Visual-first commerce

Furniture is a visual product category, so visualization is treated as part of the buying experience rather than an optional extra.

---

# 🗺️ Product Roadmap

T.Fundi is being developed incrementally.

## Release 1.0

### Identity

* Authentication
* Authorization
* User roles
* Protected routes

### Catalog

* Product creation
* Product management
* Categories
* Materials
* Characteristics
* Images
* Pricing
* Tenant-specific catalog configuration

### AI Studio

* Product analysis
* Color/material matching
* Product customization
* Room photo upload
* AI room visualization

### Commerce

* Product discovery
* Product details
* Cart
* Checkout
* Orders
* Order tracking

### Workshop

* Production workflow
* Workshop order management

### Administration

* Tenant management
* Branding
* Platform administration
* Catalog administration

---

# 🧪 Development Status

T.Fundi is an actively developed product.

Some functionality is production-oriented while other areas are still being developed, refined, or replaced as the architecture evolves.

Current development focuses heavily on:

* Robust catalog functionality
* Tenant-aware product configuration
* Persistent product characteristics
* Authentication/session persistence
* Product visualization
* AI-powered product analysis
* 3D experiences
* Commerce workflows
* Multi-tenant architecture

---

# 🏃 Getting Started

## Prerequisites

Make sure you have the following installed:

* Node.js
* npm or another Node package manager
* PostgreSQL
* Git
* Docker *(recommended for local infrastructure)*

---

## Clone the repository

```bash
git clone <repository-url>

cd t.fundi
```

---

## Install dependencies

```bash
npm install
```

---

## Environment Variables

Create the appropriate environment files for your environment.

Example:

```env
DATABASE_URL=
JWT_SECRET=
API_URL=
```

Additional variables may be required for:

* AI services
* Storage
* Authentication
* Payments
* Maps
* 3D assets



## Database

If using Prisma:

```bash
npx prisma generate
```

Apply the development schema:

```bash
npx prisma migrate dev
```

---

## Start the application

For the web application:

```bash
npm run dev
```

The development server will start using the Vite configuration.

---

# 🧑‍💻 Development Workflow

A typical feature workflow is:

```text
Issue / Requirement
        ↓
Architecture
        ↓
Types / Data Model
        ↓
Backend / API
        ↓
Service Layer
        ↓
UI Components
        ↓
Integration
        ↓
Validation
        ↓
Testing
        ↓
Commit
        ↓
Pull Request
```

Changes should be kept focused and avoid unnecessarily coupling unrelated features.

---

# 🧱 Engineering Standards

When contributing to T.Fundi:

### Prefer typed interfaces

Use TypeScript types for API responses, product models, tenant configuration, and component contracts.

### Keep business logic out of presentation components

Prefer service functions and reusable hooks where appropriate.

### Validate before navigation

Failed operations should not navigate the user away from the current workflow.

For example:

```text
Create Product
     │
     ▼
Validation
     │
 ┌───┴────┐
 │        │
Fail     Pass
 │        │
 ▼        ▼
Toast   Persist
 │        │
Stay     Navigate
```

### Persist the source of truth

UI state should reflect persisted backend data rather than relying on temporary mock objects.

### Handle errors explicitly

API failures should produce useful user feedback and leave the application in a consistent state.

---

# 🌱 Contributing

Contributions should follow the project's architecture and coding conventions.

Before opening a pull request:

1. Understand the affected feature.
2. Check existing types and services.
3. Avoid duplicating existing functionality.
4. Validate the feature end-to-end.
5. Run the production build.
6. Check for TypeScript errors.
7. Verify that existing functionality has not regressed.
8. Write a clear commit message.

---

# 📌 Project Philosophy

T.Fundi is more than an online furniture store.

The long-term vision is to build a platform where:

> **Furniture businesses can digitize their storefronts, customers can confidently visualize what they are buying, and workshops can connect directly to the orders those customers create.**

The platform sits at the intersection of:

**Furniture + Commerce + AI + Visualization + Manufacturing**

```text
                 ┌─────────────┐
                 │   CUSTOMER  │
                 └──────┬──────┘
                        │
                        ▼
                 ┌─────────────┐
                 │   T.FUNDI   │
                 └──────┬──────┘
                        │
        ┌───────────────┼────────────────┐
        ▼               ▼                ▼
    CATALOG          AI STUDIO        COMMERCE
        │               │                │
        │          Visualization         │
        │          Customization         │
        │          Color Matching        │
        │               │                │
        └───────────────┼────────────────┘
                        │
                        ▼
                   ┌─────────┐
                   │ WORKSHOP│
                   └────┬────┘
                        │
                        ▼
                    PRODUCTION
                        │
                        ▼
                     DELIVERY
```

---

# 📜 License

This project is currently maintained as a proprietary product.

License information will be added as the project licensing strategy is finalized.

---

# 🚧 Status

**T.Fundi is actively under development.**

The architecture, product model, APIs, UI, AI capabilities, and infrastructure may continue to evolve as the platform moves toward production.

---

### Built with ambition for the future of furniture commerce.

**T.Fundi — See it. Customize it. Make it yours.**
