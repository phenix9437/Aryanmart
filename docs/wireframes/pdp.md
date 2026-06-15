# Product Detail Page (PDP) Wireframe

**Route:** `/product/[slug]`

---

## Above the Fold — Desktop (55% image / 45% buy box)

### Left — Image Gallery
- Main image (zoom on hover)
- Thumbnail strip (max 6 + video play if available)
- "360 View" badge when available
- Watermark: "AryanMart Authorized"

### Right — Product Buy Box
- Brand logo + "Authorized Dealer" badge
- Product Name (H1, text-heading-xl)
- SKU + HSN Code (mono, copyable)
- Rating stars + review count + "Ask a Question" link
- Trust badges: BIS | GeM | Make in India | ISO 9001

#### Price Section
- MRP strikethrough | Your Price + GST @18%
- Toggle: Show with GST / Show without GST
- B2B tiers: "10+: ₹920 | 50+: ₹880 | 100+: ₹840"
- Savings badge: "Save 21%"

#### Availability
- StockIndicator component
- "Ships within 2 business days from Delhi warehouse"
- "Express delivery available for Delhi NCR"

#### Actions
- QuantitySelector (MOQ for B2B)
- [Add to Cart] primary full-width
- [Buy Now] secondary
- [Request Bulk Quote] outlined accent
- [Add to Wishlist] icon button

#### Delivery & Services
- Pincode check input
- Icons: Free Shipping ₹5000+ | Secure Packaging | Easy Returns 7 days | GST Invoice

---

## Below the Fold — Tabbed Section

| Tab | Content |
|-----|---------|
| Specifications | SpecTable — downloadable PDF |
| Description | Rich text |
| Downloads | Data sheet, compliance cert, install guide |
| Reviews | Rating breakdown + verified reviews |
| Q&A | Community Q&A |

---

## Related Products

- Frequently Bought Together
- Similar Products (same category, different brands)
- Customers Also Viewed

---

## Mobile Layout

Stacked: image gallery → buy box → tabs → related products  
Sticky bottom bar: Add to Cart + RFQ (tablet/mobile)
