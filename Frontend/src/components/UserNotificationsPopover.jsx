import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  fetchUserNotifications,
  markUserNotificationsRead,
} from "@/services/notificationService";
import { useNavigate } from "react-router-dom";

function timeAgo(dateStr) {
  const d = new Date(dateStr);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function UserNotificationsPopover({
  open,
  onClose,
  token,
  onUnreadChange,

  // ✅ NEW: "popover" (desktop dropdown) | "sheet" (mobile full width)
  variant = "popover",
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);

  const load = async () => {
    if (!token) {
      setItems([]);
      setUnread(0);
      onUnreadChange?.(0);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchUserNotifications(token, 1, 20);

      // ✅ Support multiple backend shapes safely
      const list =
        data?.items ||
        data?.notifications ||
        data?.data?.items ||
        data?.data?.notifications ||
        [];

      const unreadCount = Number(
        data?.unread ?? data?.data?.unread ?? data?.meta?.unread ?? 0
      );

      setItems(Array.isArray(list) ? list : []);
      setUnread(unreadCount);
      onUnreadChange?.(unreadCount);
    } catch {
      // keep silent, but don't leave stale values
      setItems([]);
      setUnread(0);
      onUnreadChange?.(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const markAllRead = async () => {
    if (!token) return;
    try {
      await markUserNotificationsRead(token, { all: true });
      const next = items.map((n) => ({
        ...n,
        isRead: true,
        readAt: new Date().toISOString(),
      }));
      setItems(next);
      setUnread(0);
      onUnreadChange?.(0);
    } catch {}
  };

  const openNotification = async (n) => {
    // mark as read
    if (!n?.isRead && token) {
      try {
        await markUserNotificationsRead(token, { ids: [n._id] });

        setItems((prev) =>
          prev.map((x) => (x._id === n._id ? { ...x, isRead: true } : x))
        );

        // ✅ keep local unread correct
        setUnread((u) => Math.max(0, u - 1));
        onUnreadChange?.((u) => Math.max(0, u - 1)); // supports function or value
      } catch {}
    }

    if (n?.link) navigate(n.link);
    onClose?.();
  };

  if (!open) return null;

  // ✅ Layout classes based on variant
  const containerClass =
    variant === "sheet"
      ? "w-full bg-white border rounded-2xl shadow-sm overflow-hidden"
      : "absolute right-0 mt-2 w-[360px] bg-white border rounded-xl shadow-lg z-50 overflow-hidden";

  return (
    <div className={containerClass}>
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div>
          <p className="text-sm font-semibold">Notifications</p>
          <p className="text-xs text-gray-500">
            {unread > 0 ? `${unread} unread` : "All caught up"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllRead}
            disabled={unread === 0}
            className={`text-xs px-2 py-1 rounded-md border ${
              unread === 0 ? "text-gray-400" : "hover:bg-gray-50"
            }`}
          >
            Mark all read
          </button>

          <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className={variant === "sheet" ? "max-h-[60vh] overflow-auto" : "max-h-[420px] overflow-auto"}>
        {loading ? (
          <div className="p-4 text-sm text-gray-600">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-4 text-sm text-gray-600">
            <img
              src="../../public/Frame 2147224292.svg"
              alt="No notifications yet"
              className="flex place-self-center p-5"
            />
            <p className="flex place-self-center p-5">No notifications yet.</p>
          </div>
        ) : (
          <div className="divide-y">
            {items.map((n) => (
              <button
                key={n._id}
                onClick={() => openNotification(n)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-1 w-2 h-2 rounded-full ${
                      n.isRead ? "bg-gray-200" : "bg-orange-500"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-gray-900">
                        {n.title || "Notification"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {n.createdAt ? timeAgo(n.createdAt) : ""}
                      </p>
                    </div>
                    {n.message ? (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {n.message}
                      </p>
                    ) : null}
                    {n.scope ? (
                      <p className="text-[11px] text-gray-400 mt-1">
                        Scope: {n.scope}
                      </p>
                    ) : null}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
