import { Component, Show } from 'solid-js';
import { A } from '@solidjs/router';
import Logo from '../../assets/images/logo.png';

interface NavigationProps {
  showAdminLink?: boolean;
  showHomeLink?: boolean;
  currentPage?: string;
}

export const Navigation: Component<NavigationProps> = (props) => {
  return (
    <nav class="bg-surface-DEFAULT border-b border-border-DEFAULT sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <A href="/" class="flex items-center space-x-2 group">
              <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform">
                <img
                  src={Logo}
                  alt="QEmail Logo"
                  class="w-6 h-6"
                  loading="lazy"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </div>
              <div>
                <h1 class="text-xl font-bold text-gray-900">QEmail</h1>
                <p class="text-xs text-gray-500">Temporary Email Service</p>
              </div>
            </A>
          </div>

          <div class="flex items-center space-x-6">
            <Show when={props.showHomeLink !== false}>
              <A
                href="/"
                class="text-gray-700 hover:text-primary-500 font-medium transition-colors flex items-center gap-2"
                classList={{ "text-primary-500": props.currentPage === "home" }}
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Home
              </A>
            </Show>

            <A
              href="/email/login"
              class="text-gray-700 hover:text-primary-500 font-medium transition-colors flex items-center gap-2"
              classList={{
                "text-primary-500": props.currentPage === "email-login",
              }}
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              My Inbox
            </A>

            <Show when={props.showAdminLink !== false}>
              <A
                href="/admin/login"
                class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-medium transition-colors flex items-center gap-2"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
                Admin
              </A>
            </Show>
          </div>
        </div>
      </div>
    </nav>
  );
};
