# User Flow 5 — Vendor/Supplier Onboarding

```mermaid
flowchart TD
    A[Vendor Registration] --> B[Business Details Form]
    B --> C[Document Upload]
    C --> D[GST Certificate]
    C --> E[PAN]
    C --> F[Trade License]
    C --> G[ISO Certificate - Optional]
    D --> H[Submit Application]
    E --> H
    F --> H
    G --> H
    H --> I[Admin Review Queue]
    I --> J{Approval Decision}
    J -->|Rejected| K[Notify Vendor - Resubmit]
    K --> C
    J -->|Approved| L[Product Listing Access]
    L --> M[Inventory Management]
    M --> N[Order Fulfillment Dashboard]
    N --> O[Receive Orders]
    O --> P[Ship + Update Status]
    P --> Q[Commission Settlement]
    Q --> R[Periodic Payout]
```

## Steps

1. Vendor Registration
2. Document Upload (GST Cert, PAN, Trade License, ISO if applicable)
3. Admin Approval
4. Product Listing Access
5. Inventory Management
6. Order Fulfillment Dashboard
7. Commission Settlement
