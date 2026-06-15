# RFQ Submission Flow Wireframe

**Route:** `/rfq`  
**Format:** 3-step form with progress indicator

---

## Step 1 — Product Requirements

- Add products via search (name, SKU) or free-text description
- Per item fields:
  - Product name
  - Quantity
  - Unit
  - Specs / Notes
- "Add Another Item" for multi-product RFQs
- **Optional:** Upload existing BOQ / Excel file
- **Next** button → Step 2

---

## Step 2 — Delivery & Business Details

| Field | Type |
|-------|------|
| Delivery location | Pincode + State |
| Required by date | Date picker |
| GSTIN | GSTINInput with company auto-fill |
| Contact name | Text |
| Email | Email |
| Phone | Tel |
| Designation | Text |
| Additional notes | Textarea |

- **Back** | **Next** buttons

---

## Step 3 — Review & Submit

- Full summary: all items, delivery, contact details
- Message: "Expected response within 2 business hours"
- **[Submit RFQ]** primary button

---

## Post-Submit Success Screen

- RFQ ID displayed prominently
- Email/SMS confirmation message
- Track link: `/rfq/track/[id]`
- CTAs: Track RFQ | Continue Shopping

---

## RFQ Tracker — `/rfq/track/[id]`

- Status timeline: Submitted → Under Review → Quoted → Accepted/Rejected
- Quote details when available
- Accept / Negotiate / Reject actions

---

## Mobile

- Single column form
- Sticky "Submit" on final step
- FAB "Get Quote" on PDP links here with pre-filled product
