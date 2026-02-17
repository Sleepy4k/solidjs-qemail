import { Component, For, Show } from 'solid-js';
import { Card, Button } from '../../../../shared/components/ui';
import { useStaggerAnimation } from '../../../../shared/hooks/use-animation.hook';
import { formatDateTime } from '../../../../shared/utils/format.util';
import type { AdminDomain } from '../../types/admin.types';

export interface DomainListProps {
  domains: AdminDomain[];
  onToggleActive: (domain: AdminDomain) => void;
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
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3">
                    <h3 class="text-lg font-semibold text-gray-900">
                      {domain.name}
                    </h3>
                    <Show
                      when={domain.is_active}
                      fallback={
                        <span class="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Inactive
                        </span>
                      }
                    >
                      <span class="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </Show>
                  </div>

                  <div class="mt-2 space-y-1">
                    <Show when={domain.cloudflare_zone_id}>
                      <p class="text-sm text-gray-600">
                        <span class="font-medium">Zone ID:</span>{' '}
                        <code class="px-2 py-0.5 bg-gray-100 rounded text-xs">
                          {domain.cloudflare_zone_id}
                        </code>
                      </p>
                    </Show>
                    <p class="text-xs text-gray-500">
                      Created: {formatDateTime(domain.created_at)}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <Button
                    variant={domain.is_active ? 'secondary' : 'success'}
                    size="sm"
                    onClick={() => props.onToggleActive(domain)}
                    disabled={props.loading}
                  >
                    {domain.is_active ? 'Disable' : 'Enable'}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => props.onDelete(domain)}
                    disabled={props.loading}
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
