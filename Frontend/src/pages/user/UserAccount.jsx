import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getCurrentUser } from "@/services/userService";
import BASE_URL from "@/utils/api";

function initialsOf(u) {
  const a = (u?.firstName || "").trim()[0] || "";
  const b = (u?.lastName || "").trim()[0] || "";
  return (a + b).toUpperCase() || "U";
}

export default function UserAccount() {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
  });

  const [pw, setPw] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const avatar = useMemo(() => initialsOf(user), [user]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getCurrentUser(token);
        const u = data?.user;
        setUser(u || null);

        setForm({
          firstName: u?.firstName || "",
          lastName: u?.lastName || "",
          displayName: `${u?.firstName || ""} ${u?.lastName || ""}`.trim(),
          email: u?.email || "",
        });
      } catch (e) {
        toast.error(e.message || "Failed to load account");
      }
    })();
  }, [token]);

  const updateProfile = async () => {
    try {
      const res = await fetch(`${BASE_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      toast.success("Account updated");
      setUser(data.user);
      window.dispatchEvent(new Event("wyvadot_auth_updated"));
    } catch (e) {
      toast.error(e.message);
    }
  };

  const changePassword = async () => {
    try {
      if (pw.newPassword !== pw.confirmNewPassword) {
        toast.error("New passwords do not match");
        return;
      }

      const res = await fetch(`${BASE_URL}/users/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: pw.oldPassword,
          newPassword: pw.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Password change failed");

      toast.success("Password updated");
      setPw({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-center text-3xl font-semibold mb-10">My Account</h1>

      <div className="grid grid-cols-12 gap-8">
        {/* Left card */}
        <div className="col-span-12 md:col-span-3">
          <div className="border rounded-lg p-4">
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="w-16 h-16 rounded bg-gray-200 flex items-center justify-center text-xl font-semibold">
                {avatar}
              </div>
              <div className="text-sm font-medium">{form.displayName || "User"}</div>
            </div>

            <div className="border-t pt-3">
              <div className="text-sm font-medium py-2">Account</div>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.dispatchEvent(new Event("wyvadot_auth_updated"));
                  window.location.href = "/";
                }}
                className="text-sm text-gray-600 hover:text-red-600 py-2"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>

        {/* Right content */}
        <div className="col-span-12 md:col-span-9">
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-4">Account Details</h2>

            <div className="space-y-3">
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="First name"
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
              />
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="Last name"
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              />
              <input
                className="w-full border rounded px-3 py-2 bg-gray-50"
                placeholder="Display name"
                value={form.displayName}
                disabled
              />
              <p className="text-xs text-gray-500">
                This will be how your name will be displayed in the account section.
              </p>
              <input
                className="w-full border rounded px-3 py-2 bg-gray-50"
                placeholder="Email"
                value={form.email}
                disabled
              />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Password</h2>

            <div className="space-y-3">
              <input
                className="w-full border rounded px-3 py-2"
                type="password"
                placeholder="Old password"
                value={pw.oldPassword}
                onChange={(e) => setPw((p) => ({ ...p, oldPassword: e.target.value }))}
              />
              <input
                className="w-full border rounded px-3 py-2"
                type="password"
                placeholder="New password"
                value={pw.newPassword}
                onChange={(e) => setPw((p) => ({ ...p, newPassword: e.target.value }))}
              />
              <input
                className="w-full border rounded px-3 py-2"
                type="password"
                placeholder="Repeat new password"
                value={pw.confirmNewPassword}
                onChange={(e) =>
                  setPw((p) => ({ ...p, confirmNewPassword: e.target.value }))
                }
              />

              <button
                onClick={updateProfile}
                className="mt-4 bg-[#FF8D28] hover:bg-orange-600 text-white px-6 py-2 rounded"
              >
                Save changes
              </button>

              <button
                onClick={changePassword}
                className="ml-3 mt-4 bg-black hover:bg-gray-900 text-white px-6 py-2 rounded"
              >
                Update password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}