# T.Fundi — Success Metrics

| Field        | Value            |
| ------------ | ---------------- |
| Document     | Success Metrics  |
| Product      | T.Fundi          |
| Version      | 1.0.0            |
| Status       | Draft            |
| Owner        | Patricia Njoroge |
| Last Updated | 2026-08-09       |

---

# 1. Purpose

This document defines how T.Fundi will measure product, business, customer, and engineering success.

The metrics are intended to:

* Validate the product vision.
* Measure adoption and engagement.
* Evaluate the effectiveness of AI-powered experiences.
* Measure commerce performance.
* Monitor furniture business operations.
* Track platform reliability and engineering quality.
* Support future product and architecture decisions.

Metrics should be introduced progressively as the platform develops.

Sprint 0 defines the measurement framework. Actual targets may be refined once real usage data becomes available.

---

# 2. Measurement Principles

T.Fundi will follow these principles when defining and interpreting metrics.

## 2.1 Outcome Over Activity

Metrics should measure meaningful outcomes rather than simply counting features.

For example:

```text
Weak:
Number of AI visualizations generated

Better:
Percentage of users who generate a visualization and continue toward a purchase
```

---

## 2.2 User Value

Metrics should indicate whether T.Fundi is helping users accomplish their goals.

Examples include:

* Successful furniture discovery
* Successful customization
* Visualization usage
* Design completion
* Purchase completion
* Order tracking engagement

---

## 2.3 Business Value

Metrics should demonstrate value to furniture businesses operating on T.Fundi.

Examples include:

* Active businesses
* Orders processed
* Revenue
* Customer retention
* Production visibility
* Operational efficiency

---

## 2.4 Technical Quality

Product growth should not come at the expense of system reliability or security.

Engineering metrics should therefore be monitored alongside product metrics.

---

# 3. North Star Outcome

The primary product outcome for T.Fundi is:

> **Enable users to confidently discover, visualize, customize, purchase, and receive furniture through a digital furniture experience.**

The platform should increasingly connect this customer journey with the operational workflow of furniture businesses.

Conceptually:

```text
Discover
   ↓
Customize
   ↓
Visualize
   ↓
Purchase
   ↓
Production
   ↓
Delivery
   ↓
Satisfied Customer
```

---

# 4. Business Metrics

## 4.1 Active Furniture Businesses

Measures the number of furniture businesses actively operating on T.Fundi.

### Measurement

A business is considered active when it performs meaningful platform activity within the measurement period.

Potential qualifying activity:

* Product management
* Order processing
* Workshop activity
* Customer interaction
* Dashboard activity

### Metric

```text
Monthly Active Businesses
```

---

## 4.2 Business Activation

Measures how effectively a newly onboarded furniture business reaches meaningful platform usage.

Potential activation sequence:

```text
Tenant Created
   ↓
Store Configured
   ↓
Product Added
   ↓
Product Published
   ↓
First Customer Interaction
   ↓
First Order
```

### Metric

```text
Business Activation Rate
=
Activated Businesses
/
New Businesses
× 100
```

---

## 4.3 Monthly Orders

Measures the number of orders processed through T.Fundi.

### Metrics

```text
Orders per Month
Orders per Active Business
Orders by Product Category
```

---

## 4.4 Revenue

Measures transaction value generated through the platform.

Potential metrics:

```text
Gross Order Value
Revenue per Business
Average Order Value
Monthly Revenue
```

Financial definitions and accounting treatment will be refined when the payment architecture is implemented.

---

## 4.5 Customer Retention

Measures whether customers return to the platform.

Potential indicators:

* Repeat purchases
* Returning customers
* Saved designs revisited
* Repeat visualization activity

### Metric

```text
Customer Retention Rate
```

The exact retention window will be defined when sufficient customer data exists.

---

# 5. Customer Metrics

## 5.1 Product Discovery

Measures whether users successfully find furniture they are interested in.

Potential metrics:

```text
Catalog Sessions
Product Views
Search Usage
Filter Usage
Product Detail Engagement
```

---

## 5.2 Customization Usage

Measures how frequently users customize furniture.

### Metric

```text
Customization Rate
=
Sessions with Customization
/
Product Sessions
× 100
```

Customization includes:

* Color selection
* Material selection
* Configuration changes
* 3D interaction

---

## 5.3 AI Feature Usage

T.Fundi provides two major AI experiences in Release 1.0:

* AI color matching
* AI room visualization

### Metrics

```text
AI Color Matching Usage
AI Room Visualization Usage
AI Feature Completion Rate
AI Regeneration Rate
```

---

## 5.4 AI Visualization Completion

Measures how often users successfully complete an AI visualization request.

```text
Visualization Completion Rate
=
Successful Visualizations
/
Visualization Requests
× 100
```

Failures should be categorized where possible.

Examples:

* Invalid image
* Processing failure
* Provider failure
* Timeout
* User cancellation

---

## 5.5 Visualization-to-Purchase Conversion

Measures whether visualization contributes to purchasing confidence.

```text
Visualization Purchase Conversion
=
Purchases Following Visualization
/
Completed Visualizations
× 100
```

The attribution window will be defined when analytics implementation begins.

---

## 5.6 Checkout Conversion

Measures the percentage of users who begin checkout and successfully complete an order.

```text
Checkout Conversion
=
Completed Orders
/
Checkout Sessions
× 100
```

---

## 5.7 Order Completion

Measures the percentage of confirmed orders successfully delivered.

```text
Order Completion Rate
=
Delivered Orders
/
Confirmed Orders
× 100
```

---

# 6. Interior Designer Metrics

Interior designers represent a professional user segment and may influence purchases without being the purchaser.

Metrics should therefore distinguish between:

```text
Designer
   ↓
Creates Design
   ↓
Shares Design
   ↓
Client Reviews
   ↓
Client Purchases
```

and:

```text
Designer
   ↓
Creates Design
   ↓
Purchases Directly
```

Potential metrics include:

* Active designers
* Designs created
* Designs shared
* Design approval rate
* Designer-initiated purchases
* Client purchases originating from designer designs
* Average designs per designer

---

# 7. Furniture Business Operational Metrics

## 7.1 Order Processing Time

Measures the time between order creation and acceptance for production.

```text
Order Processing Time
=
Production Acceptance
-
Order Creation
```

---

## 7.2 Production Cycle Time

Measures the time required to manufacture an order.

```text
Production Cycle Time
=
Production Completion
-
Production Start
```

---

## 7.3 Quality Failure Rate

Measures how frequently completed production fails quality control.

```text
Quality Failure Rate
=
Failed Quality Checks
/
Completed Quality Checks
× 100
```

---

## 7.4 Rework Rate

Measures how frequently production requires rework.

```text
Rework Rate
=
Orders Requiring Rework
/
Production Orders
× 100
```

---

## 7.5 On-Time Delivery

Measures whether furniture is delivered within the expected delivery window.

```text
On-Time Delivery Rate
=
Orders Delivered On Time
/
Delivered Orders
× 100
```

---

# 8. Platform Metrics

## 8.1 Tenant Growth

Measures growth of the T.Fundi platform.

```text
New Tenants
Active Tenants
Suspended Tenants
Archived Tenants
```

---

## 8.2 Tenant Isolation

Tenant isolation is a critical security property rather than a conventional growth metric.

The platform should track:

```text
Cross-Tenant Authorization Violations
Cross-Tenant Access Attempts
Authorization Failures
```

The desired value for confirmed cross-tenant access is:

```text
0
```

---

## 8.3 Platform Availability

Measures the availability of core T.Fundi services.

```text
Availability
=
Successful Service Time
/
Total Service Time
× 100
```

Targets will be defined after infrastructure requirements are finalized.

---

# 9. Engineering Metrics

## 9.1 Deployment Frequency

Measures how frequently changes are successfully deployed.

```text
Deployments per Week
Deployments per Month
```

---

## 9.2 Deployment Success Rate

```text
Successful Deployments
/
Total Deployment Attempts
× 100
```

---

## 9.3 API Latency

Measures the response time of APIs.

Important measurements include:

```text
Average Latency
P50
P95
P99
```

Performance targets will be established during implementation.

---

## 9.4 Error Rate

Measures failed requests and application errors.

```text
Error Rate
=
Failed Requests
/
Total Requests
× 100
```

Errors should be categorized by domain where possible.

---

## 9.5 Test Coverage

Measures automated test coverage.

Potential measurements include:

* Unit test coverage
* Integration test coverage
* API coverage
* Critical workflow coverage

Coverage should not be treated as the sole indicator of test quality.

---

## 9.6 Mean Time to Recovery

Measures how quickly production incidents are resolved.

```text
MTTR
=
Total Recovery Time
/
Number of Incidents
```

This metric will become increasingly important as production usage grows.

---

# 10. AI Metrics

AI functionality introduces additional operational metrics.

## 10.1 AI Success Rate

```text
Successful AI Jobs
/
Total AI Jobs
× 100
```

---

## 10.2 AI Processing Time

Measure:

```text
Average Processing Time
P95 Processing Time
```

---

## 10.3 AI Cost

Track:

```text
Cost per AI Operation
Cost per Visualization
Cost per Active User
Monthly AI Spend
```

This is particularly important because AI inference cost is identified as a product risk.

---

## 10.4 AI Regeneration Rate

Measures how often users request another AI result.

A high regeneration rate may indicate:

* Poor output quality
* Incorrect visualization
* User experimentation
* Lack of confidence

This metric should therefore be interpreted alongside qualitative feedback.

---

# 11. Security Metrics

Security metrics should be monitored continuously.

Important indicators include:

```text
Authentication Failures
Authorization Failures
Cross-Tenant Access Attempts
Privilege Escalation Attempts
Suspicious Activity
Security Incidents
```

Critical security violations should trigger appropriate alerts and audit records.

---

# 12. Metric Ownership

Metrics should eventually have clear ownership.

| Metric Area         | Primary Owner          |
| ------------------- | ---------------------- |
| Product             | Product Owner          |
| Customer Experience | Product / Design       |
| Business            | Business / Product     |
| Tenant Operations   | Platform / Product     |
| Production          | Furniture Business     |
| Engineering         | Engineering            |
| Reliability         | Engineering / DevOps   |
| Security            | Engineering / Security |
| AI                  | Engineering / Product  |

Exact organizational ownership may change as T.Fundi grows.

---

# 13. Measurement Lifecycle

Metrics should evolve as the platform matures.

```text
Define
  ↓
Instrument
  ↓
Collect
  ↓
Validate
  ↓
Analyze
  ↓
Act
  ↓
Review
```

Metrics should not be added solely because they are technically easy to collect.

Each important metric should answer:

> What decision will this metric help us make?

---

# 14. Release 1.0 Priority Metrics

For the initial release, T.Fundi should prioritize a smaller set of metrics.

### Product

* Active users
* Product views
* Customization rate
* AI visualization usage
* AI color matching usage

### Commerce

* Checkout conversion
* Completed orders
* Average order value

### Business

* Active furniture businesses
* Orders per business
* Business activation

### Operations

* Production cycle time
* Quality failure rate
* Rework rate
* On-time delivery

### Engineering

* API latency
* Error rate
* Availability
* Deployment frequency
* Deployment success rate
* Critical workflow test coverage

### Security

* Cross-tenant authorization violations
* Security incidents
* Authorization failures

---

# 15. Initial Success Criteria

T.Fundi's early success should be evaluated using the following outcomes:

1. Furniture businesses can successfully operate their storefronts.
2. Customers can discover and customize furniture.
3. Authenticated users can successfully use AI color matching.
4. Authenticated users can successfully use AI room visualization.
5. Customers can complete purchases.
6. Businesses can process orders through production.
7. Customers can receive production and delivery updates.
8. Interior designers can create and share designs or purchase directly.
9. Tenant data remains isolated.
10. Core platform workflows remain reliable.

---

# 16. Metric Maturity

Metrics will mature in stages.

### Stage 1 — Instrumentation

Ensure important events can be captured.

### Stage 2 — Baselines

Collect real usage data and establish baseline values.

### Stage 3 — Targets

Define realistic targets based on observed performance.

### Stage 4 — Optimization

Use metrics to improve product, business, and engineering outcomes.

T.Fundi should avoid establishing arbitrary targets before sufficient real-world data exists.

---

# 17. Related Documents

* `PRODUCT_VISION.md`
* `PRODUCT_REQUIREMENTS.md`
* `USER_PERSONAS.md`
* `USER_JOURNEYS.md`
* `ROADMAP.md`
* `MULTI_TENANCY.md`
* `SYSTEM_ARCHITECTURE.md`
* `SECURITY.md`
* `DATABASE_DESIGN.md`

---

# 18. Document Status

This document establishes the initial measurement framework for T.Fundi.

It is intentionally designed to evolve as the platform moves from architecture and validation into implementation and production.

New metrics or major changes to measurement definitions should be reviewed alongside the relevant product, architecture, or engineering documentation.
