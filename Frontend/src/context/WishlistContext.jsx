import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchWishlist, toggleWishlist as apiToggleWishlist, removeWishlistItem as apiRemoveWishlistItem } from "@/services/wishlistService";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const token = useMemo(() => localStorage.getItem("token"), []);
  const [wishedIds, setWishedIds] = useState(() => new Set());
  const [count, setCount] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  const rebuildFromItems = useCallback((items) => {
    const ids = new Set((items || []).map((p) => String(p?._id)).filter(Boolean));
    setWishedIds(ids);
    setCount(ids.size);
  }, []);

  const refresh = useCallback(async () => {
    const t = localStorage.getItem("token");
    if (!t) {
      setWishedIds(new Set());
      setCount(0);
      setHydrated(true);
      return;
    }

    const data = await fetchWishlist(t);
    rebuildFromItems(data?.items || []);
    setHydrated(true);
  }, [rebuildFromItems]);

  useEffect(() => {
    // hydrate once on mount
    refresh().catch(() => setHydrated(true));
  }, [refresh]);

  const isWished = useCallback((productId) => {
    if (!productId) return false;
    return wishedIds.has(String(productId));
  }, [wishedIds]);

  const toggle = useCallback(async (productId) => {
    const t = localStorage.getItem("token");
    if (!t) throw new Error("Please login to use Wishlist");

    const res = await apiToggleWishlist(t, productId); // { success, wished }

    setWishedIds((prev) => {
      const next = new Set(prev);
      const pid = String(productId);

      if (res?.wished) next.add(pid);
      else next.delete(pid);

      setCount(next.size);
      return next;
    });

    return res;
  }, []);

  const remove = useCallback(async (productId) => {
    const t = localStorage.getItem("token");
    if (!t) throw new Error("Please login to use Wishlist");

    await apiRemoveWishlistItem(t, productId);

    setWishedIds((prev) => {
      const next = new Set(prev);
      next.delete(String(productId));
      setCount(next.size);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      hydrated,
      count,
      wishedIds,
      isWished,
      toggle,
      remove,
      refresh,
    }),
    [hydrated, count, wishedIds, isWished, toggle, remove, refresh],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}