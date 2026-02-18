import { Component, createSignal, onMount, For, Show, createResource } from "solid-js";
import { useNavigate } from "@solidjs/router";
import gsap from "gsap";
import { adminApiService } from "../../services/admin-api.service";
import type { AdminAccount } from "../../../../shared/types/admin.types";
import { Button } from "../../../../shared/components/ui/Button";
import { Card } from "../../../../shared/components/ui/Card";
import { Input } from "../../../../shared/components/ui/Input";
import { Alert } from "../../../../shared/components/ui/Alert";
import { SkeletonTable } from "../../../../shared/components/Skeleton";
import { debounce } from "../../../../shared/utils/debounce.util";

const AccountsPage: Component = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = createSignal(1);
  const [inputValue, setInputValue] = createSignal("");
  const [searchQuery, setSearchQuery] = createSignal("");
  const [error, setError] = createSignal("");

  let headerRef: HTMLDivElement | undefined;

  const [accounts, { refetch }] = createResource(
    () => ({ page: currentPage(), search: searchQuery() }),
    async ({ page, search }) => {
      return adminApiService.getAccounts({ page, limit: 20, search: search || "" });
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
  }, 500);

  const handleSearchInput = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  const handleClearSearch = () => {
    setInputValue("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleViewInbox = (account: AdminAccount) => {
    navigate(`/admin/accounts/${account.id}/inbox`);
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
        <div class="flex gap-3">
          <div class="flex-1">
            <Input
              placeholder="Search by email address..."
              value={inputValue()}
              onInput={handleSearchInput}
            />
          </div>
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
          fallback={<SkeletonTable rows={10} columns={6} />}
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
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleViewInbox(account)}
                        >
                          View Inbox
                        </Button>
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
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleViewInbox(account)}
                      class="flex-shrink-0"
                    >
                      View
                    </Button>
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

          <Show when={accounts()}>
            {(data) => (
              <div class="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-main-lightGray">
                <div class="text-xs sm:text-sm text-main-gray">
                  Page {data().page} of {data().total_pages} &bull; {data().total} accounts
                </div>
                <div class="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setCurrentPage(currentPage() - 1);
                      refetch();
                    }}
                    disabled={currentPage() === 1}
                  >
                    ← Prev
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setCurrentPage(currentPage() + 1);
                      refetch();
                    }}
                    disabled={currentPage() >= data().total_pages}
                  >
                    Next →
                  </Button>
                </div>
              </div>
            )}
          </Show>
        </Show>
      </Card>
    </div>
  );
};

export default AccountsPage;
