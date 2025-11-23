'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import {
  HomeIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  FolderIcon,
  BellIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  ChartBarIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  UsersIcon,
  BuildingOfficeIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';

interface SidebarLink {
  name: string;
  href: string;
  icon: any;
  badge?: number;
  adminOnly?: boolean;
}

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  const studentLinks: SidebarLink[] = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'My Applications', href: '/dashboard/applications', icon: DocumentTextIcon, badge: 3 },
    { name: 'Browse Courses', href: '/courses', icon: AcademicCapIcon },
    { name: 'Documents', href: '/dashboard/documents', icon: FolderIcon },
    { name: 'Messages', href: '/dashboard/messages', icon: ChatBubbleLeftRightIcon, badge: 2 },
    { name: 'Appointments', href: '/dashboard/appointments', icon: CalendarIcon },
    { name: 'Notifications', href: '/dashboard/notifications', icon: BellIcon, badge: 5 },
    { name: 'Help & Support', href: '/dashboard/support', icon: QuestionMarkCircleIcon },
  ];

  const adminLinks: SidebarLink[] = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Applications', href: '/admin/applications', icon: ClipboardDocumentListIcon, badge: 12 },
    { name: 'Students', href: '/admin/students', icon: UsersIcon },
    { name: 'Universities', href: '/admin/universities', icon: BuildingOfficeIcon },
    { name: 'Courses', href: '/admin/courses', icon: AcademicCapIcon },
    { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
    { name: 'Messages', href: '/admin/messages', icon: ChatBubbleLeftRightIcon, badge: 8 },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <>
      {/* User Profile Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-700 rounded-xl flex items-center justify-center shadow-soft">
            <UserCircleIcon className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-semibold rounded-full ${
              isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {isAdmin ? 'Admin' : 'Student'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className={`group flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                active
                  ? 'bg-gradient-to-r from-primary to-primary-700 text-white shadow-soft'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`h-5 w-5 ${active ? 'text-white' : 'text-gray-400 group-hover:text-primary'}`} />
                <span>{link.name}</span>
              </div>
              {link.badge && link.badge > 0 && (
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                  active 
                    ? 'bg-white text-primary' 
                    : 'bg-accent text-white'
                }`}>
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Link
          href="/dashboard/profile"
          onClick={() => setIsMobileOpen(false)}
          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary rounded-xl font-medium transition-all duration-300"
        >
          <Cog6ToothIcon className="h-5 w-5 text-gray-400" />
          <span>Settings</span>
        </Link>
        <button
          onClick={() => {
            logout();
            setIsMobileOpen(false);
          }}
          className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all duration-300"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 p-3 bg-white rounded-xl shadow-soft-lg text-primary hover:shadow-soft-xl transition-all duration-300"
      >
        {isMobileOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center px-6 border-b border-gray-200">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-accent to-accent-600 rounded-xl flex items-center justify-center shadow-glow-accent">
              <AcademicCapIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-primary">SSS</span>
          </Link>
        </div>

        <SidebarContent />
      </aside>
    </>
  );
}
