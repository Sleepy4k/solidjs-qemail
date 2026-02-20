import {
  Component,
  For,
  Show,
  createSignal,
  createMemo,
  onMount,
  onCleanup,
} from "solid-js";
import { Portal } from "solid-js/web";

export interface SearchableSelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  class?: string;
  error?: string;
  helperText?: string;
}

export const SearchableSelect: Component<SearchableSelectProps> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [search, setSearch] = createSignal("");
  const [pos, setPos] = createSignal({ top: 0, left: 0, width: 0 });

  let containerRef: HTMLDivElement | undefined;
  let searchRef: HTMLInputElement | undefined;
  let dropdownRef: HTMLDivElement | undefined;

  const selectedLabel = createMemo(
    () => props.options.find((o) => o.value === props.value)?.label ?? "",
  );

  const filtered = createMemo(() => {
    const q = search().toLowerCase().trim();
    return q
      ? props.options.filter((o) => o.label.toLowerCase().includes(q))
      : props.options;
  });

  const updatePos = () => {
    if (!containerRef) return;
    const rect = containerRef.getBoundingClientRect();
    setPos({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
  };

  const open = () => {
    if (props.disabled) return;
    updatePos();
    setIsOpen(true);
    setTimeout(() => searchRef?.focus(), 10);
  };

  const close = () => {
    setIsOpen(false);
    setSearch("");
  };

  const select = (value: string | number) => {
    props.onChange?.(value);
    close();
  };

  const handleOutside = (e: MouseEvent) => {
    const target = e.target as Node;
    if (
      containerRef &&
      !containerRef.contains(target) &&
      dropdownRef &&
      !dropdownRef.contains(target)
    ) {
      close();
    }
  };

  onMount(() => {
    document.addEventListener("mousedown", handleOutside);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    onCleanup(() => {
      document.removeEventListener("mousedown", handleOutside);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    });
  });

  return (
    <div ref={containerRef} class={`relative ${props.class ?? ""}`}>
      <Show when={props.label}>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {props.label}
        </label>
      </Show>

      <button
        type="button"
        onClick={() => (isOpen() ? close() : open())}
        disabled={props.disabled}
        class={`w-full px-4 py-2.5 text-left border rounded-lg flex items-center justify-between gap-2 transition-all duration-150 text-sm ${
          props.error
            ? "border-red-500 focus:ring-red-500"
            : isOpen()
              ? "border-main-red ring-2 ring-main-red/20"
              : "border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
        } ${
          props.disabled
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-900 cursor-pointer"
        }`}
      >
        <span class={`truncate ${!selectedLabel() ? "text-gray-400" : ""}`}>
          {selectedLabel() || props.placeholder || "Select..."}
        </span>
        <svg
          class={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
            isOpen() ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <Show when={isOpen()}>
        <Portal>
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: `${pos().top}px`,
              left: `${pos().left}px`,
              width: `${pos().width}px`,
              "z-index": "9999",
            }}
            class="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          >
            <div class="p-2 border-b border-gray-100">
              <div class="relative">
                <svg
                  class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search..."
                  class="w-full pl-7 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-main-red/30 focus:border-main-red"
                  value={search()}
                  onInput={(e) => setSearch(e.currentTarget.value)}
                  onKeyDown={(e) => e.key === "Escape" && close()}
                />
              </div>
            </div>

            <div class="max-h-52 overflow-y-auto">
              <Show
                when={filtered().length > 0}
                fallback={
                  <p class="px-4 py-3 text-sm text-gray-400 text-center">
                    No options found
                  </p>
                }
              >
                <For each={filtered()}>
                  {(option) => (
                    <button
                      type="button"
                      disabled={option.disabled}
                      onClick={() => select(option.value)}
                      class={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        props.value === option.value
                          ? "bg-primary-50 text-primary-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      } ${option.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      {option.label}
                    </button>
                  )}
                </For>
              </Show>
            </div>
          </div>
        </Portal>
      </Show>

      <Show when={props.error}>
        <p class="mt-1 text-sm text-red-600">{props.error}</p>
      </Show>
      <Show when={!props.error && props.helperText}>
        <p class="mt-1 text-sm text-gray-500">{props.helperText}</p>
      </Show>
    </div>
  );
};

export default SearchableSelect;
