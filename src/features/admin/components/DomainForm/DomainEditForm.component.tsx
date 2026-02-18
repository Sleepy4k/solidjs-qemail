import { Component } from 'solid-js';
import { Input, Button } from '../../../../shared/components/ui';

export interface DomainEditFormData {
  cloudflare_zone_id: string;
  cf_api_token: string;
  cf_account_id: string;
  cf_worker_name: string;
}

export interface DomainEditFormProps {
  domainName: string;
  data: DomainEditFormData;
  loading?: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onChange: (field: keyof DomainEditFormData, value: string) => void;
}

const DomainEditForm: Component<DomainEditFormProps> = (props) => {
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-4">
      <div class="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 mb-2">
        <p class="text-xs text-gray-500 mb-0.5">Domain</p>
        <p class="text-sm font-semibold text-gray-900">{props.domainName}</p>
      </div>

      <div>
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Cloudflare Configuration
        </p>
        <div class="space-y-3">
          <Input
            label="Zone ID"
            placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            value={props.data.cloudflare_zone_id}
            onInput={(value) => props.onChange('cloudflare_zone_id', value)}
            helperText="Cloudflare Zone ID untuk domain ini"
          />

          <Input
            label="API Token"
            placeholder="Cloudflare API Token"
            type="password"
            value={props.data.cf_api_token}
            onInput={(value) => props.onChange('cf_api_token', value)}
            helperText="Token dengan permission DNS Edit dan Email Routing"
          />

          <Input
            label="Account ID"
            placeholder="Cloudflare Account ID"
            value={props.data.cf_account_id}
            onInput={(value) => props.onChange('cf_account_id', value)}
            helperText="ID akun Cloudflare yang mengelola domain ini"
          />

          <Input
            label="Worker Name"
            placeholder="Nama Cloudflare Worker"
            value={props.data.cf_worker_name}
            onInput={(value) => props.onChange('cf_worker_name', value)}
            helperText="Nama Worker yang digunakan untuk routing email"
          />
        </div>
      </div>

      <div class="flex items-center gap-3 pt-2">
        <Button
          type="submit"
          loading={props.loading}
          disabled={props.loading}
          fullWidth
        >
          Save Configuration
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={props.onCancel}
          disabled={props.loading}
          fullWidth
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default DomainEditForm;
