import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { fetchAdminUsers, fetchAdminAdmins, deleteAdminAccount } from "@/services/adminUserManagementService";
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
      <div className="bg-white border rounded-xl p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Users</h2>

        <table className="w-full text-sm">
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
                  <td className="py-3">
                    {u.isVerified ? "Yes" : "No"}
                  </td>
                  <td className="py-3 text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ADMINS SECTION (super only) */}
      {isSuper && (
        <div className="bg-white border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Admins</h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs border-b">
                <th className="pb-3">Name</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {admins.map((a) => (
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
