# CartItem

## Purpose
Line item in cart page and mini-cart drawer.

## Props
| Prop | Type | Description |
|------|------|-------------|
| `item` | CartLineItem | Product variant, qty, price |
| `onQuantityChange` | function | Qty update |
| `onRemove` | function | Remove item |

## Display
- Product image, name, SKU (mono), unit price, quantity selector, line total
- MOQ warning for B2B items

## Accessibility
- Remove button labeled "Remove [product name] from cart"
