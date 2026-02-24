import { Component, createResource, Show, For, onMount } from "solid-js";
import gsap from "gsap";
import { Card } from "@shared/components/ui/Card";
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
      numberColor: "text-primary-600 dark:text-primary-400",
      iconBg: "bg-primary-100 dark:bg-primary-900/30",
      iconColor: "text-primary-600 dark:text-primary-400",
      icon: (
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: "Active Accounts",
      getValue: () => stats()?.active_accounts || 0,
      numberColor: "text-green-600 dark:text-green-400",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
      icon: (
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Total Emails",
      getValue: () => stats()?.total_emails || 0,
      numberColor: "text-orange-600 dark:text-orange-400",
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
      iconColor: "text-orange-600 dark:text-orange-400",
      icon: (
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: "Total Domains",
      getValue: () => stats()?.total_domains || 0,
      numberColor: "text-primary-600 dark:text-primary-400",
      iconBg: "bg-primary-100 dark:bg-primary-900/30",
      iconColor: "text-primary-600 dark:text-primary-400",
      icon: (
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
    },
  ];

  return (
    <div class="space-y-6 sm:space-y-8">
      <div ref={headerRef}>
        <h1 class="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p class="mt-1 sm:mt-2 text-xs sm:text-base text-gray-500 dark:text-navy-300">
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
                <div class="flex items-start justify-between gap-3">
                  <div class="flex-1 min-w-0">
                    <p class="text-xs sm:text-sm text-gray-500 dark:text-navy-300 mb-1 leading-tight">
                      {stat.label}
                    </p>
                    <p class={`text-2xl sm:text-3xl font-bold tabular-nums ${stat.numberColor}`}>
                      {stat.getValue().toLocaleString()}
                    </p>
                  </div>
                  <div class={`${stat.iconBg} ${stat.iconColor} p-2.5 rounded-xl flex-shrink-0`}>
                    {stat.icon}
                  </div>
                </div>
              </Card>
            )}
          </For>
        </div>
      </Show>

      <div class="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <h3 class="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
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
              <div class="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-navy-700 border border-gray-200 dark:border-navy-600 rounded-xl">
                <div class="flex items-center gap-2 sm:gap-3">
                  <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
                  <span class="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                    API Service
                  </span>
                </div>
                <span class="text-xs sm:text-sm font-semibold text-green-600 dark:text-green-400">
                  ● {health()?.status === "ok" ? "Operational" : "Down"}
                </span>
              </div>
              <div class="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-navy-700 border border-gray-200 dark:border-navy-600 rounded-xl">
                <div class="flex items-center gap-2 sm:gap-3">
                  <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
                  <span class="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                    Database
                  </span>
                </div>
                <span class="text-xs sm:text-sm font-semibold text-green-600 dark:text-green-400">
                  ● Operational
                </span>
              </div>
              <div class="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-navy-700 border border-gray-200 dark:border-navy-600 rounded-xl">
                <div class="flex items-center gap-2 sm:gap-3">
                  <div class="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
                  <span class="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                    Redis Cache
                  </span>
                </div>
                <span class="text-xs sm:text-sm font-semibold text-green-600 dark:text-green-400">
                  ● Operational
                </span>
              </div>
            </div>
          </Show>
        </Card>

        <Card>
          <h3 class="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
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
              <div class="p-3 sm:p-4 bg-gray-50 dark:bg-navy-700 border border-gray-200 dark:border-navy-600 rounded-xl">
                <p class="text-xs sm:text-sm text-gray-500 dark:text-navy-300 mb-1">
                  Active Accounts Rate
                </p>
                <p class="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {stats()?.total_accounts
                    ? (
                        (stats()!.active_accounts / stats()!.total_accounts) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
              <div class="p-3 sm:p-4 bg-gray-50 dark:bg-navy-700 border border-gray-200 dark:border-navy-600 rounded-xl">
                <p class="text-xs sm:text-sm text-gray-500 dark:text-navy-300 mb-1">
                  System Uptime
                </p>
                <p class="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                  {health()?.uptime ? formatUptime(health()!.uptime) : "N/A"}
                </p>
              </div>
              <div class="p-3 sm:p-4 bg-gray-50 dark:bg-navy-700 border border-gray-200 dark:border-navy-600 rounded-xl">
                <p class="text-xs sm:text-sm text-gray-500 dark:text-navy-300 mb-1">
                  Emails per Account
                </p>
                <p class="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400">
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
