// src/pages/user/UserShop.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "sonner";

import ShopListing from "../ShopListing";
import ProductDetail from "../ProductDetail";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";

import { fetchProducts, fetchProductById } from "../../services/shopService";

/** =========================
 * Helpers
 * ========================= */
const getId = (p) => p?._id || p?.id;
const getStockQty = (p) => Number(p?.stockQuantity ?? 0);

const isProductOut = (p) => {
  const status = p?.status;
  const qty = getStockQty(p);
  return status === "out_of_stock" || status === "archived" || qty <= 0;
};

const normalizeCartItem = (p, qty = 1) => {
  const id = getId(p);
  const imageUrl = p?.images?.[0]?.url || p?.image || "";
  return {
    ...p,
    _id: p?._id || undefined,
    id: p?.id || undefined,
    __cartId: id,
    name: p?.name || "",
    price: Number(p?.price || 0),
    stockQuantity: getStockQty(p),
    status: p?.status || "active",
    image: imageUrl,
    quantity: Number(qty || 1),
  };
};

function UserShop() {
  const [currentView, setCurrentView] = useState("listing");
  const [quantity, setQuantity] = useState(1);

  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ✅ server-driven filters + pagination
  const [filters, setFilters] = useState({
    category: "All",
    search: "",
    minPrice: "",
    maxPrice: "",
    sort: "newest",
    inStock: "", // "true" or ""
    page: 1,
    limit: 12,
  });

  // ✅ meta returned from backend
  const [meta, setMeta] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 12,
  });

  const loadProducts = useCallback(async () => {
    try {
      const result = await fetchProducts(filters);

      const items = result?.items || [];
      setProducts(Array.isArray(items) ? items : []);

      setMeta({
        page: Number(result?.page || filters.page || 1),
        totalPages: Number(result?.totalPages || 1),
        total: Number(result?.total || 0),
        limit: Number(result?.limit || filters.limit || 12),
      });
    } catch (err) {
      toast.error(err.message || "Failed to load products");
      setProducts([]);
      setMeta((m) => ({ ...m, total: 0, totalPages: 1 }));
    }
  }, [filters]);

  /** =========================
   * Open product detail
   * ========================= */
  const onProductClick = useCallback(async (productOrId) => {
    try {
      const id =
        typeof productOrId === "string" ? productOrId : getId(productOrId);
      if (!id) return;

      const product = await fetchProductById(id);

      setSelectedProduct(product);
      setQuantity(1);
      setCurrentView("product");
    } catch (err) {
      toast.error(err.message || "Failed to open product");
    }
  }, []);

  /** ✅ NEW: open product when coming from navbar search */
  useEffect(() => {
    const openId = location?.state?.openProductId;
    if (!openId) return;

    onProductClick(openId);

    // clear state so refresh/back doesn't reopen
    navigate("/shop", { replace: true, state: {} });
  }, [location?.state, navigate, onProductClick]);

  /** ✅ sync "search" filter with URL query param */
  useEffect(() => {
    const q = (searchParams.get("search") || "").trim();

    setFilters((f) => {
      if ((f.search || "") === q) return f;
      return { ...f, search: q, page: 1 };
    });
  }, [searchParams]);

  /** ✅ reload whenever filters change (while on listing) */
  useEffect(() => {
    if (currentView === "listing") loadProducts();
  }, [currentView, loadProducts]);

  /** =========================
   * Cart persistence
   * ========================= */
  useEffect(() => {
    const saved = localStorage.getItem("wyvadot_cart");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCart(Array.isArray(parsed) ? parsed : []);
      } catch {
        localStorage.removeItem("wyvadot_cart");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wyvadot_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("wyvadot_cart_updated"));
  }, [cart]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    [cart],
  );

  /** =========================
   * Add to cart from Listing
   * ========================= */
  const addToCartFromListing = (product) => {
    const id = getId(product);
    if (!id) return;

    const qty = getStockQty(product);

    if (isProductOut(product))
      return toast.error("This product is out of stock");

    const existingItem = cart.find(
      (item) => (getId(item) || item.__cartId) === id,
    );

    if (existingItem) {
      const nextQty = Number(existingItem.quantity || 0) + 1;
      if (qty && nextQty > qty) return toast.error(`Only ${qty} left in stock`);

      setCart(
        cart.map((item) => {
          const itemId = getId(item) || item.__cartId;
          if (itemId !== id) return item;

          return {
            ...item,
            stockQuantity: qty,
            status: product?.status || item.status,
            quantity: nextQty,
          };
        }),
      );
    } else {
      setCart([...cart, normalizeCartItem(product, 1)]);
    }

    toast.success("Added to cart");
  };

  const relatedProducts = useMemo(() => {
    if (!selectedProduct?._id) return [];
    return products.filter((p) => p._id !== selectedProduct._id).slice(0, 4);
  }, [products, selectedProduct]);

  /** =========================
   * Add to cart from ProductDetail
   * ========================= */
  const addToCart = () => {
    if (!selectedProduct) return;

    const id = getId(selectedProduct);
    if (!id) return;

    const qty = getStockQty(selectedProduct);

    if (isProductOut(selectedProduct))
      return toast.error("This product is out of stock");

    const existingItem = cart.find(
      (item) => (getId(item) || item.__cartId) === id,
    );

    if (existingItem) {
      const nextQty =
        Number(existingItem.quantity || 0) + Number(quantity || 1);
      if (qty && nextQty > qty) return toast.error(`Only ${qty} left in stock`);

      setCart(
        cart.map((item) => {
          const itemId = getId(item) || item.__cartId;
          if (itemId !== id) return item;

          return {
            ...item,
            stockQuantity: qty,
            status: selectedProduct?.status || item.status,
            quantity: nextQty,
          };
        }),
      );
    } else {
      if (qty && Number(quantity || 1) > qty)
        return toast.error(`Only ${qty} left in stock`);
      setCart([...cart, normalizeCartItem(selectedProduct, quantity)]);
    }

    toast.success("Added to cart");
  };

  /** =========================
   * Controlled filter handlers
   * ========================= */
  const setCategory = (category) =>
    setFilters((f) => ({ ...f, category, page: 1 }));

  const setSearch = (search) => setFilters((f) => ({ ...f, search, page: 1 }));

  const setPriceRange = ({ minPrice, maxPrice }) =>
    setFilters((f) => ({
      ...f,
      minPrice: minPrice ?? "",
      maxPrice: maxPrice ?? "",
      page: 1,
    }));

  const setInStock = (inStock) =>
    setFilters((f) => ({ ...f, inStock, page: 1 }));

  const setSort = (sort) => setFilters((f) => ({ ...f, sort, page: 1 }));

  const setPage = (page) => setFilters((f) => ({ ...f, page }));

  /** =========================
   * Views
   * ========================= */
  if (currentView === "listing") {
    return (
      <ShopListing
        products={products}
        onProductClick={onProductClick}
        cartCount={cartCount}
        onAddToCartFromListing={addToCartFromListing}
        showFloatingCart={false}
        filters={filters}
        meta={meta}
        onChangeCategory={setCategory}
        onChangeSearch={setSearch}
        onChangePriceRange={setPriceRange}
        onChangeInStock={setInStock}
        onChangeSort={setSort}
        onChangePage={setPage}
      />
    );
  }

  if (currentView === "product") {
    return (
      <ProductDetail
        product={selectedProduct}
        relatedProducts={relatedProducts}
        quantity={quantity}
        setQuantity={setQuantity}
        onAddToCart={addToCart}
      />
    );
  }

  return null;
}

export default UserShop;