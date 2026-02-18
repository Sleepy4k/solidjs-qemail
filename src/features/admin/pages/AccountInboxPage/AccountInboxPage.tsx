import { Component, createResource, createSignal, Show, For } from 'solid-js';
import { useParams, useNavigate, useSearchParams } from '@solidjs/router';
import { Card } from '../../../../shared/components/ui/Card';
import { Button } from '../../../../shared/components/ui/Button';
import { SkeletonTable } from '../../../../shared/components/Skeleton';
import { adminApiService } from '../../services/admin-api.service';
import type { AdminEmailItem } from '../../../../shared/types/admin.types';
import { Pagination } from '../../../../shared/components/ui/Pagination';

const SUBJECT_LIMIT = 40;
const SENDER_LIMIT = 28;

const truncate = (str: string | null | undefined, max: number) => {
  if (!str) return '';
  return str.length > max ? str.substring(0, max) + '…' : str;
};

const AccountInboxPage: Component = () => {
  const params = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const accountId = () => parseInt(params.accountId);

  const [currentPage, setCurrentPage] = createSignal(Number(searchParams.page) || 1);
  const [pageSize, setPageSize] = createSignal(Number(searchParams.limit) || 20);
  const [expandedEmail, setExpandedEmail] = createSignal<AdminEmailItem | null>(null);
  const [loadingMessageId, setLoadingMessageId] = createSignal<string | null>(null);

  const [inboxData] = createResource(
    () => ({ id: accountId(), page: currentPage(), limit: pageSize() }),
    ({ id, page, limit }) => adminApiService.getAccountInbox(id, { page, limit })
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handleShowEmail = async (email: AdminEmailItem) => {
    if (expandedEmail()?.message_id === email.message_id) {
      setExpandedEmail(null);
      return;
    }

    // If body already loaded in list data, show directly
    if (email.body_html !== undefined || email.body_text !== undefined) {
      setExpandedEmail(email);
      return;
    }

    // Otherwise fetch full message
    setLoadingMessageId(email.message_id);
    try {
      const full = await adminApiService.getAccountMessage(accountId(), email.message_id);
      setExpandedEmail(full);
    } catch {
      setExpandedEmail(email);
    } finally {
      setLoadingMessageId(null);
    }
  };

  return (
    <div class="space-y-6">
      {/* Page header */}
      <div class="flex flex-col sm:flex-row sm:items-center gap-3">
        <button
          onClick={() => navigate('/admin/accounts')}
          class="self-start p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Back to accounts"
        >
          <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div class="min-w-0">
          <h1 class="text-xl sm:text-3xl font-bold text-gray-900">Account Inbox</h1>
          <Show when={inboxData()?.account}>
            <p class="mt-1 text-xs sm:text-base text-gray-600 truncate">
              Viewing inbox for{' '}
              <span class="font-semibold">{inboxData()?.account.email_address}</span>
            </p>
          </Show>
        </div>
      </div>

      {/* Account info card */}
      <Show when={!inboxData.loading && inboxData()?.account}>
        {(account) => (
          <Card>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div class="col-span-2 sm:col-span-1">
                <p class="text-xs sm:text-sm text-gray-500 mb-0.5">Email</p>
                <p class="font-semibold text-gray-900 text-sm break-all">{account().email_address}</p>
              </div>
              <div>
                <p class="text-xs sm:text-sm text-gray-500 mb-0.5">Domain</p>
                <p class="font-semibold text-gray-900 text-sm">{account().domain_name}</p>
              </div>
              <div>
                <p class="text-xs sm:text-sm text-gray-500 mb-0.5">Type</p>
                <span class={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  account().is_custom ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {account().is_custom ? 'Custom' : 'Random'}
                </span>
              </div>
              <div>
                <p class="text-xs sm:text-sm text-gray-500 mb-0.5">Total Emails</p>
                <p class="font-semibold text-gray-900 text-sm">{inboxData()?.total || 0}</p>
              </div>
            </div>
          </Card>
        )}
      </Show>

      {/* Inbox messages */}
      <Card>
        <div class="space-y-4">
          <div class="flex items-center justify-between gap-3 flex-wrap">
            <h2 class="text-base sm:text-xl font-semibold text-gray-900">Inbox Messages</h2>
            <div class="flex items-center gap-3">
              <select
                value={pageSize()}
                onChange={(e) => {
                  const size = Number(e.currentTarget.value);
                  setPageSize(size);
                  setCurrentPage(1);
                  setExpandedEmail(null);
                  setSearchParams({ limit: size.toString(), page: '1' });
                }}
                class="text-sm border border-gray-300 rounded-lg px-3 py-2.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span class="text-xs sm:text-sm text-gray-500">{inboxData()?.total || 0} total</span>
            </div>
          </div>

          <Show
            when={!inboxData.loading && inboxData()}
            fallback={<SkeletonTable rows={5} columns={5} />}
          >
            <Show
              when={inboxData()?.emails && inboxData()!.emails.length > 0}
              fallback={
                <div class="text-center py-12">
                  <div class="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg class="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p class="text-gray-500 font-medium">No emails found</p>
                  <p class="text-sm text-gray-400 mt-1">This inbox is currently empty</p>
                </div>
              }
            >
              {/* Desktop table */}
              <div class="hidden sm:block overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-36">From</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-36">Received</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-20">Status</th>
                      <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-20">Action</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <For each={inboxData()?.emails}>
                      {(email) => (
                        <>
                          <tr class="hover:bg-gray-50 transition-colors">
                            <td class="px-4 py-3">
                              <div class="text-sm font-medium text-gray-900" title={email.sender_name || email.sender}>
                                {truncate(email.sender_name || email.sender, SENDER_LIMIT)}
                              </div>
                              <Show when={email.sender_name}>
                                <div class="text-xs text-gray-500 truncate max-w-[180px]" title={email.sender}>
                                  {truncate(email.sender, 24)}
                                </div>
                              </Show>
                            </td>
                            <td class="px-4 py-3">
                              <div class="text-sm text-gray-900 font-medium" title={email.subject || '(No Subject)'}>
                                {truncate(email.subject || '(No Subject)', SUBJECT_LIMIT)}
                              </div>
                            </td>
                            <td class="px-4 py-3">
                              <div class="text-xs text-gray-500 whitespace-nowrap">{formatDate(email.received_at)}</div>
                            </td>
                            <td class="px-4 py-3">
                              <span class={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                email.is_read ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {email.is_read ? 'Read' : 'Unread'}
                              </span>
                            </td>
                            <td class="px-4 py-3">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleShowEmail(email)}
                                disabled={loadingMessageId() === email.message_id}
                              >
                                {loadingMessageId() === email.message_id
                                  ? '...'
                                  : expandedEmail()?.message_id === email.message_id
                                  ? 'Hide'
                                  : 'Show'}
                              </Button>
                            </td>
                          </tr>
                          {/* Expanded email body row */}
                          <Show when={expandedEmail()?.message_id === email.message_id && expandedEmail()}>
                            {(msg) => (
                              <tr>
                                <td colspan="5" class="px-4 py-0">
                                  <div class="border border-gray-200 rounded-xl bg-gray-50 overflow-hidden my-2">
                                    {/* Email detail header */}
                                    <div class="px-5 py-4 border-b border-gray-200 bg-white">
                                      <div class="flex items-start justify-between gap-4">
                                        <div class="min-w-0">
                                          <h3 class="font-semibold text-gray-900 text-sm break-words">
                                            {msg().subject || '(No Subject)'}
                                          </h3>
                                          <p class="text-xs text-gray-500 mt-0.5 break-all">
                                            From: {msg().sender_name ? `${msg().sender_name} <${msg().sender}>` : msg().sender}
                                          </p>
                                          <p class="text-xs text-gray-400 mt-0.5">{formatDate(msg().received_at)}</p>
                                        </div>
                                        <button
                                          onClick={() => setExpandedEmail(null)}
                                          class="text-gray-400 hover:text-gray-600 flex-shrink-0"
                                          aria-label="Close"
                                        >
                                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                          </svg>
                                        </button>
                                      </div>
                                    </div>
                                    {/* Email body */}
                                    <div class="px-5 py-4 max-h-96 overflow-y-auto">
                                      <Show
                                        when={msg().body_html}
                                        fallback={
                                          <pre class="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
                                            {msg().body_text || '(No content)'}
                                          </pre>
                                        }
                                      >
                                        <div
                                          class="prose prose-sm max-w-none text-gray-800 overflow-x-auto"
                                          innerHTML={msg().body_html!}
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

              {/* Mobile card list */}
              <div class="sm:hidden divide-y divide-gray-200">
                <For each={inboxData()?.emails}>
                  {(email) => (
                    <div class={`py-4 space-y-2 ${!email.is_read ? 'bg-blue-50/40' : ''}`}>
                      <div class="flex items-start justify-between gap-2 px-1">
                        <div class="min-w-0 flex-1">
                          <div class="flex items-center gap-1.5 mb-0.5">
                            {!email.is_read && <span class="w-2 h-2 bg-main-red rounded-full flex-shrink-0" />}
                            <span class="font-semibold text-gray-900 text-sm truncate">
                              {truncate(email.sender_name || email.sender, SENDER_LIMIT)}
                            </span>
                          </div>
                          <p class="text-sm text-gray-700 truncate">
                            {truncate(email.subject || '(No Subject)', SUBJECT_LIMIT)}
                          </p>
                          <p class="text-xs text-gray-400 mt-0.5">{formatDate(email.received_at)}</p>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleShowEmail(email)}
                          disabled={loadingMessageId() === email.message_id}
                          class="flex-shrink-0"
                        >
                          {loadingMessageId() === email.message_id
                            ? '...'
                            : expandedEmail()?.message_id === email.message_id
                            ? 'Hide'
                            : 'Show'}
                        </Button>
                      </div>
                      {/* Mobile expanded view */}
                      <Show when={expandedEmail()?.message_id === email.message_id && expandedEmail()}>
                        {(msg) => (
                          <div class="border border-gray-200 rounded-xl overflow-hidden mx-1">
                            <div class="px-4 py-3 bg-white border-b border-gray-200">
                              <p class="font-semibold text-sm text-gray-900 break-words">{msg().subject || '(No Subject)'}</p>
                              <p class="text-xs text-gray-500 mt-0.5 break-all">
                                {msg().sender_name ? `${msg().sender_name} <${msg().sender}>` : msg().sender}
                              </p>
                            </div>
                            <div class="px-4 py-3 bg-gray-50 max-h-64 overflow-y-auto">
                              <Show
                                when={msg().body_html}
                                fallback={
                                  <pre class="whitespace-pre-wrap text-xs text-gray-800 font-sans leading-relaxed">
                                    {msg().body_text || '(No content)'}
                                  </pre>
                                }
                              >
                                <div
                                  class="prose prose-xs max-w-none text-gray-800 overflow-x-auto"
                                  innerHTML={msg().body_html!}
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
        </div>
      </Card>
    </div>
  );
};

export default AccountInboxPage;
