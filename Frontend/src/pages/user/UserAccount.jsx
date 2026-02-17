import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getCurrentUser } from "@/services/userService";
import BASE_URL from "@/utils/api";
import AvatarCropModal from "@/components/AvatarCropModal";

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

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
const [rawImageSrc, setRawImageSrc] = useState(null);

  const avatar = useMemo(() => initialsOf(user), [user]);

  useEffect(() => {
    if (!token) return;

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
    if (!token) return toast.error("Please login again.");

    try {
      setSavingProfile(true);

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

      // refresh navbar initials/name
      window.dispatchEvent(new Event("wyvadot_auth_updated"));
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async () => {
    if (!token) return toast.error("Please login again.");

    try {
      if (pw.newPassword !== pw.confirmNewPassword) {
        toast.error("New passwords do not match");
        return;
      }

      setSavingPassword(true);

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
    } finally {
      setSavingPassword(false);
    }
  };

  const handleAvatarChange = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Reset input so same file can be re-selected
  e.target.value = "";

  const reader = new FileReader();
  reader.onload = () => {
    setRawImageSrc(reader.result);
    setCropModalOpen(true);
  };
  reader.readAsDataURL(file);
};

// Add upload handler (called after crop confirm)
const uploadCroppedAvatar = async (croppedFile) => {
  setCropModalOpen(false);
  setRawImageSrc(null);

  const formData = new FormData();
  formData.append("avatar", croppedFile);

  try {
    setUploadingAvatar(true);
    const res = await fetch(`${BASE_URL}/users/avatar`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    setUser((u) => ({ ...u, avatar: data.avatar }));
    toast.success("Profile picture updated");
    window.dispatchEvent(new Event("wyvadot_auth_updated"));
  } catch (e) {
    toast.error(e.message);
  } finally {
    setUploadingAvatar(false);
  }
};

  const logout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("wyvadot_auth_updated"));
    window.location.href = "/";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          My Account
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your profile and password.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        {/* Left: profile card */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3">
          <div className="border rounded-2xl bg-white p-5">
            <div className="flex items-center gap-4">
              <label className="relative cursor-pointer group">
  {user?.avatar?.url ? (
    <img
      src={user.avatar.url}
      alt="avatar"
      className="w-14 h-14 rounded-2xl object-cover"
    />
  ) : (
    <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center text-lg font-semibold">
      {avatar}
    </div>
  )}
  <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
    <span className="text-white text-[10px] font-medium">
      {uploadingAvatar ? "..." : "Change"}
    </span>
  </div>
  <input
    type="file"
    accept="image/*"
    className="hidden"
    onChange={handleAvatarChange}
  />
</label>

              <div className="min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {form.displayName || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {form.email || ""}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t space-y-2">
              <button
                onClick={logout}
                className="w-full text-left text-sm px-3 py-2 rounded-xl hover:bg-red-50 text-red-600"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>

        {/* Right: forms */}
        <div className="col-span-12 md:col-span-8 lg:col-span-9 space-y-6">
          {/* Account details */}
          <div className="border rounded-2xl bg-white p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Account Details
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Update your name. Your email can’t be changed here.
                </p>
              </div>

              <button
                onClick={updateProfile}
                disabled={savingProfile}
                className="bg-[#FF8D28] hover:bg-orange-600 disabled:bg-orange-300 text-white text-sm font-medium px-4 py-2 rounded-xl"
              >
                {savingProfile ? "Saving..." : "Save"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600">First name</label>
                <input
                  className="mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="First name"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, firstName: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Last name</label>
                <input
                  className="mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, lastName: e.target.value }))
                  }
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs text-gray-600">Display name</label>
                <input
                  className="mt-1 w-full border rounded-xl px-3 py-2 bg-gray-50 text-gray-700"
                  placeholder="Display name"
                  value={form.displayName}
                  disabled
                />
                <p className="text-xs text-gray-400 mt-2">
                  This is how your name shows in your account section.
                </p>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs text-gray-600">Email</label>
                <input
                  className="mt-1 w-full border rounded-xl px-3 py-2 bg-gray-50 text-gray-700"
                  placeholder="Email"
                  value={form.email}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="border rounded-2xl bg-white p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Password
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Change your password securely.
                </p>
              </div>

              <button
                onClick={changePassword}
                disabled={savingPassword}
                className="bg-black hover:bg-gray-900 disabled:bg-gray-500 text-white text-sm font-medium px-4 py-2 rounded-xl"
              >
                {savingPassword ? "Updating..." : "Update"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs text-gray-600">Old password</label>
                <input
                  className="mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  type="password"
                  placeholder="Old password"
                  value={pw.oldPassword}
                  onChange={(e) =>
                    setPw((p) => ({ ...p, oldPassword: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">New password</label>
                <input
                  className="mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  type="password"
                  placeholder="New password"
                  value={pw.newPassword}
                  onChange={(e) =>
                    setPw((p) => ({ ...p, newPassword: e.target.value }))
                  }
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Confirm password</label>
                <input
                  className="mt-1 w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  type="password"
                  placeholder="Repeat new password"
                  value={pw.confirmNewPassword}
                  onChange={(e) =>
                    setPw((p) => ({ ...p, confirmNewPassword: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Small hint */}
          <div className="text-xs text-gray-400">
            Tip: Use a strong password (8+ characters with letters and numbers).
          </div>
        </div>
      </div>
      {/* Crop Modal */}
{cropModalOpen && rawImageSrc && (
  <AvatarCropModal
    imageSrc={rawImageSrc}
    onCancel={() => {
      setCropModalOpen(false);
      setRawImageSrc(null);
    }}
    onCropComplete={uploadCroppedAvatar}
  />
)}
    </div>
  );
}
