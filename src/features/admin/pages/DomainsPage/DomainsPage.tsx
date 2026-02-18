import { Component, createResource, createSignal, Show, For } from 'solid-js';
import { DomainList, DomainForm, DomainFormData, DomainEditForm, DomainEditFormData } from '../../components';
import { Card, Button, Alert, Modal } from '../../../../shared/components/ui';
import { ConfirmDialog, useConfirmDialog } from '../../../../shared/components/ConfirmDialog';
import { adminService } from '../../services/admin.service';
import { useAnimation } from '../../../../shared/hooks/use-animation.hook';
import type { AdminDomain, CfRule } from '../../types/admin.types';

const DomainsPage: Component = () => {
  const [domains, { refetch }] = createResource(() => adminService.listDomains());

  let headerRef: HTMLDivElement | undefined;

  // Add domain modal
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);
  const [successMessage, setSuccessMessage] = createSignal<string | null>(null);
  const { isOpen: isConfirmOpen, config: confirmConfig, confirm, handleConfirm, handleCancel } = useConfirmDialog();

  const [formData, setFormData] = createSignal<DomainFormData>({
    name: '',
    cloudflare_zone_id: '',
  });

  // Edit config modal
  const [isEditConfigOpen, setIsEditConfigOpen] = createSignal(false);
  const [editingDomain, setEditingDomain] = createSignal<AdminDomain | null>(null);
  const [isEditLoading, setIsEditLoading] = createSignal(false);
  const [editFormData, setEditFormData] = createSignal<DomainEditFormData>({
    cloudflare_zone_id: '',
    cf_api_token: '',
    cf_account_id: '',
    cf_worker_name: '',
  });

  // CF Rules modal
  const [isCfRulesOpen, setIsCfRulesOpen] = createSignal(false);
  const [cfRulesDomain, setCfRulesDomain] = createSignal<AdminDomain | null>(null);
  const [cfRules, setCfRules] = createSignal<CfRule[]>([]);
  const [cfRulesLoading, setCfRulesLoading] = createSignal(false);
  const [cfRulesError, setCfRulesError] = createSignal<string | null>(null);

  useAnimation(() => headerRef, {
    animation: 'fadeIn',
    duration: 0.6,
  });

  // --- Add domain ---
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setFormData({ name: '', cloudflare_zone_id: '' });
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormChange = (field: keyof DomainFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const data = formData();
    if (!data.name.trim()) {
      setErrorMessage('Domain name is required');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await adminService.createDomain({
        name: data.name.trim(),
        cloudflare_zone_id: data.cloudflare_zone_id.trim() || undefined,
      });
      setSuccessMessage('Domain added successfully!');
      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to add domain');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Toggle active ---
  const handleToggleActive = async (domain: AdminDomain) => {
    try {
      await adminService.updateDomain(domain.id, {
        is_active: !domain.is_active,
      });
      setSuccessMessage(`Domain ${domain.is_active ? 'disabled' : 'enabled'} successfully!`);
      refetch();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update domain');
    }
  };

  // --- Edit config ---
  const handleOpenEditConfig = (domain: AdminDomain) => {
    setEditingDomain(domain);
    setEditFormData({
      cloudflare_zone_id: domain.cloudflare_zone_id || '',
      cf_api_token: domain.cf_api_token || '',
      cf_account_id: domain.cf_account_id || '',
      cf_worker_name: domain.cf_worker_name || '',
    });
    setIsEditConfigOpen(true);
  };

  const handleCloseEditConfig = () => {
    setIsEditConfigOpen(false);
    setEditingDomain(null);
  };

  const handleEditFormChange = (field: keyof DomainEditFormData, value: string) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEditSubmit = async () => {
    const domain = editingDomain();
    if (!domain) return;

    setIsEditLoading(true);
    try {
      const data = editFormData();
      await adminService.updateDomain(domain.id, {
        cloudflare_zone_id: data.cloudflare_zone_id.trim() || undefined,
        cf_api_token: data.cf_api_token.trim() || undefined,
        cf_account_id: data.cf_account_id.trim() || undefined,
        cf_worker_name: data.cf_worker_name.trim() || undefined,
      });
      setSuccessMessage(`Configuration for "${domain.name}" updated successfully!`);
      setIsEditConfigOpen(false);
      refetch();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update configuration');
    } finally {
      setIsEditLoading(false);
    }
  };

  // --- CF Rules ---
  const handleViewCfRules = async (domain: AdminDomain) => {
    setCfRulesDomain(domain);
    setCfRules([]);
    setCfRulesError(null);
    setCfRulesLoading(true);
    setIsCfRulesOpen(true);

    try {
      const rules = await adminService.getCfRules(domain.id);
      setCfRules(rules);
    } catch (err: any) {
      setCfRulesError(err.message || 'Failed to load Cloudflare rules');
    } finally {
      setCfRulesLoading(false);
    }
  };

  const handleCloseCfRules = () => {
    setIsCfRulesOpen(false);
    setCfRulesDomain(null);
  };

  // --- Delete ---
  const handleDelete = (domain: AdminDomain) => {
    confirm({
      title: 'Delete Domain',
      message: `Are you sure you want to delete "${domain.name}"? This action cannot be undone.`,
      variant: 'danger',
      onConfirm: async () => {
        try {
          await adminService.deleteDomain(domain.id);
          setSuccessMessage('Domain deleted successfully!');
          refetch();
        } catch (err: any) {
          setErrorMessage(err.message || 'Failed to delete domain');
        }
      },
    });
  };

  return (
    <div class="space-y-6">
      <div ref={headerRef} class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-xl sm:text-3xl font-bold text-gray-900">Domain Management</h1>
          <p class="mt-1 sm:mt-2 text-xs sm:text-base text-gray-600">
            Manage email domains for your temporary email service
          </p>
        </div>
        <Button
          onClick={handleOpenModal}
          class="self-start sm:self-auto flex-shrink-0"
          icon={
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          }
        >
          Add Domain
        </Button>
      </div>

      <Show when={errorMessage()}>
        <Alert type="error" message={errorMessage()!} onClose={() => setErrorMessage(null)} />
      </Show>

      <Show when={successMessage()}>
        <Alert type="success" message={successMessage()!} onClose={() => setSuccessMessage(null)} />
      </Show>

      <Show
        when={!domains.loading && domains()}
        fallback={
          <Card padding="lg">
            <div class="flex items-center justify-center py-12">
              <div class="text-center">
                <div class="animate-spin w-12 h-12 border-4 border-main-red border-t-transparent rounded-full mx-auto" />
                <p class="mt-4 text-gray-600">Loading domains...</p>
              </div>
            </div>
          </Card>
        }
      >
        <DomainList
          domains={domains() || []}
          onToggleActive={handleToggleActive}
          onEditConfig={handleOpenEditConfig}
          onViewCfRules={handleViewCfRules}
          onDelete={handleDelete}
          loading={isLoading()}
        />
      </Show>

      {/* Modal: Add Domain */}
      <Modal isOpen={isModalOpen()} onClose={handleCloseModal} title="Add New Domain" size="md">
        <DomainForm
          data={formData()}
          loading={isLoading()}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          onChange={handleFormChange}
        />
      </Modal>

      {/* Modal: Edit CF Config */}
      <Modal
        isOpen={isEditConfigOpen()}
        onClose={handleCloseEditConfig}
        title="Edit Cloudflare Configuration"
        size="md"
      >
        <Show when={editingDomain()}>
          <DomainEditForm
            domainName={editingDomain()!.name}
            data={editFormData()}
            loading={isEditLoading()}
            onSubmit={handleEditSubmit}
            onCancel={handleCloseEditConfig}
            onChange={handleEditFormChange}
          />
        </Show>
      </Modal>

      {/* Modal: CF Rules */}
      <Modal
        isOpen={isCfRulesOpen()}
        onClose={handleCloseCfRules}
        title={`CF Rules — ${cfRulesDomain()?.name ?? ''}`}
        size="lg"
      >
        <Show when={cfRulesLoading()}>
          <div class="flex items-center justify-center py-12">
            <div class="text-center">
              <div class="animate-spin w-10 h-10 border-4 border-main-red border-t-transparent rounded-full mx-auto" />
              <p class="mt-3 text-sm text-gray-500">Fetching Cloudflare rules...</p>
            </div>
          </div>
        </Show>

        <Show when={cfRulesError()}>
          <div class="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {cfRulesError()}
          </div>
        </Show>

        <Show when={!cfRulesLoading() && !cfRulesError() && cfRules().length === 0}>
          <div class="text-center py-10">
            <svg class="mx-auto h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="mt-3 text-sm text-gray-500">No Cloudflare rules found for this domain.</p>
          </div>
        </Show>

        <Show when={!cfRulesLoading() && cfRules().length > 0}>
          <div class="space-y-2 max-h-96 overflow-y-auto">
            <For each={cfRules()}>
              {(rule) => (
                <div class="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
                  {/* Status dot */}
                  <div class={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${rule.enabled ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <div class="flex-1 min-w-0 space-y-1">
                    <div class="flex items-center gap-2 flex-wrap">
                      <span class="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                        {rule.type}
                      </span>
                      <span class={`px-2 py-0.5 rounded-full text-xs font-medium ${rule.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                        {rule.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                      <Show when={rule.action}>
                        <span class="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {rule.action as string}
                        </span>
                      </Show>
                    </div>
                    <Show when={rule.pattern}>
                      <p class="text-xs text-gray-600 break-all">
                        <span class="font-medium">Pattern:</span>{' '}
                        <code class="px-1 py-0.5 bg-white border border-gray-200 rounded text-xs">{rule.pattern as string}</code>
                      </p>
                    </Show>
                    <p class="text-xs text-gray-400 font-mono break-all">ID: {rule.id}</p>
                  </div>
                </div>
              )}
            </For>
          </div>
          <p class="text-xs text-gray-400 mt-3 text-right">{cfRules().length} rule(s) found</p>
        </Show>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen()}
        title={confirmConfig().title}
        message={confirmConfig().message}
        variant={confirmConfig().variant}
        confirmText="Delete"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default DomainsPage;

