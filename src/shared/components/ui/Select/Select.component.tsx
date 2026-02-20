import { Component, JSX, splitProps, mergeProps, Show, For } from "solid-js";

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<
  JSX.SelectHTMLAttributes<HTMLSelectElement>,
  "onChange"
> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  selectSize?: "sm" | "md" | "lg";
  options?: SelectOption[];
  onChange?: (value: string) => void;
  placeholder?: string;
}

const Select: Component<SelectProps> = (props) => {
  const merged = mergeProps(
    {
      fullWidth: true,
      selectSize: "md" as const,
      options: [] as SelectOption[],
    },
    props,
  );

  const [local, others] = splitProps(merged, [
    "label",
    "error",
    "helperText",
    "fullWidth",
    "selectSize",
    "options",
    "onChange",
    "placeholder",
    "class",
    "children",
  ]);

  let selectRef: HTMLSelectElement | undefined;

  const handleChange = () => {
    if (selectRef && local.onChange) {
      local.onChange(selectRef.value);
    }
  };

  const sizeClasses = {
    sm: "py-2 px-3 text-sm",
    md: "py-2.5 px-4 text-base",
    lg: "py-3 px-5 text-lg",
  };

  const selectClasses = () => {
    const base = `
      block rounded-lg border transition-all duration-200
      bg-white text-gray-900
      focus:outline-none focus:ring-2 focus:ring-offset-0
      disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
      ${local.fullWidth ? "w-full" : ""}
      ${sizeClasses[local.selectSize]}
    `;

    const states = local.error
      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:border-main-red focus:ring-main-red";

    return `${base} ${states} ${local.class || ""}`.trim();
  };

  return (
    <div class={local.fullWidth ? "w-full" : ""}>
      <Show when={local.label}>
        <label class="block text-sm font-medium text-gray-700 mb-1.5">
          {local.label}
        </label>
      </Show>

      <div class="relative">
        <select
          ref={selectRef}
          class={selectClasses()}
          onChange={handleChange}
          {...others}
        >
          <Show when={local.placeholder}>
            <option value="" disabled>
              {local.placeholder}
            </option>
          </Show>
          <For each={local.options}>
            {(option) => (
              <option value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            )}
          </For>
          {local.children}
        </select>
      </div>

      <Show when={local.error || local.helperText}>
        <p
          class={`mt-1.5 text-sm ${
            local.error ? "text-red-600" : "text-gray-500"
          }`}
        >
          {local.error || local.helperText}
        </p>
      </Show>
    </div>
  );
};

export default Select;
