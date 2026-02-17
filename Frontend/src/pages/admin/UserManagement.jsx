import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  fetchAdminUsers,
  fetchAdminAdmins,
  deleteAdminAccount,
} from "@/services/adminUserManagementService";
import { Button } from "@/components/ui/button";

export default function UserManagement() {
  const token = localStorage.getItem("admin_token");

  const admin = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("admin_data") || "null");
    } catch {
      return null;
    }
  }, []);

  const isSuper = admin?.role === "super_admin";

  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const userRes = await fetchAdminUsers(token);
      setUsers(userRes.items || []);

      if (isSuper) {
        const adminRes = await fetchAdminAdmins(token);
        setAdmins(adminRes.items || []);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm("Delete this admin?")) return;

    try {
      await deleteAdminAccount(token, id);
      toast.success("Admin deleted");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {loading && <p className="text-sm text-gray-600">Loading...</p>}

      {/* USERS SECTION */}
      <div className="bg-white border rounded-xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Users</h2>
          <span className="text-xs text-gray-500">{users.length} total</span>
        </div>

        {/* ✅ Mobile cards */}
        <div className="md:hidden space-y-3">
          {users.length === 0 ? (
            <div className="py-6 text-sm text-gray-500 text-center">
              No users found
            </div>
          ) : (
            users.map((u) => (
              <div
                key={u._id}
                className="border rounded-xl p-4 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {u.firstName} {u.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{u.email}</p>
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      u.isVerified
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {u.isVerified ? "Verified" : "Unverified"}
                  </span>
                </div>

                <div className="text-xs text-gray-500">
                  <span className="text-gray-400">Created:</span>{" "}
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                </div>
              </div>
            ))
          )}
        </div>

        {/* ✅ Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-left text-gray-400 text-xs border-b">
                <th className="pb-3">Name</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Verified</th>
                <th className="pb-3">Created</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id}>
                    <td className="py-3">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="py-3 text-gray-500">{u.email}</td>
                    <td className="py-3">{u.isVerified ? "Yes" : "No"}</td>
                    <td className="py-3 text-gray-500">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADMINS SECTION (super only) */}
      {isSuper && (
        <div className="bg-white border rounded-xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Admins</h2>
            <span className="text-xs text-gray-500">{admins.length} total</span>
          </div>

          {/* ✅ Mobile cards */}
          <div className="md:hidden space-y-3">
            {admins.length === 0 ? (
              <div className="py-6 text-sm text-gray-500 text-center">
                No admins found
              </div>
            ) : (
              admins.map((a) => (
                <div
                  key={a._id}
                  className="border rounded-xl p-4 flex flex-col gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {a.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{a.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      <span className="text-gray-400">Role:</span> {a.role}
                    </p>
                  </div>

                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white text-xs w-full"
                    onClick={() => handleDeleteAdmin(a._id)}
                  >
                    Delete
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* ✅ Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm min-w-[650px]">
              <thead>
                <tr className="text-left text-gray-400 text-xs border-b">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {admins.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-gray-500">
                      No admins found
                    </td>
                  </tr>
                ) : (
                  admins.map((a) => (
                    <tr key={a._id}>
                      <td className="py-3">{a.name}</td>
                      <td className="py-3 text-gray-500">{a.email}</td>
                      <td className="py-3">{a.role}</td>
                      <td className="py-3">
                        <Button
                          className="bg-red-600 hover:bg-red-700 text-white text-xs"
                          onClick={() => handleDeleteAdmin(a._id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
