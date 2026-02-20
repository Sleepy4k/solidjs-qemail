import { Component } from "solid-js";
import { Input, Button } from "../../../../shared/components/ui";

export interface DomainFormData {
  name: string;
  cloudflare_zone_id: string;
}

export interface DomainFormProps {
  loading?: boolean;
  onSubmit: (data: DomainFormData) => void;
  onCancel: () => void;
}

const DomainForm: Component<DomainFormProps> = (props) => {
  let nameRef: HTMLInputElement | undefined;
  let zoneIdRef: HTMLInputElement | undefined;

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit({
      name: nameRef?.value ?? "",
      cloudflare_zone_id: zoneIdRef?.value ?? "",
    });
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-4">
      <Input
        ref={nameRef}
        label="Domain Name"
        placeholder="example.com"
        required
        helperText="Enter the domain name (e.g., example.com)"
        disabled={props.loading}
      />

      <Input
        ref={zoneIdRef}
        label="Cloudflare Zone ID"
        placeholder="Optional"
        helperText="Optional: Cloudflare Zone ID for email routing"
        disabled={props.loading}
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
