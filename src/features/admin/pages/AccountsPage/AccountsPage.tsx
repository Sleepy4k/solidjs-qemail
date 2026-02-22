import {
  Component,
  createSignal,
  onMount,
  For,
  Show,
  createResource,
} from "solid-js";
import { useNavigate, useSearchParams } from "@solidjs/router";
import gsap from "gsap";
import { adminApiService } from "../../services/admin-api.service";
import type { AdminAccount, AdminDomain } from "../../../../shared/types/admin.types";
import { Button } from "../../../../shared/components/ui/Button";
import { Card } from "../../../../shared/components/ui/Card";
import { Alert } from "../../../../shared/components/ui/Alert";
import { Pagination } from "../../../../shared/components/ui/Pagination";
import { SkeletonTable } from "../../../../shared/components/Skeleton";
import {
  ConfirmDialog,
  useConfirmDialog,
} from "../../../../shared/components/ConfirmDialog";
import { debounce } from "../../../../shared/utils/debounce.util";

const formatRelativeTime = (dateStr: string | null): string => {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const isFuture = diffMs < 0;
  const abs = Math.abs(diffMs);
  const diffMins = Math.floor(abs / 60000);
  const diffHours = Math.floor(abs / 3600000);
  const diffDays = Math.floor(abs / 86400000);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  let label: string;
  if (diffYears >= 1) label = `${diffYears} tahun`;
  else if (diffMonths >= 1) label = `${diffMonths} bulan`;
  else if (diffDays >= 1) label = `${diffDays} hari`;
  else if (diffHours >= 1) label = `${diffHours} jam`;
  else if (diffMins >= 1) label = `${diffMins} menit`;
  else return isFuture ? "Sebentar lagi" : "Baru saja";
  return isFuture ? `${label} lagi` : `${label} yang lalu`;
};

type TypeFilter = "all" | "random" | "custom";

const AccountsPage: Component = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = createSignal(
    Number(searchParams.page) || 1,
  );
  const [pageSize, setPageSize] = createSignal(
    Number(searchParams.limit) || 10,
  );
  const [inputValue, setInputValue] = createSignal(searchParams.search || "");
  const [searchQuery, setSearchQuery] = createSignal(searchParams.search || "");
  const [domainFilter, setDomainFilter] = createSignal<number>(
    Number(searchParams.domain_id) || 0,
  );
  const [typeFilter, setTypeFilter] = createSignal<TypeFilter>(
    (searchParams.type as TypeFilter) || "all",
  );
  const [domains, setDomains] = createSignal<AdminDomain[]>([]);
  const [error, setError] = createSignal("");
  const [successMessage, setSuccessMessage] = createSignal("");
  const [isRefreshing, setIsRefreshing] = createSignal(false);
  const [detailAccount, setDetailAccount] = createSignal<AdminAccount | null>(null);

  const { isOpen, config, confirm, handleConfirm, handleCancel } =
    useConfirmDialog();

  let headerRef: HTMLDivElement | undefined;

  const isCustomFilter = () => {
    if (typeFilter() === "custom") return true;
    if (typeFilter() === "random") return false;
    return undefined;
  };

  const [accounts, { refetch }] = createResource(
    () => ({
      page: currentPage(),
      limit: pageSize(),
      search: searchQuery(),
      domain_id: domainFilter(),
      is_custom: isCustomFilter(),
    }),
    async ({ page, limit, search, domain_id, is_custom }) => {
      return adminApiService.getAccounts({
        page,
        limit,
        search: search || undefined,
        domain_id: domain_id || undefined,
        is_custom,
      });
    },
  );

  onMount(async () => {
    if (headerRef) {
      gsap.fromTo(
        headerRef,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      );
    }
    try {
      const data = await adminApiService.getDomains();
      setDomains(data);
    } catch {
      /* non-critical */
    }
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  const debouncedSearch = debounce((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    setSearchParams({ search: value || undefined, page: "1" });
  }, 500);

  const handleSearchInput = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  const handleClearSearch = () => {
    setInputValue("");
    setSearchQuery("");
    setCurrentPage(1);
    setSearchParams({ search: undefined, page: "1" });
  };

  const handleDomainFilter = (value: string) => {
    const id = Number(value);
    setDomainFilter(id);
    setCurrentPage(1);
    setSearchParams({ domain_id: id ? String(id) : undefined, page: "1" });
  };

  const handleTypeFilter = (value: string) => {
    setTypeFilter(value as TypeFilter);
    setCurrentPage(1);
    setSearchParams({ type: value !== "all" ? value : undefined, page: "1" });
  };

  const handleViewInbox = (account: AdminAccount) => {
    navigate(`/admin/accounts/${account.id}/inbox`);
  };

  const handleDeleteAccount = (account: AdminAccount) => {
    confirm({
      title: "Delete Account",
      message: `Are you sure you want to delete "${account.email_address}"? All emails in this inbox will also be permanently removed.`,
      variant: "danger",
      onConfirm: async () => {
        try {
          setError("");
          setSuccessMessage("");
          await adminApiService.deleteAccount(account.id);
          setSuccessMessage(
            `Account "${account.email_address}" has been successfully deleted.`,
          );
          refetch();
        } catch (err: any) {
          setError(err.message || "Failed to delete account");
        }
      },
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    setSearchParams({ limit: size.toString(), page: "1" });
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const truncateEmail = (email: string, max = 28) =>
    email.length > max ? email.substring(0, max) + "…" : email;

  const handleShowDetail = (account: AdminAccount) => {
    setDetailAccount(account);
  };

  const hasFilters = () =>
    searchQuery() || domainFilter() !== 0 || typeFilter() !== "all";

  return (
    <div class="space-y-6">
      <div ref={headerRef}>
        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1 class="text-xl sm:text-3xl font-bold text-gray-900">
              Account Management
            </h1>
            <p class="mt-1 sm:mt-2 text-xs sm:text-base text-main-gray">
              Browse accounts and inspect their inboxes
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={handleRefresh}
            disabled={isRefreshing() || accounts.loading}
            class="self-start sm:self-auto flex-shrink-0"
            icon={
              <svg
                class={`w-4 h-4 ${isRefreshing() ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            }
          >
            {isRefreshing() ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      <Show when={error()}>
        <Alert type="error" message={error()} onClose={() => setError("")} />
      </Show>

      <Show when={successMessage()}>
        <Alert
          type="success"
          message={successMessage()}
          onClose={() => setSuccessMessage("")}
        />
      </Show>

      <Card padding="none">
        <div class="p-4 border-b border-gray-100 dark:border-navy-700 flex items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-gray-400 dark:text-navy-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            <span class="text-sm font-semibold text-gray-700 dark:text-navy-200">Filters</span>
            <Show when={hasFilters()}>
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400">
                Active
              </span>
            </Show>
          </div>
          <Show when={hasFilters()}>
            <button
              onClick={() => {
                setInputValue("");
                setSearchQuery("");
                setDomainFilter(0);
                setTypeFilter("all");
                setCurrentPage(1);
                setSearchParams({ search: undefined, domain_id: undefined, type: undefined, page: "1" });
              }}
              class="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-navy-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear all
            </button>
          </Show>
        </div>

        <div class="p-4 space-y-4">
          <div class="relative">
            <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg class="w-4 h-4 text-gray-400 dark:text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by email address..."
              value={inputValue()}
              onInput={(e) => handleSearchInput(e.currentTarget.value)}
              class="w-full pl-9 pr-9 py-2.5 text-sm border border-gray-200 dark:border-navy-600 rounded-xl bg-gray-50 dark:bg-navy-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white dark:focus:bg-navy-700 transition-all"
            />
            <Show when={inputValue()}>
              <button
                onClick={handleClearSearch}
                class="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-navy-400 dark:hover:text-navy-200 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </Show>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-gray-500 dark:text-navy-400 uppercase tracking-wide">
                Domain
              </label>
              <select
                value={domainFilter()}
                onChange={(e) => handleDomainFilter(e.currentTarget.value)}
                class="w-full text-sm border border-gray-200 dark:border-navy-600 rounded-xl px-3 py-2.5 bg-gray-50 dark:bg-navy-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white dark:focus:bg-navy-700 transition-all"
              >
                <option value={0}>All Domains</option>
                <For each={domains()}>
                  {(d) => <option value={d.id}>{d.name}</option>}
                </For>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-gray-500 dark:text-navy-400 uppercase tracking-wide">
                Account Type
              </label>
              <select
                value={typeFilter()}
                onChange={(e) => handleTypeFilter(e.currentTarget.value)}
                class="w-full text-sm border border-gray-200 dark:border-navy-600 rounded-xl px-3 py-2.5 bg-gray-50 dark:bg-navy-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white dark:focus:bg-navy-700 transition-all"
              >
                <option value="all">All Types</option>
                <option value="random">Random</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label class="block text-xs font-semibold text-gray-500 dark:text-navy-400 uppercase tracking-wide">
                Rows per page
              </label>
              <select
                value={pageSize()}
                onChange={(e) => handlePageSizeChange(Number(e.currentTarget.value))}
                class="w-full text-sm border border-gray-200 dark:border-navy-600 rounded-xl px-3 py-2.5 bg-gray-50 dark:bg-navy-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white dark:focus:bg-navy-700 transition-all"
              >
                <option value={10}>10 rows</option>
                <option value={20}>20 rows</option>
                <option value={50}>50 rows</option>
                <option value={100}>100 rows</option>
              </select>
            </div>
          </div>

          <Show when={hasFilters()}>
            <div class="flex flex-wrap gap-2 pt-1">
              <Show when={searchQuery()}>
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-navy-700 text-gray-700 dark:text-navy-200 border border-gray-200 dark:border-navy-600">
                  <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  "{searchQuery()}"
                  <button onClick={handleClearSearch} class="ml-0.5 text-gray-400 hover:text-red-500 transition-colors">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              </Show>
              <Show when={domainFilter() !== 0}>
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                  Domain: {domains().find((d) => d.id === domainFilter())?.name ?? domainFilter()}
                  <button onClick={() => { setDomainFilter(0); setCurrentPage(1); setSearchParams({ domain_id: undefined, page: "1" }); }} class="ml-0.5 text-blue-400 hover:text-red-500 transition-colors">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              </Show>
              <Show when={typeFilter() !== "all"}>
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700">
                  Type: {typeFilter()}
                  <button onClick={() => { setTypeFilter("all"); setCurrentPage(1); setSearchParams({ type: undefined, page: "1" }); }} class="ml-0.5 text-purple-400 hover:text-red-500 transition-colors">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              </Show>
            </div>
          </Show>
        </div>
      </Card>

      {/* ── Table ── */}
      <Card>
        <Show
          when={!accounts.loading && accounts()}
          fallback={<SkeletonTable rows={10} columns={8} />}
        >
          <div class="hidden md:block overflow-x-auto">
            <table class="w-full">
              <thead class="bg-main-lightGray border-b border-gray-200">
                <tr>
                  <th class="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Email Address
                  </th>
                  <th class="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Domain
                  </th>
                  <th class="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Type
                  </th>
                  <th class="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Created
                  </th>
                  <th class="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Expires At
                  </th>
                  <th class="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Emails
                  </th>
                  <th class="px-4 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <For
                  each={accounts()?.accounts}
                  fallback={
                    <tr>
                      <td colspan="7" class="px-6 py-16 text-center">
                        <div class="text-5xl mb-4">📭</div>
                        <p class="text-main-gray font-medium">
                          {hasFilters()
                            ? "No accounts match your filters"
                            : "No accounts yet"}
                        </p>
                        <Show when={hasFilters()}>
                          <p class="text-xs text-gray-400 mt-1">
                            Try adjusting your search or filter criteria
                          </p>
                        </Show>
                      </td>
                    </tr>
                  }
                >
                  {(account) => (
                    <tr class="hover:bg-gray-50 transition-colors">
                      <td class="px-4 py-4">
                        <span
                          class="font-mono text-sm text-gray-900"
                          title={account.email_address}
                        >
                          {truncateEmail(account.email_address, 32)}
                        </span>
                      </td>
                      <td class="px-4 py-4 text-sm text-main-gray">
                        {account.domain_name}
                      </td>
                      <td class="px-4 py-4">
                        <span
                          class={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            account.is_custom
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {account.is_custom ? "Custom" : "Random"}
                        </span>
                      </td>
                      <td class="px-4 py-4 text-sm text-main-gray whitespace-nowrap">
                        {formatDate(account.created_at)}
                      </td>
                      <td class="px-4 py-4 text-sm whitespace-nowrap">
                        <Show
                          when={account.expires_at}
                          fallback={<span class="text-gray-400">—</span>}
                        >
                          <span
                            class={`${
                              new Date(account.expires_at!) < new Date()
                                ? "text-red-500"
                                : "text-main-gray"
                            }`}
                          >
                            {formatDate(account.expires_at)}
                          </span>
                        </Show>
                      </td>
                      <td class="px-4 py-4">
                        <span class="px-2.5 py-1 bg-main-red/10 text-main-red rounded-full text-xs font-semibold">
                          {account.email_count || 0}
                        </span>
                      </td>
                      <td class="px-4 py-4">
                        <div class="flex items-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleShowDetail(account)}
                          >
                            Detail
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleViewInbox(account)}
                          >
                            Inbox
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteAccount(account)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>

          <div class="md:hidden divide-y divide-gray-200">
            <For
              each={accounts()?.accounts}
              fallback={
                <div class="py-12 text-center">
                  <div class="text-5xl mb-4">📭</div>
                  <p class="text-main-gray font-medium">
                    {hasFilters()
                      ? "No accounts match your filters"
                      : "No accounts yet"}
                  </p>
                </div>
              }
            >
              {(account) => (
                <div class="py-4 px-1 space-y-2">
                  <div class="flex items-start justify-between gap-2">
                    <div class="min-w-0 flex-1">
                      <p class="font-mono text-sm text-gray-900 font-semibold break-all">
                        {account.email_address}
                      </p>
                      <p class="text-xs text-main-gray mt-0.5">
                        {account.domain_name}
                      </p>
                    </div>
                    <div class="flex gap-1.5 flex-shrink-0">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleShowDetail(account)}
                      >
                        Detail
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleViewInbox(account)}
                      >
                        Inbox
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteAccount(account)}
                      >
                        Del
                      </Button>
                    </div>
                  </div>
                  <div class="flex items-center gap-3 flex-wrap">
                    <span
                      class={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        account.is_custom
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {account.is_custom ? "Custom" : "Random"}
                    </span>
                    <span class="px-2 py-0.5 bg-main-red/10 text-main-red rounded-full text-xs font-semibold">
                      {account.email_count || 0} emails
                    </span>
                  </div>
                  <div class="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                    <div>
                      <p class="text-[10px] text-gray-400 uppercase tracking-wide font-medium">
                        Created
                      </p>
                      <p class="text-xs text-main-gray">
                        {formatDate(account.created_at)}
                      </p>
                    </div>
                    <div>
                      <p class="text-[10px] text-gray-400 uppercase tracking-wide font-medium">
                        Expires
                      </p>
                      <p
                        class={`text-xs ${
                          account.expires_at &&
                          new Date(account.expires_at) < new Date()
                            ? "text-red-500"
                            : "text-main-gray"
                        }`}
                      >
                        {formatDate(account.expires_at ?? null)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </For>
          </div>

          <Show when={accounts()}>
            {(data) => (
              <Pagination
                currentPage={data().page}
                totalPages={data().total_pages}
                pageSize={pageSize()}
                total={data().total}
                onPageChange={handlePageChange}
              />
            )}
          </Show>
        </Show>
      </Card>

      <ConfirmDialog
        isOpen={isOpen()}
        title={config().title}
        message={config().message}
        confirmText="Delete"
        cancelText="Cancel"
        variant={config().variant}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      {/* ── Account Detail Modal ── */}
      <Show when={detailAccount()}>
        {(acc) => (
          <div
            class="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setDetailAccount(null)}
          >
            <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div
              class="relative w-full max-w-lg bg-white dark:bg-navy-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-navy-600 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-navy-700 bg-gray-50 dark:bg-navy-700">
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <h2 class="text-base font-bold text-gray-900 dark:text-white">Account Detail</h2>
                </div>
                <button
                  onClick={() => setDetailAccount(null)}
                  class="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-navy-600 transition-colors"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal body */}
              <div class="px-6 py-5 space-y-4">
                {/* Email address */}
                <div>
                  <p class="text-xs font-semibold text-gray-400 dark:text-navy-400 uppercase tracking-wide mb-1">Email Address</p>
                  <p class="font-mono text-sm font-semibold text-gray-900 dark:text-white break-all">{acc().email_address}</p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  {/* Domain */}
                  <div>
                    <p class="text-xs font-semibold text-gray-400 dark:text-navy-400 uppercase tracking-wide mb-1">Domain</p>
                    <p class="text-sm text-gray-800 dark:text-navy-100">{acc().domain_name}</p>
                  </div>
                  {/* Type */}
                  <div>
                    <p class="text-xs font-semibold text-gray-400 dark:text-navy-400 uppercase tracking-wide mb-1">Type</p>
                    <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      acc().is_custom
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                        : "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300"
                    }`}>
                      {acc().is_custom ? "Custom" : "Random"}
                    </span>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  {/* Created at */}
                  <div>
                    <p class="text-xs font-semibold text-gray-400 dark:text-navy-400 uppercase tracking-wide mb-1">Created</p>
                    <p class="text-sm text-gray-800 dark:text-navy-100">{formatDate(acc().created_at)}</p>
                    <p class="text-xs text-gray-400 dark:text-navy-500 mt-0.5">{formatRelativeTime(acc().created_at)}</p>
                  </div>
                  {/* Expires at */}
                  <div>
                    <p class="text-xs font-semibold text-gray-400 dark:text-navy-400 uppercase tracking-wide mb-1">Expires</p>
                    <Show when={acc().expires_at} fallback={<p class="text-sm text-gray-400 dark:text-navy-500">Never</p>}>
                      <p class={`text-sm font-medium ${
                        new Date(acc().expires_at!) < new Date()
                          ? "text-red-500 dark:text-red-400"
                          : "text-gray-800 dark:text-navy-100"
                      }`}>{formatDate(acc().expires_at)}</p>
                      <p class={`text-xs mt-0.5 ${
                        new Date(acc().expires_at!) < new Date()
                          ? "text-red-400 dark:text-red-500"
                          : "text-emerald-500 dark:text-emerald-400"
                      }`}>{formatRelativeTime(acc().expires_at)}</p>
                    </Show>
                  </div>
                </div>

                {/* IP Address */}
                <div>
                  <p class="text-xs font-semibold text-gray-400 dark:text-navy-400 uppercase tracking-wide mb-1">IP Address</p>
                  <Show when={acc().ip_address} fallback={<p class="text-sm text-gray-400 dark:text-navy-500">—</p>}>
                    <p class="font-mono text-sm text-gray-800 dark:text-navy-100">{acc().ip_address}</p>
                  </Show>
                </div>

                {/* Forward To */}
                <div>
                  <p class="text-xs font-semibold text-gray-400 dark:text-navy-400 uppercase tracking-wide mb-1">Forward To</p>
                  <Show when={acc().forward_to} fallback={<p class="text-sm text-gray-400 dark:text-navy-500">—</p>}>
                    <p class="font-mono text-sm text-gray-800 dark:text-navy-100 break-all">{acc().forward_to}</p>
                  </Show>
                </div>

                {/* Emails count */}
                <div class="pt-1 border-t border-gray-100 dark:border-navy-700">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-semibold text-gray-400 dark:text-navy-400 uppercase tracking-wide">Emails in inbox</span>
                    <span class="px-2.5 py-1 bg-main-red/10 text-main-red dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs font-bold">
                      {acc().email_count ?? 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div class="px-6 py-4 border-t border-gray-100 dark:border-navy-700 bg-gray-50 dark:bg-navy-700/50 flex items-center justify-end gap-2">
                <Button variant="primary" size="sm" onClick={() => { setDetailAccount(null); handleViewInbox(acc()); }}>
                  Buka Inbox
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setDetailAccount(null)}>
                  Tutup
                </Button>
              </div>
            </div>
          </div>
        )}
      </Show>
    </div>
  );
};

export default AccountsPage;
