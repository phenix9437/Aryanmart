# User Flow 3 — RFQ (Request for Quotation)

```mermaid
flowchart TD
    A[Homepage / Any Page] --> B[Request a Quote CTA]
    B --> C[RFQ Form - Step 1: Products]
    C --> D[Add Items - Name, Qty, Specs]
    D --> E{More Items?}
    E -->|Yes| D
    E -->|No| F[Step 2: Delivery & Business]
    F --> G[GSTIN + Contact Details]
    G --> H[Step 3: Review & Submit]
    H --> I[Submit RFQ]
    I --> J[RFQ ID Assigned]
    J --> K[Email/SMS Confirmation]
    K --> L[Sales Dashboard Notification]
    L --> M[Sales Team Quotes Back]
    M --> N{Customer Response}
    N -->|Accept| O[Convert to Order]
    N -->|Negotiate| P[Negotiation Loop]
    P --> M
    N -->|Reject| Q[RFQ Closed]
    O --> R[Order Fulfillment]
```

## Steps

1. Homepage / Any Page → 'Request a Quote' CTA
2. RFQ Form (Product, Qty, Specs, Delivery Location, Required By Date, GSTIN, Contact)
3. Submission
4. Internal Sales Dashboard Notification
5. Sales Team Quotes Back
6. Customer Accepts / Negotiates
7. Convert to Order
