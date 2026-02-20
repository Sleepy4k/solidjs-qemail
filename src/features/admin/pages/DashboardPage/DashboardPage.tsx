import { Component, createResource, Show, For, onMount } from "solid-js";
import gsap from "gsap";
import { Card } from "../../../../shared/components/ui/Card";
import { adminApiService } from "../../services/admin-api.service";

const DashboardPage: Component = () => {
  const [stats] = createResource(() => adminApiService.getStats());
  const [health] = createResource(() => adminApiService.getHealth());

  let headerRef: HTMLDivElement | undefined;
  let statsRef: HTMLDivElement | undefined;

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  onMount(() => {
    if (headerRef) {
      gsap.fromTo(
        headerRef,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      );
    }
    if (statsRef) {
      gsap.fromTo(
        statsRef.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.2,
          ease: "power2.out",
        },
      );
    }
  });

  const statsConfig = [
    {
      label: "Total Accounts",
      getValue: () => stats()?.total_accounts || 0,
      color: "from-main-red to-red-600",
    },
    {
      label: "Active Accounts",
      getValue: () => stats()?.active_accounts || 0,
      color: "from-green-500 to-green-600",
    },
    {
      label: "Total Emails",
      getValue: () => stats()?.total_emails || 0,
      color: "from-orange-500 to-red-500",
    },
    {
      label: "Total Domains",
      getValue: () => stats()?.total_domains || 0,
      color: "from-red-400 to-main-darkRed",
    },
  ];

  return (
    <div class="space-y-6 sm:space-y-8">
      <div ref={headerRef}>
        <h1 class="text-xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="mt-1 sm:mt-2 text-xs sm:text-base text-main-gray">
          Welcome back! Here's an overview of your email service
        </p>
      </div>

      <Show
        when={!stats.loading && stats()}
        fallback={
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {[1, 2, 3, 4].map(() => (
              <Card>
                <div class="animate-pulse">
                  <div class="h-3 bg-gray-200 rounded w-20 mb-3"></div>
                  <div class="h-8 bg-gray-200 rounded w-14"></div>
                </div>
              </Card>
            ))}
          </div>
        }
      >
        <div
          ref={statsRef}
          class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
        >
          <For each={statsConfig}>
            {(stat) => (
              <Card>
                <div
                  class={`bg-gradient-to-br ${stat.color} rounded-xl p-4 sm:p-6 text-white`}
                >
                  <p class="text-2xl sm:text-3xl font-bold mb-1">
                    {stat.getValue().toLocaleString()}
                  </p>
                  <p class="text-white/80 text-xs sm:text-sm">{stat.label}</p>
                </div>
              </Card>
            )}
          </For>
        </div>
      </Show>

      <div class="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <h3 class="text-sm sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
            System Status
          </h3>
          <Show
            when={!health.loading && health()}
            fallback={
              <div class="space-y-3">
                {[1, 2, 3].map(() => (
                  <div class="animate-pulse h-14 sm:h-16 bg-gray-100 rounded-xl"></div>
                ))}
              </div>
            }
          >
            <div class="space-y-2 sm:space-y-3">
              <div class="flex items-center justify-between p-3 sm:p-4 bg-green-50 border border-green-200 rounded-xl">
                <div class="flex items-center gap-2 sm:gap-3">
                  <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
                  <span class="font-medium text-gray-900 text-sm sm:text-base">
                    API Service
                  </span>
                </div>
                <span class="text-xs sm:text-sm font-semibold text-green-700">
                  ● {health()?.status === "ok" ? "Operational" : "Down"}
                </span>
              </div>
              <div class="flex items-center justify-between p-3 sm:p-4 bg-green-50 border border-green-200 rounded-xl">
                <div class="flex items-center gap-2 sm:gap-3">
                  <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
                  <span class="font-medium text-gray-900 text-sm sm:text-base">
                    Database
                  </span>
                </div>
                <span class="text-xs sm:text-sm font-semibold text-green-700">
                  ● Operational
                </span>
              </div>
              <div class="flex items-center justify-between p-3 sm:p-4 bg-green-50 border border-green-200 rounded-xl">
                <div class="flex items-center gap-2 sm:gap-3">
                  <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
                  <span class="font-medium text-gray-900 text-sm sm:text-base">
                    Redis Cache
                  </span>
                </div>
                <span class="text-xs sm:text-sm font-semibold text-green-700">
                  ● Operational
                </span>
              </div>
            </div>
          </Show>
        </Card>

        <Card>
          <h3 class="text-sm sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
            Quick Stats
          </h3>
          <Show
            when={!stats.loading && !health.loading && stats() && health()}
            fallback={
              <div class="space-y-3 sm:space-y-4">
                {[1, 2, 3].map(() => (
                  <div class="animate-pulse h-16 sm:h-20 bg-gray-100 rounded-xl"></div>
                ))}
              </div>
            }
          >
            <div class="space-y-3 sm:space-y-4">
              <div class="p-3 sm:p-4 bg-gradient-to-r from-main-red/10 to-red-50 border border-main-red/20 rounded-xl">
                <p class="text-xs sm:text-sm text-main-gray mb-1">
                  Active Accounts Rate
                </p>
                <p class="text-xl sm:text-2xl font-bold text-main-red">
                  {stats()?.total_accounts
                    ? (
                        (stats()!.active_accounts / stats()!.total_accounts) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
              <div class="p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                <p class="text-xs sm:text-sm text-main-gray mb-1">
                  System Uptime
                </p>
                <p class="text-xl sm:text-2xl font-bold text-green-700">
                  {health()?.uptime ? formatUptime(health()!.uptime) : "N/A"}
                </p>
              </div>
              <div class="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                <p class="text-xs sm:text-sm text-main-gray mb-1">
                  Emails per Account
                </p>
                <p class="text-xl sm:text-2xl font-bold text-blue-700">
                  {stats()?.total_accounts && stats()!.total_accounts > 0
                    ? (stats()!.total_emails / stats()!.total_accounts).toFixed(
                        1,
                      )
                    : 0}
                </p>
              </div>
            </div>
          </Show>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
