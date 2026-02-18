import { Component, For, Show } from 'solid-js';
import { Card, Button } from '../../../../shared/components/ui';
import { useStaggerAnimation } from '../../../../shared/hooks/use-animation.hook';
import { formatDateTime } from '../../../../shared/utils/format.util';
import type { AdminDomain } from '../../types/admin.types';

export interface DomainListProps {
  domains: AdminDomain[];
  onToggleActive: (domain: AdminDomain) => void;
  onEditConfig: (domain: AdminDomain) => void;
  onViewCfRules: (domain: AdminDomain) => void;
  onDelete: (domain: AdminDomain) => void;
  loading?: boolean;
}

const DomainList: Component<DomainListProps> = (props) => {
  let listRef: HTMLDivElement | undefined;

  useStaggerAnimation(
    () => listRef?.querySelectorAll('[data-domain-item]') || [],
    { stagger: 0.05 }
  );

  return (
    <div ref={listRef} class="space-y-3">
      <For
        each={props.domains}
        fallback={
          <Card padding="lg">
            <div class="text-center py-12">
              <svg
                class="mx-auto h-12 w-12 text-gray-400"
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
              <p class="mt-4 text-gray-600 font-medium">No domains found</p>
              <p class="mt-1 text-sm text-gray-500">
                Get started by adding your first domain
              </p>
            </div>
          </Card>
        }
      >
        {(domain) => (
          <div data-domain-item>
            <Card hover padding="lg" shadow="sm">
              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3 flex-wrap">
                    <h3 class="text-base sm:text-lg font-semibold text-gray-900">
                      {domain.name}
                    </h3>
                    <Show
                      when={domain.is_active}
                      fallback={
                        <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Inactive
                        </span>
                      }
                    >
                      <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </Show>
                  </div>

                  <div class="mt-2 space-y-1">
                    <p class="text-xs text-gray-600 flex items-center gap-1.5">
                      <span class="font-medium text-gray-500">Domain ID:</span>
                      <code class="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-mono">
                        {domain.id}
                      </code>
                    </p>
                    <Show when={domain.cloudflare_zone_id}>
                      <p class="text-xs text-gray-600 flex items-center gap-1.5">
                        <span class="font-medium text-gray-500">Zone ID:</span>
                        <code class="px-1.5 py-0.5 bg-gray-100 rounded text-xs break-all">
                          {domain.cloudflare_zone_id}
                        </code>
                      </p>
                    </Show>
                    <Show when={domain.cf_account_id}>
                      <p class="text-xs text-gray-600 flex items-center gap-1.5">
                        <span class="font-medium text-gray-500">Account ID:</span>
                        <code class="px-1.5 py-0.5 bg-gray-100 rounded text-xs break-all">
                          {domain.cf_account_id}
                        </code>
                      </p>
                    </Show>
                    <Show when={domain.cf_worker_name}>
                      <p class="text-xs text-gray-600 flex items-center gap-1.5">
                        <span class="font-medium text-gray-500">Worker:</span>
                        <code class="px-1.5 py-0.5 bg-gray-100 rounded text-xs">
                          {domain.cf_worker_name}
                        </code>
                      </p>
                    </Show>
                    <Show when={domain.cf_api_token}>
                      <p class="text-xs flex items-center gap-1.5">
                        <span class="font-medium text-gray-500">API Token:</span>
                        <span class="px-1.5 py-0.5 bg-green-50 text-green-700 rounded text-xs font-medium">
                          ✓ Configured
                        </span>
                      </p>
                    </Show>
                    <p class="text-xs text-gray-400 mt-1">
                      Created: {formatDateTime(domain.created_at)}
                    </p>
                  </div>
                </div>

                {/* Action buttons — 2x2 grid on mobile, single row on sm+ */}
                <div class="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 flex-shrink-0">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => props.onEditConfig(domain)}
                    disabled={props.loading}
                    class="w-full sm:w-auto justify-center"
                  >
                    Config
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => props.onViewCfRules(domain)}
                    disabled={props.loading}
                    class="w-full sm:w-auto justify-center"
                  >
                    CF Rules
                  </Button>
                  <Button
                    variant={domain.is_active ? 'secondary' : 'success'}
                    size="sm"
                    onClick={() => props.onToggleActive(domain)}
                    disabled={props.loading}
                    class="w-full sm:w-auto justify-center"
                  >
                    {domain.is_active ? 'Disable' : 'Enable'}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => props.onDelete(domain)}
                    disabled={props.loading}
                    class="w-full sm:w-auto justify-center"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </For>
    </div>
  );
};

export default DomainList;

