import { defineConfig, loadEnv } from "vite";
import solid from "vite-plugin-solid";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [solid()],
    resolve: {
      alias: {
        "@shared": path.resolve(__dirname, "src/shared"),
        "@features": path.resolve(__dirname, "src/features"),
        "@pages": path.resolve(__dirname, "src/pages"),
        "@assets": path.resolve(__dirname, "src/assets"),
      },
    },
    server: {
      host: true,
      port: 5173,
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:3000",
          changeOrigin: true,
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Vendors
            if (
              id.includes("node_modules/solid-js") ||
              id.includes("node_modules/@solidjs")
            ) {
              return "vendor-solid";
            }
            if (id.includes("node_modules/gsap")) {
              return "vendor-gsap";
            }
            if (id.includes("node_modules/nprogress")) {
              return "vendor-nprogress";
            }

            // Shared utilities
            if (id.includes("shared/utils/animation.util"))
              return "util-animation";
            if (id.includes("shared/utils/format.util")) return "util-format";
            if (id.includes("shared/utils/debounce.util"))
              return "util-debounce";

            // Shared hooks
            if (id.includes("shared/hooks/use-animation.hook"))
              return "hook-animation";

            // Shared config / constants
            if (
              id.includes("shared/config/") ||
              id.includes("shared/constants/")
            ) {
              return "shared-config";
            }

            // Shared services
            if (id.includes("shared/services/http.service"))
              return "service-http";
            if (id.includes("shared/services/email.service"))
              return "service-email";

            // Shared stores
            if (id.includes("shared/stores/email.store")) return "store-email";
            if (id.includes("shared/stores/theme.store")) return "store-theme";

            // Shared UI components
            if (id.includes("shared/components/ui/Button")) return "ui-button";
            if (id.includes("shared/components/ui/Card")) return "ui-card";
            if (id.includes("shared/components/ui/Input")) return "ui-input";
            if (id.includes("shared/components/ui/Modal")) return "ui-modal";
            if (id.includes("shared/components/ui/Alert")) return "ui-alert";
            if (id.includes("shared/components/ui/SearchableSelect"))
              return "ui-searchable-select";
            if (id.includes("shared/components/ui/Pagination"))
              return "ui-pagination";

            // Shared components (one chunk each)
            if (id.includes("shared/components/Navigation"))
              return "component-navigation";
            if (id.includes("shared/components/SafeEmailRenderer"))
              return "component-safe-renderer";
            if (id.includes("shared/components/AttachmentList"))
              return "component-attachment";
            if (id.includes("shared/components/Skeleton"))
              return "component-skeleton";
            if (id.includes("shared/components/ConfirmDialog"))
              return "component-confirm-dialog";
            if (id.includes("shared/components/ThemeToggle"))
              return "component-theme-toggle";

            // Shared layouts / guards
            if (id.includes("shared/layouts/")) return "shared-layouts";
            if (id.includes("shared/guards/")) return "shared-guards";

            // Admin stores & services
            if (id.includes("features/admin/stores/")) return "admin-store";
            if (id.includes("features/admin/services/"))
              return "admin-services";

            // Admin components
            if (id.includes("features/admin/components/StatsCard"))
              return "admin-stats-card";
            if (id.includes("features/admin/components/DomainList"))
              return "admin-domain-list";
            if (id.includes("features/admin/components/DomainForm"))
              return "admin-domain-form";

            // Admin layout
            if (id.includes("features/admin/layouts/")) return "admin-layout";

            // Landing components
            if (id.includes("features/landing/components/"))
              return "landing-components";
          },
        },
      },
      chunkSizeWarningLimit: 80,
    },
  };
});
