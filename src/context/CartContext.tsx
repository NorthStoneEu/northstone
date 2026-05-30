"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";

// ── Type d'une ligne du panier ──
export type CartItem = {
  productId: number;
  slug: string;
  gender: "homme" | "femme";
  name: string;
  price: number;
  color: string;
  size: string;
  image: string;
  quantity: number;
};

// ── Ce que le contexte expose ──
type CartContextType = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: number, color: string, size: string) => void;
  updateQuantity: (
    productId: number,
    color: string,
    size: string,
    quantity: number
  ) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "northstone_cart";

// Clé unique d'une ligne : un même produit en taille/couleur différente = 2 lignes
function lineKey(productId: number, color: string, size: string) {
  return `${productId}-${color}-${size}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // ── Au montage : on recharge le panier depuis localStorage ──
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch (e) {
      console.error("Erreur lecture panier localStorage:", e);
    }
    setHydrated(true);
  }, []);

  // ── À chaque changement : on sauvegarde (sauf avant l'hydratation) ──
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Erreur écriture panier localStorage:", e);
    }
  }, [items, hydrated]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  // ── Ajouter un article (ou incrémenter si déjà présent) ──
  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) => {
      setItems((prev) => {
        const key = lineKey(item.productId, item.color, item.size);
        const existing = prev.find(
          (i) => lineKey(i.productId, i.color, i.size) === key
        );
        if (existing) {
          return prev.map((i) =>
            lineKey(i.productId, i.color, i.size) === key
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }
        return [...prev, { ...item, quantity }];
      });
    },
    []
  );

  // ── Supprimer une ligne ──
  const removeItem = useCallback(
    (productId: number, color: string, size: string) => {
      const key = lineKey(productId, color, size);
      setItems((prev) =>
        prev.filter((i) => lineKey(i.productId, i.color, i.size) !== key)
      );
    },
    []
  );

  // ── Modifier la quantité (si <= 0 on supprime la ligne) ──
  const updateQuantity = useCallback(
    (productId: number, color: string, size: string, quantity: number) => {
      const key = lineKey(productId, color, size);
      setItems((prev) => {
        if (quantity <= 0) {
          return prev.filter(
            (i) => lineKey(i.productId, i.color, i.size) !== key
          );
        }
        return prev.map((i) =>
          lineKey(i.productId, i.color, i.size) === key
            ? { ...i, quantity }
            : i
        );
      });
    },
    []
  );

  const clearCart = useCallback(() => setItems([]), []);

  // ── Calculs dérivés ──
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        isOpen,
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ── Hook pour consommer le panier partout ──
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart doit être utilisé à l'intérieur d'un CartProvider");
  }
  return ctx;
}