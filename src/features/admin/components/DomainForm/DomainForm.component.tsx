import { Component } from 'solid-js';
import { Input, Button } from '../../../../shared/components/ui';

export interface DomainFormData {
  name: string;
  cloudflare_zone_id: string;
}

export interface DomainFormProps {
  data: DomainFormData;
  loading?: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onChange: (field: keyof DomainFormData, value: string) => void;
}

const DomainForm: Component<DomainFormProps> = (props) => {
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-4">
      <Input
        label="Domain Name"
        placeholder="example.com"
        value={props.data.name}
        onInput={(value) => props.onChange('name', value)}
        required
        helperText="Enter the domain name (e.g., example.com)"
      />

      <Input
        label="Cloudflare Zone ID"
        placeholder="Optional"
        value={props.data.cloudflare_zone_id}
        onInput={(value) => props.onChange('cloudflare_zone_id', value)}
        helperText="Optional: Cloudflare Zone ID for email routing"
      />

      <div class="flex items-center gap-3 pt-4">
        <Button
          type="submit"
          loading={props.loading}
          disabled={props.loading}
          fullWidth
        >
          Add Domain
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

export default DomainForm;
