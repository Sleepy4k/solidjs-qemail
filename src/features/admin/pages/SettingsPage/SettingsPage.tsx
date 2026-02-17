import { Component, createResource, Show, For, createSignal, onMount } from 'solid-js';
import gsap from 'gsap';
import { Card } from '../../../../shared/components/ui/Card';
import { Button } from '../../../../shared/components/ui/Button';
import { Input } from '../../../../shared/components/ui/Input';
import { Alert } from '../../../../shared/components/ui/Alert';
import { adminApiService } from '../../services/admin-api.service';
import type { Setting } from '../../../../shared/types/admin.types';

const SettingsPage: Component = () => {
  const [editingSetting, setEditingSetting] = createSignal<Setting | null>(null);
  const [editValue, setEditValue] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal('');
  const [success, setSuccess] = createSignal('');

  let headerRef: HTMLDivElement | undefined;

  const [settings, { refetch }] = createResource(() => adminApiService.getSettings());

  onMount(() => {
    if (headerRef) {
      gsap.fromTo(
        headerRef,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
  });

  const handleEdit = (setting: Setting) => {
    setEditingSetting(setting);
    setEditValue(setting.value);
  };

  const handleCancel = () => {
    setEditingSetting(null);
    setEditValue('');
  };

  const handleSave = async () => {
    const setting = editingSetting();
    if (!setting) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await adminApiService.updateSetting({
        key: setting.key,
        value: editValue(),
      });

      setSuccess('Setting updated successfully!');
      setEditingSetting(null);
      refetch();
    } catch (err: any) {
      setError(err.message || 'Failed to update setting');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div class="space-y-6">
      <div ref={headerRef}>
        <h1 class="text-3xl font-bold text-gray-900">System Settings</h1>
        <p class="mt-2 text-main-gray">
          Configure application settings and preferences
        </p>
      </div>

      <Show when={error()}>
        <Alert type="error" message={error()} onClose={() => setError("")} />
      </Show>

      <Show when={success()}>
        <Alert
          type="success"
          message={success()}
          onClose={() => setSuccess("")}
        />
      </Show>

      <Show
        when={!settings.loading && settings()}
        fallback={
          <Card>
            <div class="flex items-center justify-center py-12">
              <div class="text-center">
                <div class="animate-spin w-12 h-12 border-4 border-main-red border-t-transparent rounded-full mx-auto"></div>
                <p class="mt-4 text-main-gray">Loading settings...</p>
              </div>
            </div>
          </Card>
        }
      >
        <Card>
          <div class="divide-y divide-gray-200">
            <For
              each={settings()}
              fallback={
                <div class="p-12 text-center">
                  <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg
                      class="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <p class="text-main-gray">No settings found</p>
                </div>
              }
            >
              {(setting) => (
                <div class="p-6 hover:bg-gray-50 transition-colors">
                  <div class="flex items-start justify-between gap-6">
                    <div class="flex-1 min-w-0">
                      <h3 class="text-sm font-semibold text-main-red uppercase tracking-wide mb-2 flex items-center gap-2">
                        {setting.key}
                      </h3>

                      <Show
                        when={editingSetting()?.id === setting.id}
                        fallback={
                          <>
                            <div class="mt-2">
                              <code class="inline-block px-4 py-2 bg-main-lightGray rounded-lg text-sm font-mono text-gray-900 break-all">
                                {setting.value}
                              </code>
                            </div>
                            <p class="mt-3 text-xs text-main-gray">
                              Last updated: {formatDate(setting.updated_at)}
                            </p>
                          </>
                        }
                      >
                        <div class="space-y-3">
                          <Input
                            value={editValue()}
                            onInput={(value) => setEditValue(value)}
                            disabled={isLoading()}
                          />
                          <div class="flex gap-2">
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={handleSave}
                              disabled={isLoading()}
                            >
                              {isLoading() ? "Saving..." : "Save"}
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={handleCancel}
                              disabled={isLoading()}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </Show>
                    </div>

                    <Show when={editingSetting()?.id !== setting.id}>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEdit(setting)}
                      >
                        Edit
                      </Button>
                    </Show>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Card>
      </Show>

      <div class="p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div>
          <h3 class="text-sm font-semibold text-blue-900 mb-1">
            About Settings
          </h3>
          <p class="text-xs text-blue-700">
            These settings control various aspects of the application. Be
            careful when modifying values as incorrect settings may affect
            system functionality.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
