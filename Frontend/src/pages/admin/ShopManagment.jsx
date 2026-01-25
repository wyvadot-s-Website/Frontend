import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Trash2, Plus, Search, Pencil } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  fetchAdminProducts,
  createAdminProduct,
  archiveAdminProduct,
  updateAdminProduct,
  fetchAdminOrders,
  updateAdminOrder,
} from "@/services/adminShopService";

import AddProductModal from "./AddProductModal";
import EditProductModal from "./EditProductModal";
import UpdateOrderModal from "./UpdateOrderModal";

const formatMoney = (amount) =>
  Number(amount || 0).toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
  });

const badgeClass = (status) => {
  if (status === "active") return "bg-green-100 text-green-700";
  if (status === "out_of_stock") return "bg-orange-100 text-orange-700";
  if (status === "draft") return "bg-gray-100 text-gray-700";
  return "bg-gray-100 text-gray-700";
};

const ShopManagment = () => {
  const token = localStorage.getItem("admin_token");

  const [tab, setTab] = useState("products");
  const [query, setQuery] = useState("");

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const [showAdd, setShowAdd] = useState(false);
  const [creating, setCreating] = useState(false);

  // ✅ Edit states
  const [showEdit, setShowEdit] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [updating, setUpdating] = useState(false);

  // ✅ Orders states
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const [showOrderUpdate, setShowOrderUpdate] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [orderUpdating, setOrderUpdating] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await fetchAdminProducts(token, { search: query });

      const items = res.items || res.data?.items || res.data || res;
      setProducts(Array.isArray(items) ? items : []);
    } catch (err) {
      toast.error(err.message || "Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await fetchAdminOrders(token, { search: query });

      const items = res.items || res.data?.items || res.data || res;
      setOrders(Array.isArray(items) ? items : []);
    } catch (err) {
      toast.error(err.message || "Failed to load orders");
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "products") loadProducts();
    if (tab === "orders") loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (tab === "products") loadProducts();
      if (tab === "orders") loadOrders();
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, tab]);

  const totals = useMemo(() => {
    const revenue = orders.reduce(
      (sum, o) => sum + Number(o?.totals?.total || o?.total || 0),
      0,
    );
    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      revenue,
    };
  }, [products, orders]);

  const handleCreateProduct = async ({ form, images, reset, close }) => {
    if (!token) return toast.error("Admin token missing. Please login again.");
    if (!form.name || !form.price)
      return toast.error("Product name and price are required.");
    if (!images.length)
      return toast.error("Please upload at least 1 product image.");

    try {
      setCreating(true);

      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("price", form.price);
      if (form.oldPrice) fd.append("oldPrice", form.oldPrice);
      if (form.saleEndsAt)
        fd.append("saleEndsAt", new Date(form.saleEndsAt).toISOString());
      fd.append("stockQuantity", form.stockQuantity || 0);
      fd.append("status", form.status);

      images.forEach((file) => fd.append("images", file));

      await createAdminProduct(token, fd);

      toast.success("Product created");
      reset?.();
      close?.();
      loadProducts();
    } catch (err) {
      toast.error(err.message || "Failed to create product");
    } finally {
      setCreating(false);
    }
  };

  const onArchive = async (id) => {
    if (!token) return toast.error("Admin token missing. Please login again.");

    try {
      await archiveAdminProduct(id, token);
      toast.success("Product archived");
      loadProducts();
    } catch (err) {
      toast.error(err.message || "Failed to archive product");
    }
  };

  // ✅ Open edit modal
  const onEdit = (product) => {
    setEditingProduct(product);
    setShowEdit(true);
  };

  // ✅ Submit update (JSON PATCH)
  const handleUpdateProduct = async ({ id, updates, close }) => {
    if (!token) return toast.error("Admin token missing. Please login again.");
    if (!id) return toast.error("Product id missing.");

    if (!updates?.name || !updates?.price) {
      return toast.error("Product name and price are required.");
    }

    try {
      setUpdating(true);

      const payload = {
        ...updates,
        price: updates.price !== "" ? Number(updates.price) : updates.price,
        oldPrice:
          updates.oldPrice === "" || updates.oldPrice === null
            ? null
            : Number(updates.oldPrice),
        stockQuantity:
          updates.stockQuantity === "" || updates.stockQuantity === null
            ? 0
            : Number(updates.stockQuantity),
        saleEndsAt: updates.saleEndsAt ? updates.saleEndsAt : null,
      };

      await updateAdminProduct(id, payload, token);

      toast.success("Product updated");
      close?.();
      loadProducts();
    } catch (err) {
      toast.error(err.message || "Failed to update product");
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Orders helpers (ADD)
  const onUpdateOrder = (order) => {
    setEditingOrder(order);
    setShowOrderUpdate(true);
  };

  const handleUpdateOrder = async ({ id, status, note, downloads, close }) => {
    if (!token) return toast.error("Admin token missing. Please login again.");
    if (!id) return toast.error("Order id missing.");

    try {
      setOrderUpdating(true);

      const payload = {
        status,
        note: note || "",
        downloads: Array.isArray(downloads) ? downloads : [],
      };
      await updateAdminOrder(id, payload, token);

      toast.success("Order updated");
      close?.();
      loadOrders();
    } catch (err) {
      toast.error(err.message || "Failed to update order");
    } finally {
      setOrderUpdating(false);
    }
  };

  // ✅ Optional helpers for Orders table (ADD)
  const orderBadgeClass = (status) => {
    if (status === "processing") return "bg-green-100 text-green-700";
    if (status === "shipped") return "bg-blue-100 text-blue-700";
    if (status === "delivered") return "bg-orange-100 text-orange-700";
    return "bg-gray-100 text-gray-700";
  };

  const orderStatusLabel = (status) => {
    if (status === "processing") return "Processing";
    if (status === "shipped") return "Shipped";
    if (status === "delivered") return "Delivered";
    return status || "—";
  };

  const formatDate = (iso) => {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-GB");
  };

  return (
    <div className="w-full">
      {/* Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border p-5 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Products</p>
            <p className="text-2xl font-semibold">{totals.totalProducts}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
            <span className="text-orange-500">🧾</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-5 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Total Orders</p>
            <p className="text-2xl font-semibold">{totals.totalOrders}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
            <span className="text-orange-500">📦</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-5 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Revenue</p>
            <p className="text-2xl font-semibold">
              {formatMoney(totals.revenue)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
            <span className="text-orange-500">💳</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mt-6">
        <div className="relative">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products or orders"
            className="pl-10"
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
        </div>
      </div>

      {/* Shop Data */}
      <div className="mt-6 bg-white border rounded-xl p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Shop Data</h3>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-gray-200"
              onClick={() => setShowAdd(true)}
            >
              <Plus size={16} className="mr-2" />
              Add Product
            </Button>
            <Button className="bg-[#FF8D28] hover:bg-[#e67d1f]">
              View all
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 inline-flex rounded-full bg-gray-100 p-1">
          <button
            onClick={() => setTab("products")}
            className={`px-4 py-2 rounded-full text-sm ${
              tab === "products"
                ? "bg-white shadow font-medium"
                : "text-gray-600"
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setTab("orders")}
            className={`px-4 py-2 rounded-full text-sm ${
              tab === "orders" ? "bg-white shadow font-medium" : "text-gray-600"
            }`}
          >
            Orders ({orders.length})
          </button>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          {tab === "orders" ? (
            ordersLoading ? (
              <div className="py-10 text-center text-gray-600">
                Loading orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="py-10 text-center text-gray-600">
                No orders yet.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-gray-500">
                  <tr className="border-b">
                    <th className="text-left py-3 font-medium">Order ID</th>
                    <th className="text-left py-3 font-medium">Customer</th>
                    <th className="text-left py-3 font-medium">Items</th>
                    <th className="text-left py-3 font-medium">Total</th>
                    <th className="text-left py-3 font-medium">Status</th>
                    <th className="text-left py-3 font-medium">Order Date</th>
                    <th className="text-right py-3 font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((o) => {
                    const itemsCount = Array.isArray(o?.items)
                      ? o.items.reduce(
                          (sum, i) => sum + Number(i?.quantity || 0),
                          0,
                        )
                      : Number(o?.itemsCount || 0);

                    const totalNgn = Number(o?.totals?.total ?? o?.total ?? 0);

                    return (
                      <tr key={o._id} className="border-b last:border-b-0">
                        <td className="py-4 font-medium">{o.orderId || "—"}</td>

                        <td className="py-4">
                          <div className="font-medium">
                            {o?.customer?.email || "—"}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {o?.customer?.phone || "—"}
                          </div>
                        </td>

                        <td className="py-4">{itemsCount}</td>

                        <td className="py-4">{formatMoney(totalNgn)}</td>

                        <td className="py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs ${orderBadgeClass(o.status)}`}
                          >
                            {orderStatusLabel(o.status)}
                          </span>
                        </td>

                        <td className="py-4">{formatDate(o.createdAt)}</td>

                        <td className="py-4 text-right">
                          <button
                            onClick={() => onUpdateOrder(o)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FF8D28] text-white text-xs font-semibold hover:bg-[#e67d1f]"
                            title="Update"
                          >
                            <Pencil size={14} />
                            Update
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )
          ) : loading ? (
            <div className="py-10 text-center text-gray-600">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="py-10 text-center text-gray-600">
              No products yet. Create your first product.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-gray-500">
                <tr className="border-b">
                  <th className="text-left py-3 font-medium">Product Name</th>
                  <th className="text-left py-3 font-medium">Category</th>
                  <th className="text-left py-3 font-medium">Price</th>
                  <th className="text-left py-3 font-medium">Stock</th>
                  <th className="text-left py-3 font-medium">Sold</th>
                  <th className="text-left py-3 font-medium">Status</th>
                  <th className="text-right py-3 font-medium">Action</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-b last:border-b-0">
                    <td className="py-4">{p.name}</td>
                    <td className="py-4">
                      <span className="px-3 py-1 rounded-full border text-xs">
                        {p.category || "Uncategorized"}
                      </span>
                    </td>
                    <td className="py-4">{formatMoney(p.price)}</td>
                    <td className="py-4">{p.stockQuantity ?? 0}</td>
                    <td className="py-4">{p.soldCount ?? 0}</td>
                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${badgeClass(
                          p.status,
                        )}`}
                      >
                        {p.status === "out_of_stock"
                          ? "Out of stock"
                          : p.status}
                      </span>
                    </td>

                    {/* ✅ Actions: Edit + Archive */}
                    <td className="py-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => onEdit(p)}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100"
                          title="Edit"
                        >
                          <Pencil size={18} className="text-gray-500" />
                        </button>

                        <button
                          onClick={() => onArchive(p._id)}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100"
                          title="Archive"
                        >
                          <Trash2 size={18} className="text-gray-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AddProductModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={handleCreateProduct}
        loading={creating}
      />

      <EditProductModal
        open={showEdit}
        onClose={() => {
          setShowEdit(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSubmit={handleUpdateProduct}
        loading={updating}
      />
      <UpdateOrderModal
        open={showOrderUpdate}
        onClose={() => {
          setShowOrderUpdate(false);
          setEditingOrder(null);
        }}
        order={editingOrder}
        onSubmit={handleUpdateOrder}
        loading={orderUpdating}
      />
    </div>
  );
};

export default ShopManagment;
