import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import {
  fetchAdminNotifications,
  markAdminNotificationsRead,
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

export default function AdminNotificationsPopover({
  open,
  onClose,
  token,
  onUnreadChange,
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);

  const unreadIds = useMemo(
    () => items.filter((n) => !n.isRead).map((n) => n._id),
    [items],
  );

  const load = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await fetchAdminNotifications(token, 1, 20);
      setItems(data.items || []);
      setUnread(Number(data.unread || 0));
      onUnreadChange?.(Number(data.unread || 0));
    } catch (e) {
      // keep silent (or toast if you want)
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
      await markAdminNotificationsRead(token, { all: true });
      // update UI immediately
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
    // mark this one read (if unread)
    if (!n.isRead && token) {
      try {
        await markAdminNotificationsRead(token, { ids: [n._id] });
        setItems((prev) =>
          prev.map((x) => (x._id === n._id ? { ...x, isRead: true } : x)),
        );
        setUnread((u) => Math.max(0, u - 1));
        onUnreadChange?.((u) => Math.max(0, u - 1));
      } catch {}
    }

    if (n.link) navigate(n.link);
    onClose?.();
  };

  if (!open) return null;

  return (
    <div
      className="
    fixed inset-x-3 top-[72px] sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:mt-2 w-auto sm:w-[360px] bg-white border rounded-xl shadow-lg z-50 overflow-hidden">
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

          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-[420px] overflow-auto">
        {loading ? (
          <div className="p-4 text-sm text-gray-600">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-4 text-sm text-gray-600">No notifications yet.</div>
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
                        {n.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {timeAgo(n.createdAt)}
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
