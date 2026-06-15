# User Flow 4 — Government Tender Flow

```mermaid
flowchart TD
    A[Govt Login] --> B[Tender Dashboard]
    B --> C{Action}
    C --> D[Browse Active Tenders]
    C --> E[Upload Tender Doc]
    D --> F[Select Tender]
    E --> F
    F --> G[Match Products to Requirements]
    G --> H[Review Matched Products]
    H --> I[Download Compliance Sheet]
    I --> J[BIS / ISI / IS Certifications]
    J --> K[Request Rate Contract Quote]
    K --> L{Submission Method}
    L --> M[Submit via Portal]
    L --> N[Submit via Email]
    M --> O[Track Tender Status]
    N --> O
    O --> P{Outcome}
    P -->|Awarded| Q[Convert to Supply Order]
    P -->|Lost| R[Archive Tender]
    P -->|Pending| O
    Q --> S[Fulfillment + Compliance Docs]
```

## Steps

1. Govt Login
2. Tender Dashboard
3. Browse Active Tenders / Upload Tender Doc
4. Match Products to Tender Requirements
5. Download Product Compliance Sheet (BIS, ISI, IS Certification)
6. Request Rate Contract Quote
7. Submit via Portal / Email
8. Track Tender Status
