import { Component, createResource, Show, For } from 'solid-js';
import { useParams, useNavigate } from '@solidjs/router';
import { Card } from '../../../../shared/components/ui/Card';
import { SkeletonTable } from '../../../../shared/components/Skeleton';
import { adminApiService } from '../../services/admin-api.service';

const AccountInboxPage: Component = () => {
  const params = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const accountId = () => parseInt(params.accountId);

  const [inboxData] = createResource(accountId, (id) =>
    adminApiService.getAccountInbox(id, { page: 1, limit: 50 })
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div class="space-y-6">
      <div class="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/accounts')}
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Account Inbox</h1>
          <Show when={inboxData()?.account}>
            <p class="mt-2 text-gray-600">
              Viewing inbox for <span class="font-semibold">{inboxData()?.account.email_address}</span>
            </p>
          </Show>
        </div>
      </div>

      <Show when={!inboxData.loading && inboxData()?.account}>
        {(account) => (
          <Card>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p class="text-sm text-gray-500">Email</p>
                <p class="font-semibold text-gray-900">{account().email_address}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Domain</p>
                <p class="font-semibold text-gray-900">{account().domain_name}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Type</p>
                <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  account().is_custom ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {account().is_custom ? 'Custom' : 'Random'}
                </span>
              </div>
              <div>
                <p class="text-sm text-gray-500">Total Emails</p>
                <p class="font-semibold text-gray-900">{inboxData()?.total || 0}</p>
              </div>
            </div>
          </Card>
        )}
      </Show>

      <Card>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">Inbox Messages</h2>
            <span class="text-sm text-gray-500">
              {inboxData()?.total || 0} total emails
            </span>
          </div>

          <Show
            when={!inboxData.loading && inboxData()}
            fallback={<SkeletonTable rows={5} columns={4} />}
          >
            <Show
              when={inboxData()?.emails && inboxData()!.emails.length > 0}
              fallback={
                <div class="text-center py-12">
                  <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p class="text-gray-500 font-medium">No emails found</p>
                  <p class="text-sm text-gray-400 mt-1">This inbox is currently empty</p>
                </div>
              }
            >
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        From
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preview
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Received
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <For each={inboxData()?.emails}>
                      {(email) => (
                        <tr class="hover:bg-gray-50 transition-colors">
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm font-medium text-gray-900">
                              {email.sender_name || email.sender}
                            </div>
                            <Show when={email.sender_name}>
                              <div class="text-xs text-gray-500">{email.sender}</div>
                            </Show>
                          </td>
                          <td class="px-6 py-4">
                            <div class="text-sm text-gray-900 font-medium">
                              {email.subject || '(No Subject)'}
                            </div>
                          </td>
                          <td class="px-6 py-4">
                            <div class="text-sm text-gray-500 max-w-md">
                              {email.message_id}
                            </div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-500">
                              {formatDate(email.received_at)}
                            </div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              email.is_read ? 'bg-gray-100 text-gray-800' : 'bg-primary-100 text-primary-800'
                            }`}>
                              {email.is_read ? 'Read' : 'Unread'}
                            </span>
                          </td>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </div>
            </Show>
          </Show>
        </div>
      </Card>
    </div>
  );
};

export default AccountInboxPage;
