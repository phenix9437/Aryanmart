# User Flow 2 — B2B Wholesale Order

```mermaid
flowchart TD
    A[Login - B2B Account] --> B[Wholesale Dashboard]
    B --> C[Browse Catalog]
    C --> D[B2B Pricing Visible]
    D --> E[Select Product]
    E --> F[Bulk Quantity Selector]
    F --> G{MOQ Valid?}
    G -->|No| H[Show MOQ Error]
    H --> F
    G -->|Yes| I[Add to Cart]
    I --> J[B2B Checkout]
    J --> K[PO Number Entry]
    K --> L[Credit Terms Selection]
    L --> M{Order > Approval Threshold?}
    M -->|Yes| N[Approval Workflow]
    N --> O{Approved?}
    O -->|No| P[Order Rejected / Revise]
    O -->|Yes| Q[Order Confirmed]
    M -->|No| Q
    Q --> R[Dispatch]
    R --> S[Tracking]
    S --> T[Delivery + GST Invoice]
```

## Steps

1. Login (B2B Account)
2. Wholesale Dashboard
3. Browse with B2B Pricing Visible
4. Bulk Quantity Selector
5. MOQ Validation
6. Add to Cart
7. B2B Checkout (PO Number, Credit Terms)
8. Approval Workflow (if order > threshold)
9. Dispatch & Tracking
