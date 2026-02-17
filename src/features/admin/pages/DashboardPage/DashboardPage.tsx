import { Component, createResource, Show, For, onMount } from 'solid-js';
import gsap from 'gsap';
import { Card } from '../../../../shared/components/ui/Card';
import { adminApiService } from '../../services/admin-api.service';

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
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
    if (statsRef) {
      gsap.fromTo(
        statsRef.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.2, ease: 'power2.out' }
      );
    }
  });

  const statsConfig = [
    {
      label: "Total Accounts",
      getValue: () => stats()?.total_accounts || 0,
      color: "from-main-red to-red-600",
      icon: (
        <svg
          class="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      label: "Active Accounts",
      getValue: () => stats()?.active_accounts || 0,
      color: "from-green-500 to-green-600",
      icon: (
        <svg
          class="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "Total Emails",
      getValue: () => stats()?.total_emails || 0,
      color: "from-orange-500 to-red-500",
      icon: (
        <svg
          class="w-8 h-8"
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
      ),
    },
    {
      label: "Total Domains",
      getValue: () => stats()?.total_domains || 0,
      color: "from-red-400 to-main-darkRed",
      icon: (
        <svg
          class="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
      ),
    },
  ];

  return (
    <div class="space-y-8">
      <div ref={headerRef}>
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="mt-2 text-main-gray">
          Welcome back! Here's an overview of your email service
        </p>
      </div>

      <Show
        when={!stats.loading && stats()}
        fallback={
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(() => (
              <Card>
                <div class="animate-pulse">
                  <div class="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                  <div class="h-10 bg-gray-200 rounded w-16"></div>
                </div>
              </Card>
            ))}
          </div>
        }
      >
        <div
          ref={statsRef}
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <For each={statsConfig}>
            {(stat) => (
              <Card>
                <div
                  class={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white`}
                >
                  <div class="flex items-center justify-between mb-4">
                    <div class="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                      {stat.icon}
                    </div>
                  </div>
                  <div>
                    <p class="text-3xl font-bold mb-1">
                      {stat.getValue().toLocaleString()}
                    </p>
                    <p class="text-white/80 text-sm">{stat.label}</p>
                  </div>
                </div>
              </Card>
            )}
          </For>
        </div>
      </Show>

      <div class="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            System Status
          </h3>
          <Show
            when={!health.loading && health()}
            fallback={
              <div class="space-y-3">
                {[1, 2, 3].map(() => (
                  <div class="animate-pulse h-16 bg-gray-100 rounded-xl"></div>
                ))}
              </div>
            }
          >
            <div class="space-y-3">
              <div class="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                <div class="flex items-center gap-3">
                  <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span class="font-medium text-gray-900">API Service</span>
                </div>
                <span class="text-sm font-semibold text-green-700">
                  ● {health()?.status === "ok" ? "Operational" : "Down"}
                </span>
              </div>
              <div class="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                <div class="flex items-center gap-3">
                  <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span class="font-medium text-gray-900">Database</span>
                </div>
                <span class="text-sm font-semibold text-green-700">
                  ● Operational
                </span>
              </div>
              <div class="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                <div class="flex items-center gap-3">
                  <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span class="font-medium text-gray-900">Redis Cache</span>
                </div>
                <span class="text-sm font-semibold text-green-700">
                  ● Operational
                </span>
              </div>
            </div>
          </Show>
        </Card>

        <Card>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <Show
            when={!stats.loading && !health.loading && stats() && health()}
            fallback={
              <div class="space-y-4">
                {[1, 2, 3].map(() => (
                  <div class="animate-pulse h-20 bg-gray-100 rounded-xl"></div>
                ))}
              </div>
            }
          >
            <div class="space-y-4">
              <div class="p-4 bg-gradient-to-r from-main-red/10 to-red-50 border border-main-red/20 rounded-xl">
                <p class="text-sm text-main-gray mb-1">Active Accounts Rate</p>
                <p class="text-2xl font-bold text-main-red">
                  {stats()?.total_accounts
                    ? (
                        (stats()!.active_accounts / stats()!.total_accounts) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
              <div class="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                <p class="text-sm text-main-gray mb-1">System Uptime</p>
                <p class="text-2xl font-bold text-green-700">
                  {health()?.uptime ? formatUptime(health()!.uptime) : "N/A"}
                </p>
              </div>
              <div class="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                <p class="text-sm text-main-gray mb-1">Emails per Account</p>
                <p class="text-2xl font-bold text-blue-700">
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
