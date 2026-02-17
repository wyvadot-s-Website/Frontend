// src/pages/admin/AdminAccount.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { toast } from "sonner";
import { fetchAdminMe } from "@/services/adminAccountService";
import AvatarCropModal from "@/components/AvatarCropModal";
import BASE_URL from "../../utils/api";
import { Camera } from "lucide-react";

function getInitials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (first + last).toUpperCase() || "AD";
}

export default function AdminAccount() {
  const token = localStorage.getItem("admin_token");
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState(null);
  const [savingPassword, setSavingPassword] = useState(false);

  const [pw, setPw] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    const run = async () => {
      if (!token) { setLoading(false); return; }
      try {
        setLoading(true);
        const me = await fetchAdminMe(token);
        setAdmin(me);
        localStorage.setItem("admin_data", JSON.stringify(me));
      } catch (err) {
        toast.error(err.message || "Failed to load admin profile");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [token]);

  const initials = useMemo(() => getInitials(admin?.name), [admin?.name]);

  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    const reader = new FileReader();
    reader.onload = () => {
      setRawImageSrc(reader.result);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const uploadCroppedAvatar = useCallback(async (croppedFile) => {
    setCropModalOpen(false);
    setRawImageSrc(null);
    const formData = new FormData();
    formData.append("avatar", croppedFile);
    try {
      setUploadingAvatar(true);
      const res = await fetch(`${BASE_URL}/api/admin/avatar`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAdmin((a) => ({ ...a, avatar: data.avatar }));
      const stored = JSON.parse(localStorage.getItem("admin_data") || "{}");
      localStorage.setItem("admin_data", JSON.stringify({ ...stored, avatar: data.avatar }));
      toast.success("Profile picture updated");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setUploadingAvatar(false);
    }
  }, [token]);

  const changePassword = async () => {
    if (pw.newPassword !== pw.confirmNewPassword) {
      return toast.error("New passwords do not match");
    }
    if (!pw.oldPassword || !pw.newPassword) {
      return toast.error("Please fill in all password fields");
    }
    try {
      setSavingPassword(true);
      const res = await fetch(`${BASE_URL}/api/admin/change-password`, {
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
      if (!res.ok) throw new Error(data.message);
      toast.success("Password updated successfully");
      setPw({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSavingPassword(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_data");
    window.location.href = "/theboss";
  };

  const roleLabel = useMemo(() => {
    const r = admin?.role || "";
    return r.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  }, [admin?.role]);

  if (!token) return <div className="p-6 text-sm text-gray-600">Not logged in.</div>;
  if (loading) return <div className="p-6 text-sm text-gray-600">Loading account…</div>;
  if (!admin) return <div className="p-6 text-sm text-gray-600">Account not available.</div>;

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 max-w-5xl">

        {/* ── LEFT SIDEBAR ── */}
        <div className="w-full md:w-52 flex-shrink-0">
          <div className="bg-white border rounded-xl p-5 flex flex-col items-center gap-3">

            {/* Avatar with camera button */}
            <div className="relative">
              {admin?.avatar?.url ? (
                <img
                  src={admin.avatar.url}
                  alt="avatar"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-orange-500 text-white flex items-center justify-center text-2xl font-semibold">
                  {initials}
                </div>
              )}

              {/* Camera button overlay */}
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-white border-2 border-white rounded-full shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                {uploadingAvatar ? (
                  <span className="text-[9px] text-gray-500">...</span>
                ) : (
                  <Camera size={14} className="text-gray-600" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarFileChange}
                />
              </label>
            </div>

            {/* Name */}
            <p className="font-semibold text-gray-900 text-center leading-tight">
              {admin.name}
            </p>

            {/* Nav links */}
            <div className="w-full mt-2 border-t pt-3 space-y-1">
              <p className="w-full text-left text-sm font-medium text-gray-900 px-2 py-1 border-b border-gray-200 pb-2">
                Account
              </p>
              <button
                onClick={logout}
                className="w-full text-left text-sm text-gray-600 hover:text-red-600 px-2 py-1 transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT CONTENT ── */}
        <div className="flex-1 space-y-6">

          {/* Account Details */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-5">
              Account Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  value={admin.name}
                  disabled
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Display Name <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none"
                  value={admin.name}
                  disabled
                />
                <p className="text-xs text-gray-400 mt-1 italic">
                  This will be how your name will be displayed in the account section and in reviews.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none"
                  value={roleLabel}
                  disabled
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none"
                  value={admin.email}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-5">
              Password
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Old Password
                </label>
                <input
                  type="password"
                  placeholder="Old password"
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  value={pw.oldPassword}
                  onChange={(e) => setPw((p) => ({ ...p, oldPassword: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="New password"
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  value={pw.newPassword}
                  onChange={(e) => setPw((p) => ({ ...p, newPassword: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Repeat New Password
                </label>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  value={pw.confirmNewPassword}
                  onChange={(e) => setPw((p) => ({ ...p, confirmNewPassword: e.target.value }))}
                />
              </div>

              <button
                onClick={changePassword}
                disabled={savingPassword}
                className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
              >
                {savingPassword ? "Saving..." : "Save changes"}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Crop Modal */}
      {cropModalOpen && rawImageSrc && (
        <AvatarCropModal
          imageSrc={rawImageSrc}
          onCancel={() => { setCropModalOpen(false); setRawImageSrc(null); }}
          onCropComplete={uploadCroppedAvatar}
        />
      )}
    </>
  );
}