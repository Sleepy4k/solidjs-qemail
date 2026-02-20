import { Component, onMount } from "solid-js";
import { Input, Button } from "../../../../shared/components/ui";

export interface DomainEditFormData {
  cloudflare_zone_id: string;
  cf_api_token: string;
  cf_account_id: string;
  cf_worker_name: string;
}

export interface DomainEditFormProps {
  domainName: string;
  initialData: DomainEditFormData;
  loading?: boolean;
  onSubmit: (data: DomainEditFormData) => void;
  onCancel: () => void;
}

const DomainEditForm: Component<DomainEditFormProps> = (props) => {
  let zoneIdRef: HTMLInputElement | undefined;
  let apiTokenRef: HTMLInputElement | undefined;
  let accountIdRef: HTMLInputElement | undefined;
  let workerNameRef: HTMLInputElement | undefined;

  onMount(() => {
    if (zoneIdRef) zoneIdRef.value = props.initialData.cloudflare_zone_id;
    if (apiTokenRef) apiTokenRef.value = props.initialData.cf_api_token;
    if (accountIdRef) accountIdRef.value = props.initialData.cf_account_id;
    if (workerNameRef) workerNameRef.value = props.initialData.cf_worker_name;
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit({
      cloudflare_zone_id: zoneIdRef?.value ?? "",
      cf_api_token: apiTokenRef?.value ?? "",
      cf_account_id: accountIdRef?.value ?? "",
      cf_worker_name: workerNameRef?.value ?? "",
    });
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
            ref={zoneIdRef}
            label="Zone ID"
            placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            helperText="Cloudflare Zone ID untuk domain ini"
            disabled={props.loading}
          />

          <Input
            ref={apiTokenRef}
            label="API Token"
            placeholder="Cloudflare API Token"
            type="password"
            helperText="Token dengan permission DNS Edit dan Email Routing"
            disabled={props.loading}
          />

          <Input
            ref={accountIdRef}
            label="Account ID"
            placeholder="Cloudflare Account ID"
            helperText="ID akun Cloudflare yang mengelola domain ini"
            disabled={props.loading}
          />

          <Input
            ref={workerNameRef}
            label="Worker Name"
            placeholder="Nama Cloudflare Worker"
            helperText="Nama Worker yang digunakan untuk routing email"
            disabled={props.loading}
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
