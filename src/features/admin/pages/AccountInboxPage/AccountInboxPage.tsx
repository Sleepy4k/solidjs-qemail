import { Component, createResource, createSignal, Show, For } from "solid-js";
import { useParams, useNavigate, useSearchParams } from "@solidjs/router";
import { Card } from "../../../../shared/components/ui/Card";
import { Button } from "../../../../shared/components/ui/Button";
import { SkeletonTable } from "../../../../shared/components/Skeleton";
import { adminApiService } from "../../services/admin-api.service";
import type { AdminEmailItem } from "../../../../shared/types/admin.types";
import { Pagination } from "../../../../shared/components/ui/Pagination";
import { SafeEmailRenderer } from "../../../../shared/components/SafeEmailRenderer";

const SUBJECT_LIMIT = 50;
const SENDER_LIMIT = 30;

const truncate = (str: string | null | undefined, max: number) => {
  if (!str) return "";
  return str.length > max ? str.substring(0, max) + "…" : str;
};

const AccountInboxPage: Component = () => {
  const params = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const accountId = () => parseInt(params.accountId);

  const [currentPage, setCurrentPage] = createSignal(
    Number(searchParams.page) || 1,
  );
  const [pageSize, setPageSize] = createSignal(
    Number(searchParams.limit) || 10,
  );
  const [expandedEmail, setExpandedEmail] = createSignal<AdminEmailItem | null>(
    null,
  );
  const [loadingMessageId, setLoadingMessageId] = createSignal<string | null>(
    null,
  );
  const [isRefreshing, setIsRefreshing] = createSignal(false);

  const [inboxData, { refetch }] = createResource(
    () => ({ id: accountId(), page: currentPage(), limit: pageSize() }),
    ({ id, page, limit }) =>
      adminApiService.getAccountInbox(id, { page, limit }),
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setExpandedEmail(null);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatDateShort = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleShowEmail = async (email: AdminEmailItem) => {
    if (expandedEmail()?.message_id === email.message_id) {
      setExpandedEmail(null);
      return;
    }

    if (email.body_html !== undefined || email.body_text !== undefined) {
      setExpandedEmail(email);
      return;
    }

    setLoadingMessageId(email.message_id);
    try {
      const full = await adminApiService.getAccountMessage(
        accountId(),
        email.message_id,
      );
      setExpandedEmail(full);
    } catch {
      setExpandedEmail(email);
    } finally {
      setLoadingMessageId(null);
    }
  };

  const selectCls =
    "text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors";

  return (
    <div class="space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div class="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/accounts")}
            class="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Back to accounts"
          >
            <svg
              class="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div class="min-w-0">
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900">
              Account Inbox
            </h1>
            <Show when={inboxData()?.account}>
              <p class="mt-0.5 text-xs sm:text-sm text-gray-500 truncate">
                <span class="font-medium text-gray-700">
                  {inboxData()?.account.email_address}
                </span>
              </p>
            </Show>
          </div>
        </div>

        <Button
          variant="secondary"
          onClick={handleRefresh}
          disabled={isRefreshing() || inboxData.loading}
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

      <Show when={!inboxData.loading && inboxData()?.account}>
        {(account) => (
          <Card padding="md">
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div class="col-span-2 sm:col-span-1">
                <p class="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">
                  Email
                </p>
                <p class="font-semibold text-gray-900 text-sm break-all">
                  {account().email_address}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">
                  Domain
                </p>
                <p class="font-semibold text-gray-900 text-sm">
                  {account().domain_name}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">
                  Type
                </p>
                <span
                  class={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    account().is_custom
                      ? "bg-purple-100 text-purple-800 border border-purple-200"
                      : "bg-sky-100 text-sky-800 border border-sky-200"
                  }`}
                >
                  {account().is_custom ? "Custom" : "Random"}
                </span>
              </div>
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">
                  Total Emails
                </p>
                <p class="font-bold text-gray-900 text-base">
                  {inboxData()?.total ?? 0}
                </p>
              </div>
            </div>
          </Card>
        )}
      </Show>

      <Card padding="none">
        <div class="px-4 sm:px-5 py-3 border-b border-gray-200 flex items-center justify-between gap-3 flex-wrap bg-white rounded-t-xl">
          <h2 class="text-sm sm:text-base font-semibold text-gray-800">
            Messages
            <Show when={inboxData()?.total}>
              <span class="ml-2 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                {inboxData()?.total}
              </span>
            </Show>
          </h2>
          <div class="flex items-center gap-2">
            <label class="text-xs text-gray-500">Per page:</label>
            <select
              value={pageSize()}
              onChange={(e) => {
                const size = Number(e.currentTarget.value);
                setPageSize(size);
                setCurrentPage(1);
                setExpandedEmail(null);
                setSearchParams({ limit: size.toString(), page: "1" });
              }}
              class={selectCls}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <Show
          when={!inboxData.loading && inboxData()}
          fallback={
            <div class="p-4">
              <SkeletonTable rows={5} columns={5} />
            </div>
          }
        >
          <Show
            when={inboxData()?.emails && inboxData()!.emails.length > 0}
            fallback={
              <div class="text-center py-16">
                <div class="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    class="w-7 h-7 text-gray-350"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p class="text-gray-600 font-medium">No emails found</p>
                <p class="text-sm text-gray-400 mt-1">
                  This inbox is currently empty
                </p>
              </div>
            }
          >
            <div class="hidden sm:block overflow-x-auto">
              <table class="w-full border-collapse">
                <thead>
                  <tr class="bg-gray-50 border-b border-gray-200">
                    <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-8" />
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-44">
                      From
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-36">
                      Received
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">
                      Status
                    </th>
                    <th class="px-4 py-3 w-20" />
                  </tr>
                </thead>
                <tbody>
                  <For each={inboxData()?.emails}>
                    {(email) => (
                      <>
                        <tr
                          class={`border-b transition-colors cursor-pointer ${
                            expandedEmail()?.message_id === email.message_id
                              ? "bg-primary-50/40 border-primary-100"
                              : !email.is_read
                                ? "bg-blue-50/30 hover:bg-blue-50/60 border-blue-100/50"
                                : "hover:bg-gray-50/80 border-gray-100"
                          }`}
                          onClick={() => handleShowEmail(email)}
                        >
                          <td class="pl-4 pr-1 py-3.5 align-middle w-8">
                            <Show when={!email.is_read}>
                              <span class="block w-2 h-2 rounded-full bg-main-red mx-auto" />
                            </Show>
                          </td>
                          <td class="px-4 py-3.5 align-middle">
                            <div
                              class={`text-sm truncate ${!email.is_read ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}
                              title={email.sender_name || email.sender}
                            >
                              {truncate(
                                email.sender_name || email.sender,
                                SENDER_LIMIT,
                              )}
                            </div>
                            <Show when={email.sender_name}>
                              <div
                                class="text-xs text-gray-400 truncate"
                                title={email.sender}
                              >
                                {truncate(email.sender, 28)}
                              </div>
                            </Show>
                          </td>
                          <td class="px-4 py-3.5 align-middle">
                            <span
                              class={`text-sm ${!email.is_read ? "font-semibold text-gray-900" : "text-gray-700"}`}
                              title={email.subject || "(No Subject)"}
                            >
                              {truncate(
                                email.subject || "(No Subject)",
                                SUBJECT_LIMIT,
                              )}
                            </span>
                          </td>
                          <td class="px-4 py-3.5 align-middle">
                            <div class="text-xs text-gray-500 whitespace-nowrap">
                              {formatDateShort(email.received_at)}
                            </div>
                          </td>
                          <td class="px-4 py-3.5 align-middle">
                            <span
                              class={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                email.is_read
                                  ? "bg-gray-100 text-gray-500 border border-gray-200"
                                  : "bg-blue-100 text-blue-700 border border-blue-200"
                              }`}
                            >
                              <span
                                class={`w-1.5 h-1.5 rounded-full ${email.is_read ? "bg-gray-400" : "bg-blue-500"}`}
                              />
                              {email.is_read ? "Read" : "Unread"}
                            </span>
                          </td>
                          <td
                            class="px-4 py-3.5 align-middle text-right"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleShowEmail(email)}
                              disabled={loadingMessageId() === email.message_id}
                            >
                              {loadingMessageId() === email.message_id
                                ? "..."
                                : expandedEmail()?.message_id ===
                                    email.message_id
                                  ? "Hide"
                                  : "View"}
                            </Button>
                          </td>
                        </tr>

                        <Show
                          when={
                            expandedEmail()?.message_id === email.message_id &&
                            expandedEmail()
                          }
                        >
                          {(msg) => (
                            <tr class="border-b border-primary-100 bg-primary-50/20">
                              <td colspan="6" class="p-0">
                                <div class="mx-4 my-3 border border-primary-200 rounded-xl overflow-hidden bg-white shadow-sm">
                                  <div class="px-5 py-3.5 bg-gradient-to-r from-primary-50 to-white border-b border-primary-100 flex items-start justify-between gap-4">
                                    <div class="min-w-0 space-y-0.5">
                                      <h3 class="font-semibold text-gray-900 text-sm break-words">
                                        {msg().subject || "(No Subject)"}
                                      </h3>
                                      <p class="text-xs text-gray-500 break-all">
                                        <span class="font-medium">From:</span>{" "}
                                        {msg().sender_name
                                          ? `${msg().sender_name} <${msg().sender}>`
                                          : msg().sender}
                                      </p>
                                      <p class="text-xs text-gray-400">
                                        {formatDate(msg().received_at)}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => setExpandedEmail(null)}
                                      class="flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0"
                                      aria-label="Close"
                                    >
                                      <svg
                                        class="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          stroke-width="2"
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                  <div class="max-h-[500px] overflow-y-auto">
                                    <Show
                                      when={msg().body_html}
                                      fallback={
                                        <pre class="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed p-5">
                                          {msg().body_text || "(No content)"}
                                        </pre>
                                      }
                                    >
                                      <SafeEmailRenderer
                                        html={msg().body_html!}
                                      />
                                    </Show>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Show>
                      </>
                    )}
                  </For>
                </tbody>
              </table>
            </div>

            <div class="sm:hidden divide-y divide-gray-100">
              <For each={inboxData()?.emails}>
                {(email) => (
                  <div class={`${!email.is_read ? "bg-blue-50/30" : ""}`}>
                    <div
                      class="px-4 py-3.5 flex items-start gap-3 cursor-pointer active:bg-gray-50"
                      onClick={() => handleShowEmail(email)}
                    >
                      <div class="flex-shrink-0 mt-1.5">
                        <Show
                          when={!email.is_read}
                          fallback={<div class="w-2 h-2" />}
                        >
                          <span class="block w-2 h-2 rounded-full bg-main-red" />
                        </Show>
                      </div>

                      <div class="flex-1 min-w-0 space-y-1">
                        <div class="flex items-center justify-between gap-2">
                          <span
                            class={`text-sm truncate ${!email.is_read ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}
                          >
                            {truncate(
                              email.sender_name || email.sender,
                              SENDER_LIMIT,
                            )}
                          </span>
                          <span class="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                            {formatDateShort(email.received_at)}
                          </span>
                        </div>
                        <p
                          class={`text-sm truncate ${!email.is_read ? "text-gray-800" : "text-gray-600"}`}
                        >
                          {truncate(
                            email.subject || "(No Subject)",
                            SUBJECT_LIMIT,
                          )}
                        </p>
                        <div class="flex items-center justify-between">
                          <span
                            class={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium ${
                              email.is_read
                                ? "bg-gray-100 text-gray-500"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            <span
                              class={`w-1.5 h-1.5 rounded-full ${email.is_read ? "bg-gray-400" : "bg-blue-500"}`}
                            />
                            {email.is_read ? "Read" : "Unread"}
                          </span>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShowEmail(email);
                            }}
                            disabled={loadingMessageId() === email.message_id}
                          >
                            {loadingMessageId() === email.message_id
                              ? "..."
                              : expandedEmail()?.message_id === email.message_id
                                ? "Hide"
                                : "View"}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Show
                      when={
                        expandedEmail()?.message_id === email.message_id &&
                        expandedEmail()
                      }
                    >
                      {(msg) => (
                        <div class="mx-3 mb-3 border border-primary-200 rounded-xl overflow-hidden bg-white shadow-sm">
                          <div class="px-4 py-3 bg-primary-50 border-b border-primary-100 flex items-start justify-between gap-3">
                            <div class="min-w-0 space-y-0.5">
                              <p class="font-semibold text-sm text-gray-900 break-words">
                                {msg().subject || "(No Subject)"}
                              </p>
                              <p class="text-xs text-gray-500 break-all">
                                {msg().sender_name
                                  ? `${msg().sender_name} <${msg().sender}>`
                                  : msg().sender}
                              </p>
                              <p class="text-xs text-gray-400">
                                {formatDate(msg().received_at)}
                              </p>
                            </div>
                            <button
                              onClick={() => setExpandedEmail(null)}
                              class="flex items-center justify-center w-6 h-6 rounded text-gray-400 hover:text-gray-700 flex-shrink-0"
                            >
                              <svg
                                class="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                          <div class="max-h-72 overflow-y-auto">
                            <Show
                              when={msg().body_html}
                              fallback={
                                <pre class="whitespace-pre-wrap text-xs text-gray-800 font-sans leading-relaxed p-4">
                                  {msg().body_text || "(No content)"}
                                </pre>
                              }
                            >
                              <SafeEmailRenderer
                                html={msg().body_html!}
                                minHeight={60}
                              />
                            </Show>
                          </div>
                        </div>
                      )}
                    </Show>
                  </div>
                )}
              </For>
            </div>

            <Show when={inboxData()}>
              {(data) => (
                <Pagination
                  currentPage={data().page}
                  totalPages={data().total_pages}
                  pageSize={pageSize()}
                  total={data().total}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    setExpandedEmail(null);
                    setSearchParams({ page: page.toString() });
                  }}
                />
              )}
            </Show>
          </Show>
        </Show>
      </Card>
    </div>
  );
};

export default AccountInboxPage;
