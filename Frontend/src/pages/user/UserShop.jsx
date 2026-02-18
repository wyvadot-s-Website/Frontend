// src/pages/user/UserShop.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "sonner";
import { useNavigate, useParams, useSearchParams, useLocation } from "react-router-dom";

import ShopListing from "../ShopListing";
import ProductDetail from "../ProductDetail";
import { fetchProducts, fetchProductById } from "../../services/shopService";

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
    shippingFee: Number(p?.shippingFee || 0),
    vatRate: Number(p?.vatRate || 0),
    stockQuantity: getStockQty(p),
    status: p?.status || "active",
    image: imageUrl,
    quantity: Number(qty || 1),
  };
};

function UserShop({ isProductDetailRoute }) {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(false);

  const [filters, setFilters] = useState({
    category: "All",
    search: "",
    minPrice: "",
    maxPrice: "",
    sort: "newest",
    inStock: "",
    page: 1,
    limit: 12,
  });

  const [meta, setMeta] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 12,
  });

  // ✅ READ from localStorage ONCE on mount only
  useEffect(() => {
    const saved = localStorage.getItem("wyvadot_cart");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      setCart(Array.isArray(parsed) ? parsed : []);
    } catch {
      localStorage.removeItem("wyvadot_cart");
    }
  }, []);

  // UserShop.jsx - update persistCart
const persistCart = useCallback((updater) => {
  setCart((prev) => {
    const next = typeof updater === "function" ? updater(prev) : updater;
    localStorage.setItem("wyvadot_cart", JSON.stringify(next));
    // ✅ Defer event so it fires AFTER render, not during
    setTimeout(() => {
      window.dispatchEvent(new Event("wyvadot_cart_updated"));
    }, 0);
    return next;
  });
}, []);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    [cart]
  );

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

  useEffect(() => {
    if (!isProductDetailRoute) loadProducts();
  }, [isProductDetailRoute, loadProducts]);

  useEffect(() => {
    if (!isProductDetailRoute) {
      setSelectedProduct(null);
      setLoadingProduct(false);
      return;
    }

    const productId = params.id;
    if (!productId) {
      setSelectedProduct(null);
      setLoadingProduct(false);
      return;
    }

    const loadProduct = async () => {
      try {
        setLoadingProduct(true);
        const result = await fetchProductById(productId);
        const product = result?.item || result;
        setSelectedProduct(product);
        setQuantity(1);
      } catch (err) {
        toast.error(err.message || "Failed to load product");
        setSelectedProduct(null);
      } finally {
        setLoadingProduct(false);
      }
    };

    loadProduct();
  }, [isProductDetailRoute, params.id]);

  useEffect(() => {
    const openId = location?.state?.openProductId;
    if (!openId) return;
    navigate(`/product/${openId}`, { replace: true, state: {} });
  }, [location?.state, navigate]);

  useEffect(() => {
    const q = (searchParams.get("search") || "").trim();
    setFilters((f) => {
      if ((f.search || "") === q) return f;
      return { ...f, search: q, page: 1 };
    });
  }, [searchParams]);

  // ✅ Add to cart from listing - uses persistCart
  const addToCartFromListing = useCallback((product) => {
    const id = String(getId(product) || "");
    if (!id) return;

    const qty = getStockQty(product);
    if (isProductOut(product)) return toast.error("This product is out of stock");

    persistCart((prev) => {
      const existing = prev.find(
        (item) => String(getId(item) || item.__cartId) === id
      );

      if (existing) {
        const nextQty = Number(existing.quantity || 0) + 1;
        if (qty && nextQty > qty) {
          toast.error(`Only ${qty} left in stock`);
          return prev;
        }
        return prev.map((item) =>
          String(getId(item) || item.__cartId) === id
            ? { ...item, stockQuantity: qty, status: product?.status || item.status, quantity: nextQty }
            : item
        );
      } else {
        return [...prev, normalizeCartItem(product, 1)];
      }
    });

    toast.success("Added to cart");
  }, [persistCart]);

  // ✅ Add to cart from product detail - uses persistCart
  const addToCart = useCallback(() => {
    if (!selectedProduct) return;
    const id = String(getId(selectedProduct) || "");
    if (!id) return;

    const qty = getStockQty(selectedProduct);
    if (isProductOut(selectedProduct)) return toast.error("This product is out of stock");

    persistCart((prev) => {
      const existing = prev.find(
        (item) => String(getId(item) || item.__cartId) === id
      );

      if (existing) {
        const nextQty = Number(existing.quantity || 0) + Number(quantity || 1);
        if (qty && nextQty > qty) {
          toast.error(`Only ${qty} left in stock`);
          return prev;
        }
        return prev.map((item) =>
          String(getId(item) || item.__cartId) === id
            ? { ...item, stockQuantity: qty, quantity: nextQty }
            : item
        );
      } else {
        if (qty && Number(quantity || 1) > qty) {
          toast.error(`Only ${qty} left in stock`);
          return prev;
        }
        return [...prev, normalizeCartItem(selectedProduct, quantity)];
      }
    });

    toast.success("Added to cart");
    navigate("/cart");
  }, [selectedProduct, quantity, persistCart, navigate]);

  const onProductClick = (productId) => navigate(`/product/${productId}`);

  const relatedProducts = useMemo(() => {
    if (!selectedProduct?._id) return [];
    return products.filter((p) => p._id !== selectedProduct._id).slice(0, 4);
  }, [products, selectedProduct]);

  const setCategory = (category) => setFilters((f) => ({ ...f, category, page: 1 }));
  const setSearch = (search) => setFilters((f) => ({ ...f, search, page: 1 }));
  const setPriceRange = ({ minPrice, maxPrice }) =>
    setFilters((f) => ({ ...f, minPrice: minPrice ?? "", maxPrice: maxPrice ?? "", page: 1 }));
  const setInStock = (inStock) => setFilters((f) => ({ ...f, inStock, page: 1 }));
  const setSort = (sort) => setFilters((f) => ({ ...f, sort, page: 1 }));
  const setPage = (page) => setFilters((f) => ({ ...f, page }));

  if (isProductDetailRoute) {
    if (loadingProduct) {
      return (
        <div className="min-h-screen bg-white">
          <div className="max-w-7xl mx-auto px-6 py-10 text-center text-gray-600">
            Loading product...
          </div>
        </div>
      );
    }

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

export default UserShop;