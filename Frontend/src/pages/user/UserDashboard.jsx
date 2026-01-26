import React, { useEffect, useState } from "react";
import WelcomeView from "@/components/auth/WelcomeView.jsx";
import logo from "../../../public/af586a3ee0894e6b9fdd44a1f9c63d062d814420.png";
import { toast } from "sonner";
import { fetchMyServiceRequests } from "@/services/userServiceRequestService";
import ServiceRequestDetailModal from "@/components/user/ServiceRequestDetailModal";
import ServiceComponent from "@/components/service.jsx";
import { fetchMyOrders } from "@/services/userOrderService";
import UserOrderDetailModal from "@/components/user/UserOrderDetailModal";

function UserDashboard() {
  const [showWelcome, setShowWelcome] = useState(false);
  const token = localStorage.getItem("token"); // change if your user token key is different

  const [myRequests, setMyRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [myOrders, setMyOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const openOrderDetail = (id) => {
    setSelectedOrderId(id);
    setOrderDetailOpen(true);
  };

  const formatMoney = (amount) =>
    Number(amount || 0).toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
    });

  const openDetail = (id) => {
    setSelectedRequestId(id);
    setDetailOpen(true);
  };

  useEffect(() => {
    const justSignedUp = localStorage.getItem("justSignedUp");

    if (justSignedUp === "true") {
      setShowWelcome(true);
    }
  }, []);

  const handleCloseWelcome = () => {
    localStorage.removeItem("justSignedUp");
    setShowWelcome(false);
  };

  const loadMyRequests = async () => {
    if (!token) return;

    setLoadingRequests(true);
    try {
      const result = await fetchMyServiceRequests(token);
      setMyRequests(result?.data || []);
    } catch (err) {
      toast.error(err.message || "Failed to load your service projects");
    } finally {
      setLoadingRequests(false);
    }
  };

  const loadMyOrders = async () => {
    if (!token) return;

    setLoadingOrders(true);
    try {
      const result = await fetchMyOrders(token, { page: 1, limit: 10 });
      setMyOrders(result?.items || []);
    } catch (err) {
      toast.error(err.message || "Failed to load your orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    loadMyRequests();
    loadMyOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    const justSignedUp = localStorage.getItem("justSignedUp");

    if (justSignedUp === "true") {
      setShowWelcome(true);
    }
  }, []);

  return (
    <>
      {/* Welcome Modal */}
      {showWelcome && (
        <WelcomeView
          isOpen={showWelcome}
          logo={logo}
          onContinue={handleCloseWelcome}
        />
      )}

      {/* Dashboard Content */}
      <div className="min-h-screen bg-gray-50 px-6 py-8 space-y-10">
        {/* Top Service Cards */}
        <ServiceComponent />

        {/* Service Project Table */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-lg mb-4">Service Project</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-500 border-b">
                <tr>
                  <th className="text-left py-3">Project ID</th>
                  <th className="text-left py-3">Title</th>
                  <th className="text-left py-3">Client</th>
                  <th className="text-left py-3">Progress</th>
                  <th className="text-left py-3">Stage</th>
                  <th className="text-left py-3">Manager</th>
                  <th className="text-left py-3">Date</th>
                  <th className="text-left py-3">Email</th>
                  <th className="text-left py-3">Project</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loadingRequests ? (
                  <tr>
                    <td className="py-6 text-sm text-gray-500" colSpan={9}>
                      Loading...
                    </td>
                  </tr>
                ) : myRequests.length === 0 ? (
                  <tr>
                    <td className="py-6 text-sm text-gray-500" colSpan={9}>
                      No service requests yet.
                    </td>
                  </tr>
                ) : (
                  myRequests.map((r) => {
                    const progress = Math.max(
                      0,
                      Math.min(100, Number(r.progress ?? 0)),
                    );
                    const stage = r.stage || "Pending";

                    // stage pill color (same mapping as admin)
                    const stageMap = {
                      Documentation: "bg-orange-100 text-orange-600",
                      Execution: "bg-blue-100 text-blue-600",
                      Completed: "bg-green-100 text-green-600",
                      Rejected: "bg-red-100 text-red-600",
                      Pending: "bg-gray-100 text-gray-600",
                      "Site Visit": "bg-purple-100 text-purple-600",
                      Review: "bg-yellow-100 text-yellow-700",
                    };

                    const stageCls =
                      stageMap[stage] || "bg-gray-100 text-gray-600";

                    const projectStageCls =
                      r.projectStage === "Project"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-100 text-green-600";

                    const createdAt = r.createdAt
                      ? new Date(r.createdAt).toLocaleDateString()
                      : "—";

                    return (
                      <tr
                        key={r._id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => openDetail(r._id)}
                      >
                        <td className="py-3">{r.projectId}</td>

                        <td className="py-3 font-medium">{r.title}</td>

                        <td className="py-3">{r.contact?.name || "—"}</td>

                        <td className="py-3">
                          <div className="w-24 h-2 bg-gray-200 rounded">
                            <div
                              className="h-2 bg-gray-800 rounded"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </td>

                        <td className="py-3">
                          <span
                            className={`px-3 py-1 text-xs rounded-full ${stageCls}`}
                          >
                            {stage}
                          </span>
                        </td>

                        <td className="py-3">
                          {r.assignedAdmin?.name || "Unassigned"}
                        </td>

                        <td className="py-3">{createdAt}</td>

                        <td className="py-3 text-gray-500">
                          {r.contact?.email || "—"}
                        </td>

                        <td className="py-3">
                          <span
                            className={`px-3 py-1 text-xs rounded-full ${projectStageCls}`}
                          >
                            {r.projectStage || "Service"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Shop Table */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-lg mb-4">Recent Shop</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-500 border-b">
                <tr>
                  <th className="text-left py-3">Order ID</th>
                  <th className="text-left py-3">Product Name</th>
                  <th className="text-left py-3">Category</th>
                  <th className="text-left py-3">Items</th>
                  <th className="text-left py-3">Total</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-left py-3">Order Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loadingOrders ? (
                  <tr>
                    <td className="py-6 text-sm text-gray-500" colSpan={7}>
                      Loading orders...
                    </td>
                  </tr>
                ) : myOrders.length === 0 ? (
                  <tr>
                    <td className="py-6 text-sm text-gray-500" colSpan={7}>
                      No orders yet.
                    </td>
                  </tr>
                ) : (
                  myOrders.map((o) => {
                    const itemsCount = Array.isArray(o.items)
                      ? o.items.reduce(
                          (sum, it) => sum + Number(it.quantity || 0),
                          0,
                        )
                      : 0;

                    const firstName = o?.items?.[0]?.name || "—";
                    const firstCategory = o?.items?.[0]?.category || "—";

                    const createdAt = o.createdAt
                      ? new Date(o.createdAt).toLocaleDateString()
                      : "—";

                    const status = o.status || "processing";
                    const statusMap = {
                      processing: "bg-orange-100 text-orange-700",
                      pending: "bg-gray-100 text-gray-700",
                      shipped: "bg-blue-100 text-blue-700",
                      delivered: "bg-green-100 text-green-700",
                      cancelled: "bg-red-100 text-red-700",
                    };
                    const statusCls =
                      statusMap[status] || "bg-gray-100 text-gray-700";

                    return (
                      <tr
                        key={o._id}
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => openOrderDetail(o._id)}
                      >
                        <td className="py-3">{o.orderId}</td>

                        <td className="py-3 font-medium">{firstName}</td>

                        <td className="py-3">
                          <span className="px-3 py-1 text-xs rounded-full bg-gray-100">
                            {firstCategory}
                          </span>
                        </td>

                        <td className="py-3">{itemsCount}</td>

                        <td className="py-3">
                          {formatMoney(o?.totals?.total || 0)}
                        </td>

                        <td className="py-3">
                          <span
                            className={`px-3 py-1 text-xs rounded-full ${statusCls}`}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="py-3">{createdAt}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ServiceRequestDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        token={token}
        requestId={selectedRequestId}
      />
      <UserOrderDetailModal
        open={orderDetailOpen}
        onClose={() => setOrderDetailOpen(false)}
        token={token}
        orderId={selectedOrderId}
      />
    </>
  );
}

export default UserDashboard;
