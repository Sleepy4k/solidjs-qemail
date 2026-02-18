import { Component, createSignal, onMount, For, Show, createResource } from "solid-js";
import { useNavigate, useSearchParams } from "@solidjs/router";
import gsap from "gsap";
import { adminApiService } from "../../services/admin-api.service";
import type { AdminAccount } from "../../../../shared/types/admin.types";
import { Button } from "../../../../shared/components/ui/Button";
import { Card } from "../../../../shared/components/ui/Card";
import { Input } from "../../../../shared/components/ui/Input";
import { Alert } from "../../../../shared/components/ui/Alert";
import { Pagination } from "../../../../shared/components/ui/Pagination";
import { SkeletonTable } from "../../../../shared/components/Skeleton";
import { ConfirmDialog, useConfirmDialog } from "../../../../shared/components/ConfirmDialog";
import { debounce } from "../../../../shared/utils/debounce.util";

const AccountsPage: Component = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = createSignal(Number(searchParams.page) || 1);
  const [pageSize, setPageSize] = createSignal(Number(searchParams.limit) || 20);
  const [inputValue, setInputValue] = createSignal(searchParams.search || "");
  const [searchQuery, setSearchQuery] = createSignal(searchParams.search || "");
  const [error, setError] = createSignal("");

  const { isOpen, config, confirm, handleConfirm, handleCancel } = useConfirmDialog();

  let headerRef: HTMLDivElement | undefined;

  const [accounts, { refetch }] = createResource(
    () => ({ page: currentPage(), limit: pageSize(), search: searchQuery() }),
    async ({ page, limit, search }) => {
      return adminApiService.getAccounts({ page, limit, search: search || "" });
    }
  );

  onMount(() => {
    if (headerRef) {
      gsap.fromTo(
        headerRef,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }
  });

  const debouncedSearch = debounce((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    setSearchParams({ search: value || undefined, page: '1' });
  }, 500);

  const handleSearchInput = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  const handleClearSearch = () => {
    setInputValue("");
    setSearchQuery("");
    setCurrentPage(1);
    setSearchParams({ search: undefined, page: '1' });
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
          await adminApiService.deleteAccount(account.id);
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
    setSearchParams({ limit: size.toString(), page: '1' });
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

  return (
    <div class="space-y-6">
      <div ref={headerRef}>
        <h1 class="text-xl sm:text-3xl font-bold text-gray-900">Account Management</h1>
        <p class="mt-1 sm:mt-2 text-xs sm:text-base text-main-gray">
          Browse accounts and inspect their inboxes
        </p>
      </div>

      <Show when={error()}>
        <Alert type="error" message={error()} onClose={() => setError("")} />
      </Show>

      <Card>
        <div class="flex items-center gap-3 flex-wrap">
          <div class="flex-1 min-w-0">
            <Input
              placeholder="Search by email address..."
              value={inputValue()}
              onInput={handleSearchInput}
            />
          </div>
          <select
            value={pageSize()}
            onChange={(e) => handlePageSizeChange(Number(e.currentTarget.value))}
            class="text-sm border border-gray-300 rounded-lg px-3 py-2.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <Show when={inputValue()}>
            <Button variant="secondary" onClick={handleClearSearch} size="sm">
              Clear
            </Button>
          </Show>
        </div>
      </Card>

      <Card>
        <Show
          when={!accounts.loading && accounts()}
          fallback={<SkeletonTable rows={10} columns={8} />}
        >
          {/* Desktop table */}
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
                          {searchQuery() ? "No accounts found" : "No accounts yet"}
                        </p>
                      </td>
                    </tr>
                  }
                >
                  {(account) => (
                    <tr class="hover:bg-gray-50 transition-colors">
                      <td class="px-4 py-4">
                        <span class="font-mono text-sm text-gray-900" title={account.email_address}>
                          {truncateEmail(account.email_address, 32)}
                        </span>
                      </td>
                      <td class="px-4 py-4 text-sm text-main-gray">
                        {account.domain_name}
                      </td>
                      <td class="px-4 py-4">
                        <span class={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          account.is_custom
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}>
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
                          <span class={`${
                            new Date(account.expires_at!) < new Date()
                              ? "text-red-500"
                              : "text-main-gray"
                          }`}>
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
                            variant="primary"
                            size="sm"
                            onClick={() => handleViewInbox(account)}
                          >
                            View Inbox
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

          {/* Mobile card list */}
          <div class="md:hidden divide-y divide-gray-200">
            <For
              each={accounts()?.accounts}
              fallback={
                <div class="py-12 text-center">
                  <div class="text-5xl mb-4">📭</div>
                  <p class="text-main-gray font-medium">
                    {searchQuery() ? "No accounts found" : "No accounts yet"}
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
                      <p class="text-xs text-main-gray mt-0.5">{account.domain_name}</p>
                    </div>
                    <div class="flex gap-1.5 flex-shrink-0">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleViewInbox(account)}
                      >
                        View
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
                    <span class={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      account.is_custom
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {account.is_custom ? "Custom" : "Random"}
                    </span>
                    <span class="px-2 py-0.5 bg-main-red/10 text-main-red rounded-full text-xs font-semibold">
                      {account.email_count || 0} emails
                    </span>
                  </div>
                  <div class="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                    <div>
                      <p class="text-[10px] text-gray-400 uppercase tracking-wide font-medium">Created</p>
                      <p class="text-xs text-main-gray">{formatDate(account.created_at)}</p>
                    </div>
                    <div>
                      <p class="text-[10px] text-gray-400 uppercase tracking-wide font-medium">Expires</p>
                      <p class={`text-xs ${
                        account.expires_at && new Date(account.expires_at) < new Date()
                          ? "text-red-500"
                          : "text-main-gray"
                      }`}>
                        {formatDate(account.expires_at ?? null)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </For>
          </div>

          {/* Pagination */}
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
    </div>
  );
};

export default AccountsPage;
