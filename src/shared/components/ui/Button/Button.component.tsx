import { Component, JSX, splitProps, mergeProps } from "solid-js";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: JSX.Element;
  iconPosition?: "left" | "right";
}

const Button: Component<ButtonProps> = (props) => {
  const merged = mergeProps(
    {
      variant: "primary" as ButtonVariant,
      size: "md" as ButtonSize,
      loading: false,
      fullWidth: false,
      iconPosition: "left" as "left" | "right",
    },
    props,
  );

  const [local, others] = splitProps(merged, [
    "variant",
    "size",
    "loading",
    "fullWidth",
    "icon",
    "iconPosition",
    "children",
    "class",
    "disabled",
  ]);

  let buttonRef: HTMLButtonElement | undefined;

  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      "bg-main-red hover:bg-main-darkRed text-white shadow-sm hover:shadow-md",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900 shadow-sm",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md",
    success:
      "bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
  };

  const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-main-red focus:ring-offset-2";

  const handleClick = (
    e: MouseEvent & { currentTarget: HTMLButtonElement },
  ) => {
    if (buttonRef) {
      const rect = buttonRef.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement("span");
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        width: 10px;
        height: 10px;
        left: ${x}px;
        top: ${y}px;
        transform: translate(-50%, -50%) scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      `;

      buttonRef.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    }

    if (others.onClick && !local.disabled && !local.loading) {
      (others.onClick as any)(e);
    }
  };

  return (
    <button
      ref={buttonRef}
      class={`
        ${baseClasses}
        ${variantClasses[local.variant]}
        ${sizeClasses[local.size]}
        ${local.fullWidth ? "w-full" : ""}
        ${local.class || ""}
        relative overflow-hidden
      `}
      disabled={local.disabled || local.loading}
      onClick={handleClick}
      {...others}
    >
      {local.loading && (
        <svg
          class="animate-spin -ml-1 mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {!local.loading && local.icon && local.iconPosition === "left" && (
        <span class="mr-2 flex items-center">{local.icon}</span>
      )}

      <span>{local.children}</span>

      {!local.loading && local.icon && local.iconPosition === "right" && (
        <span class="ml-2 flex items-center">{local.icon}</span>
      )}
    </button>
  );
};

export default Button;
