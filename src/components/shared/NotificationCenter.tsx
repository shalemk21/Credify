'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  CheckCircle2,
  Briefcase,
  ShieldCheck,
  UserCheck,
  Settings,
  X,
  CheckCheck
} from 'lucide-react';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  link: string;
  read: boolean;
  type: 'hire' | 'vouch' | 'talent' | 'admin';
}

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Hire Request Accepted',
    message: 'Ramesh K. accepted your hire request for Whitefield Site',
    time: '10m ago',
    link: '/employer/hire-requests',
    read: false,
    type: 'hire',
  },
  {
    id: 'notif-2',
    title: 'Verified Vouch Submitted',
    message: 'Sobha Quality Auditor submitted a verified vouch for Shankar M.',
    time: '45m ago',
    link: '/employer',
    read: false,
    type: 'vouch',
  },
  {
    id: 'notif-3',
    title: 'New Talent Registered',
    message: 'New Electrician registered in HSR Layout with Gold Tier',
    time: '2h ago',
    link: '/employer',
    read: false,
    type: 'talent',
  },
  {
    id: 'notif-4',
    title: 'Assessor Status Updated',
    message: 'Assessor verification status updated by Admin',
    time: '5h ago',
    link: '/admin',
    read: false,
    type: 'admin',
  },
];

interface NotificationCenterProps {
  buttonClassName?: string;
  badgeClassName?: string;
  align?: 'left' | 'right';
  drawerMode?: 'dropdown' | 'drawer';
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  buttonClassName = '',
  badgeClassName = '',
  align = 'right',
  drawerMode = 'dropdown',
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load / sync with localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('credify_notifications');
      if (saved) {
        setNotifications(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const saveNotifications = (updated: AppNotification[]) => {
    setNotifications(updated);
    try {
      localStorage.setItem('credify_notifications', JSON.stringify(updated));
    } catch {}
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const handleNotificationClick = (item: AppNotification) => {
    const updated = notifications.map((n) =>
      n.id === item.id ? { ...n, read: true } : n
    );
    saveNotifications(updated);
    setIsOpen(false);
    if (item.link) {
      router.push(item.link);
    }
  };

  // Close when clicking outside in dropdown mode
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'hire':
        return <Briefcase className="w-4 h-4 text-orange" />;
      case 'vouch':
        return <ShieldCheck className="w-4 h-4 text-green" />;
      case 'talent':
        return <UserCheck className="w-4 h-4 text-navy-primary" />;
      case 'admin':
        return <Settings className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 text-slate-500 hover:text-navy-primary rounded-full hover:bg-slate-100 transition-colors focus:outline-none ${buttonClassName}`}
        aria-label="Notifications"
        title="View Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span
            className={`absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-orange text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white shadow-sm animate-pulse ${badgeClassName}`}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown / Modal Content */}
      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-50 sm:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div
            className={`fixed sm:absolute bottom-0 sm:bottom-auto sm:top-full ${
              align === 'right' ? 'sm:right-0' : 'sm:left-0'
            } left-0 sm:left-auto w-full sm:w-80 md:w-96 bg-white sm:rounded-2xl rounded-t-3xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150`}
          >
            {/* Header */}
            <div className="p-4 bg-navy-primary text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-orange" />
                <h3 className="font-extrabold text-sm tracking-tight">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-orange text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-[11px] text-blue-200 hover:text-white font-semibold flex items-center gap-1 transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No notifications yet.
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                      !n.read ? 'bg-orange-light/20' : 'bg-white'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <p className={`text-xs font-bold truncate ${!n.read ? 'text-navy-primary font-black' : 'text-slate-700'}`}>
                          {n.title}
                        </p>
                        <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                          {n.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-content-secondary line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-orange mt-2 shrink-0"></span>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 font-semibold">
                Credify Real-Time Site Alerts
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

