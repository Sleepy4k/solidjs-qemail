import { Component, Show, createSignal, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';
import { A, useLocation } from '@solidjs/router';
import Logo from '../../assets/images/logo.png';

interface NavigationProps {
  showAdminLink?: boolean;
  showHomeLink?: boolean;
  currentPage?: string;
}

export const Navigation: Component<NavigationProps> = (props) => {
  const [menuOpen, setMenuOpen] = createSignal(false);
  const location = useLocation();

  // Close menu on route change
  const closeMenu = () => setMenuOpen(false);

  // Close on Escape key
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeMenu();
  };

  document.addEventListener('keydown', handleKeyDown);
  onCleanup(() => document.removeEventListener('keydown', handleKeyDown));

  const navLinks = () => [
    props.showHomeLink !== false
      ? { href: '/', label: 'Home', page: 'home', icon: <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> }
      : null,
    { href: '/email/login', label: 'My Inbox', page: 'email-login', icon: <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
    props.showAdminLink !== false
      ? { href: '/admin/login', label: 'Admin Panel', page: 'admin', isButton: true, icon: <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg> }
      : null,
  ].filter(Boolean) as { href: string; label: string; page: string; isButton?: boolean; icon: any }[];

  return (
    <>
      <nav class="bg-surface-DEFAULT border-b border-border-DEFAULT sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-14">

            {/* Logo */}
            <A href="/" class="flex items-center gap-2 group flex-shrink-0">
              <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform">
                <img src={Logo} alt="QEmail Logo" class="w-4 h-4" loading="lazy" style={{ filter: 'brightness(0) invert(1)' }} />
              </div>
              <div>
                <h1 class="text-sm font-bold text-gray-900 leading-tight">QEmail</h1>
                <p class="text-xs text-gray-500 leading-tight hidden sm:block">Temporary Email</p>
              </div>
            </A>

            {/* Desktop nav links */}
            <div class="hidden sm:flex items-center gap-1 lg:gap-2">
              {navLinks().map((link) =>
                link.isButton ? (
                  <A
                    href={link.href}
                    onClick={closeMenu}
                    class="flex items-center gap-2 px-3 lg:px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-medium transition-colors text-sm"
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </A>
                ) : (
                  <A
                    href={link.href}
                    onClick={closeMenu}
                    class="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors text-sm text-gray-700 hover:text-primary-600 hover:bg-gray-100"
                    classList={{ 'text-primary-600 bg-primary-50': props.currentPage === link.page }}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </A>
                )
              )}
            </div>

            {/* Mobile hamburger button */}
            <button
              class="sm:hidden flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen())}
              aria-label={menuOpen() ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen()}
            >
              <Show
                when={menuOpen()}
                fallback={
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                }
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Show>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile dropdown - rendered into document.body via Portal to escape all stacking contexts */}
      <Show when={menuOpen()}>
        <Portal>
          {/* Backdrop - covers full screen below nav */}
          <div
            class="fixed inset-0 sm:hidden bg-black/20"
            style={{ "z-index": "9998", top: "56px" }}
            onClick={closeMenu}
          />
          {/* Dropdown panel - sits directly below nav */}
          <div
            class="fixed left-0 right-0 sm:hidden bg-white border-b border-gray-200 shadow-xl"
            style={{ "z-index": "9999", top: "56px" }}
          >
            <div class="px-4 py-3 space-y-1">
              {navLinks().map((link) =>
                link.isButton ? (
                  <A
                    href={link.href}
                    onClick={closeMenu}
                    class="flex items-center gap-3 w-full px-4 py-3 bg-primary-500 text-white rounded-xl font-medium transition-colors hover:bg-primary-600 text-sm"
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </A>
                ) : (
                  <A
                    href={link.href}
                    onClick={closeMenu}
                    class="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium transition-colors text-gray-700 hover:bg-gray-100 text-sm"
                    classList={{ 'bg-primary-50 text-primary-600': props.currentPage === link.page }}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </A>
                )
              )}
            </div>
          </div>
        </Portal>
      </Show>
    </>
  );
};
