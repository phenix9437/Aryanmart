import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/lib/data/catalog';

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  sku: string;
  image: string;
  price: number;
  gstRate: number;
  quantity: number;
  moq: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
  totalGst: () => number;
  grandTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                slug: product.slug,
                name: product.name,
                sku: product.sku,
                image: product.image,
                price: product.price,
                gstRate: product.gstRate,
                quantity,
                moq: product.moq,
              },
            ],
          };
        });
      },

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.max(i.moq, quantity) }
              : i
          ),
        })),

      clearCart: () => set({ items: [] }),

      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      totalGst: () =>
        get().items.reduce(
          (sum, i) =>
            sum +
            Math.round(i.price * i.quantity * (i.gstRate / 100) * 100) / 100,
          0
        ),

      grandTotal: () => {
        const store = get();
        return (
          Math.round((store.subtotal() + store.totalGst()) * 100) / 100
        );
      },
    }),
    { name: 'aryanmart-cart' }
  )
);
