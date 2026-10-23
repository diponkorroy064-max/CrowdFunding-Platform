import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCircle, ExternalLink, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';

const NotificationDropdown = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch notifications for the logged-in user
  const fetchNotifications = async () => {
    if (!user?.email) return;
    try {
      const res = await apiClient.get(`/notifications/${user.email}`);
      setNotifications(res.data || []);
    } catch (err) {
      console.warn('Could not load notifications:', err.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, [user?.email]);

  // Handle clicking outside to dismiss the floating pop-up
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = async (notif) => {
    try {
      if (!notif.isRead && notif._id) {
        await apiClient.patch(`/notifications/${notif._id}/read`);
        setNotifications((prev) =>
          prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
        );
      }
    } catch (e) {
      console.error(e);
    }
    setIsOpen(false);
    if (notif.actionRoute) {
      navigate(notif.actionRoute);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all focus:outline-none"
        title="Notifications"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Floating Pop-up */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 z-50 overflow-hidden border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <h3 className="font-semibold text-sm">Notifications</h3>
            </div>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium">
              {unreadCount} unread
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">
                <p>No notifications yet.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id || Math.random()}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3 ${
                    !n.isRead ? 'bg-emerald-50/40' : ''
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    <span className="inline-flex p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                      <CheckCircle className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-800 font-medium leading-relaxed">
                      {n.message}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{n.time ? new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}</span>
                      {n.actionRoute && (
                        <span className="text-emerald-600 flex items-center gap-0.5 hover:underline">
                          View details <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
