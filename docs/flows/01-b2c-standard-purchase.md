# User Flow 1 — B2C Standard Purchase

```mermaid
flowchart TD
    A[Homepage] --> B{Discovery}
    B --> C[Search]
    B --> D[Browse Category]
    C --> E[PLP - Product Listing Page]
    D --> E
    E --> F[PDP - Product Detail Page]
    F --> G[Add to Cart]
    G --> H[Cart Review]
    H --> I{Authenticated?}
    I -->|No| J[Guest Checkout / Login]
    I -->|Yes| K[Checkout]
    J --> K
    K --> L[Address Entry]
    L --> M[GSTIN Optional]
    M --> N[Payment - Razorpay]
    N --> O{Payment Success?}
    O -->|Yes| P[Order Confirmation]
    O -->|No| Q[Payment Failed - Retry]
    Q --> N
    P --> R[Order Tracking]
    R --> S[Delivered]
```

## Steps

1. Homepage → Search / Browse Category
2. PLP (Product Listing Page)
3. PDP (Product Detail Page)
4. Add to Cart
5. Cart Review
6. Guest/Login Checkout
7. Address + GSTIN (optional)
8. Payment
9. Order Confirmation
10. Order Tracking
