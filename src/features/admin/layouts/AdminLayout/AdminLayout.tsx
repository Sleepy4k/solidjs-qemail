import { Component, JSX, createMemo, createSignal, Show } from 'solid-js';
import { A, useLocation } from '@solidjs/router';
import { adminStore } from '../../stores/admin.store';
import { ROUTES } from '../../../../shared/constants/routes.constant';
import * as animations from '../../../../shared/utils/animation.util';
import { ConfirmDialog, useConfirmDialog } from '../../../../shared/components/ConfirmDialog';
import Logo from '../../../../assets/images/logo.png';

export interface AdminLayoutProps {
  children: JSX.Element;
}

const AdminLayout: Component<AdminLayoutProps> = (props) => {
  const location = useLocation();
  const adminUser = createMemo(() => adminStore.getAdminUser());
  const { isOpen, config, confirm, handleConfirm, handleCancel } = useConfirmDialog();
  const [sidebarOpen, setSidebarOpen] = createSignal(false);

  let sidebarRef: HTMLDivElement | undefined;
  let mainRef: HTMLDivElement | undefined;

  setTimeout(() => {
    if (sidebarRef) animations.slideInLeft(sidebarRef, { duration: 0.5 });
    if (mainRef) animations.fadeIn(mainRef, { duration: 0.6, delay: 0.2 });
  }, 0);

  const handleLogout = () => {
    confirm({
      title: 'Logout Confirmation',
      message: 'Are you sure you want to logout? You will need to login again to access the admin panel.',
      variant: 'warning',
      onConfirm: () => {
        adminStore.logout();
      },
    });
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: ROUTES.ADMIN.DASHBOARD,
      icon: (
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: 'Domains',
      path: ROUTES.ADMIN.DOMAINS,
      icon: (
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
    },
    {
      label: 'Accounts',
      path: ROUTES.ADMIN.ACCOUNTS,
      icon: (
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      label: 'Settings',
      path: ROUTES.ADMIN.SETTINGS,
      icon: (
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const SidebarContent = () => (
    <>
      <div class="p-5 border-b border-gray-200">
        <a href="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div class="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
            <img src={Logo} alt="QEmail Logo" class="w-6 h-6" loading="lazy" style={{ filter: 'brightness(0) invert(1)' }} />
          </div>
          <div>
            <h1 class="font-bold text-gray-900">QEmail</h1>
            <p class="text-xs text-gray-600">Admin Panel</p>
          </div>
        </a>
      </div>

      <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <A
            href={item.path}
            onClick={() => setSidebarOpen(false)}
            class={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-primary-50 text-primary-700 shadow-sm'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </A>
        ))}
      </nav>

      <div class="p-4 border-t border-gray-200">
        <div class="flex items-center gap-3 px-3 py-3 bg-gray-50 rounded-lg mb-2">
          <div class="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {adminUser()?.username.charAt(0).toUpperCase()}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">{adminUser()?.username}</p>
            <p class="text-xs text-gray-600 truncate">{adminUser()?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          class="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div class="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside
        ref={sidebarRef}
        class="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col shadow-sm flex-shrink-0"
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      <Show when={sidebarOpen()}>
        <div
          class="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
        <aside class="fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 flex flex-col shadow-xl lg:hidden">
          <SidebarContent />
        </aside>
      </Show>

      {/* Main content */}
      <div class="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header class="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            class="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <a href="/" class="flex items-center gap-2">
            <div class="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <img src={Logo} alt="QEmail" class="w-5 h-5" loading="lazy" style={{ filter: 'brightness(0) invert(1)' }} />
            </div>
            <span class="font-bold text-gray-900 text-sm">QEmail Admin</span>
          </a>
          <div class="w-9" /> {/* spacer */}
        </header>

        <main ref={mainRef} class="flex-1 overflow-auto">
          <div class="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-7xl mx-auto">
            {props.children}
          </div>
        </main>
      </div>

      <ConfirmDialog
        isOpen={isOpen()}
        title={config().title}
        message={config().message}
        confirmText="Logout"
        cancelText="Cancel"
        variant={config().variant}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default AdminLayout;
