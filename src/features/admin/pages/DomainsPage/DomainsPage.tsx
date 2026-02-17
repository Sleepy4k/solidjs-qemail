import { Component, createResource, createSignal, Show } from 'solid-js';
import { DomainList, DomainForm, DomainFormData } from '../../components';
import { Card, Button, Alert, Modal } from '../../../../shared/components/ui';
import { adminService } from '../../services/admin.service';
import { useAnimation } from '../../../../shared/hooks/use-animation.hook';
import type { AdminDomain } from '../../types/admin.types';

const DomainsPage: Component = () => {
  const [domains, { refetch }] = createResource(() => adminService.listDomains());

  let headerRef: HTMLDivElement | undefined;
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);
  const [successMessage, setSuccessMessage] = createSignal<string | null>(null);

  const [formData, setFormData] = createSignal<DomainFormData>({
    name: '',
    cloudflare_zone_id: '',
  });

  useAnimation(() => headerRef, {
    animation: 'fadeIn',
    duration: 0.6,
  });

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

  const handleDelete = async (domain: AdminDomain) => {
    if (!confirm(`Are you sure you want to delete "${domain.name}"?`)) {
      return;
    }

    try {
      await adminService.deleteDomain(domain.id);
      setSuccessMessage('Domain deleted successfully!');
      refetch();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete domain');
    }
  };

  return (
    <div class="space-y-6">
      <div ref={headerRef} class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Domain Management</h1>
          <p class="mt-2 text-gray-600">
            Manage email domains for your temporary email service
          </p>
        </div>
        <Button
          onClick={handleOpenModal}
          icon={
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          }
        >
          Add Domain
        </Button>
      </div>

      <Show when={errorMessage()}>
        <Alert
          type="error"
          message={errorMessage()!}
          onClose={() => setErrorMessage(null)}
        />
      </Show>

      <Show when={successMessage()}>
        <Alert
          type="success"
          message={successMessage()!}
          onClose={() => setSuccessMessage(null)}
        />
      </Show>

      <Show
        when={!domains.loading && domains()}
        fallback={
          <Card padding="lg">
            <div class="flex items-center justify-center py-12">
              <div class="text-center">
                <div class="animate-spin w-12 h-12 border-4 border-main-red border-t-transparent rounded-full mx-auto"></div>
                <p class="mt-4 text-gray-600">Loading domains...</p>
              </div>
            </div>
          </Card>
        }
      >
        <DomainList
          domains={domains() || []}
          onToggleActive={handleToggleActive}
          onDelete={handleDelete}
          loading={isLoading()}
        />
      </Show>

      <Modal
        isOpen={isModalOpen()}
        onClose={handleCloseModal}
        title="Add New Domain"
        size="md"
      >
        <DomainForm
          data={formData()}
          loading={isLoading()}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          onChange={handleFormChange}
        />
      </Modal>
    </div>
  );
};

export default DomainsPage;
