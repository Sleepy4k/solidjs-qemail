import { Component, Show } from "solid-js";
import { themeStore } from "../stores/theme.store";

interface ThemeToggleProps {
  class?: string;
  showLabel?: boolean;
}

export const ThemeToggle: Component<ThemeToggleProps> = (props) => {
  const isDark = () => themeStore.theme() === "dark";

  return (
    <button
      type="button"
      onClick={themeStore.toggleTheme}
      class={`relative inline-flex items-center justify-center gap-2 w-9 h-9 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-navy-300 dark:hover:text-white dark:hover:bg-navy-700 flex-shrink-0 ${props.class ?? ""}`}
      aria-label={isDark() ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark() ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Show
        when={isDark()}
        fallback={
          /* Sun icon – light mode */
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="5" stroke-width="2" />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
            />
          </svg>
        }
      >
        {/* Moon icon – dark mode */}
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
          />
        </svg>
      </Show>
      <Show when={props.showLabel}>
        <span class="text-sm font-medium">{isDark() ? "Light" : "Dark"}</span>
      </Show>
    </button>
  );
};
