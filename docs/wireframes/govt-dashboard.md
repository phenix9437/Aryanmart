# Government Procurement Dashboard Wireframe

**Route:** `/account/tenders`  
**Role:** Government (`govt`) authenticated users only

---

## Layout

Account sidebar (govt variant) + main content area

---

## Active Tenders Section

- List of uploaded tender documents
- Matched AryanMart products per tender
- Status badges: Draft | Active | Submitted | Awarded | Closed
- Actions: View match | Download compliance | Submit quote

---

## Rate Contract Status

- Active contracts table
- Expiry dates with warning badges (< 30 days)
- Remaining quantities per line item
- Renew / extend CTA

---

## GeM Orders

- Orders placed via GeM integration (or manual GeM reference)
- Shipment tracking links
- Invoice download

---

## Compliance Documents

- Bulk download BIS certs, test reports, IS standard compliance
- Filter by product or certification type
- PDF preview inline

---

## Vendor Performance (Evaluation Support)

- Delivery timeline reports
- Quality reports for tender evaluation submissions
- Export PDF for authority submission

---

## Dedicated Govt Sales Manager

- Click-to-call button
- WhatsApp CTA
- Email link
- Manager name + photo + availability hours

---

## Tender Detail Integration

Links to `/tender/[id]` for full product matching workflow.

See [User Flow 4](../flows/04-government-tender-flow.md).
