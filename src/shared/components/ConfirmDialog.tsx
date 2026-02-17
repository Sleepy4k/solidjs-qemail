import { Component, Show, createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: Component<ConfirmDialogProps> = (props) => {
  const getVariantClasses = () => {
    switch (props.variant) {
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white';
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      case 'info':
      default:
        return 'bg-primary-500 hover:bg-primary-600 text-white';
    }
  };

  const getIconColor = () => {
    switch (props.variant) {
      case 'danger':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
      default:
        return 'text-primary-500';
    }
  };

  return (
    <Show when={props.isOpen}>
      <Portal>
        <div class="fixed inset-0 z-[9999] flex items-center justify-center">
          <div
            class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={props.onCancel}
          />

          <div class="relative bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-w-md w-full mx-4 animate-scale-in">
            <div class="p-6">
              <div class={`w-12 h-12 rounded-full ${props.variant === 'danger' ? 'bg-red-100' : props.variant === 'warning' ? 'bg-yellow-100' : 'bg-primary-100'} flex items-center justify-center mb-4`}>
                <Show when={props.variant === 'danger'}>
                  <svg class={`w-6 h-6 ${getIconColor()}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </Show>
                <Show when={props.variant === 'warning'}>
                  <svg class={`w-6 h-6 ${getIconColor()}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </Show>
                <Show when={!props.variant || props.variant === 'info'}>
                  <svg class={`w-6 h-6 ${getIconColor()}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Show>
              </div>

              <h3 class="text-xl font-bold text-gray-900 mb-2">
                {props.title}
              </h3>

              <p class="text-gray-600 mb-6">
                {props.message}
              </p>

              <div class="flex gap-3">
                <button
                  type="button"
                  onClick={props.onCancel}
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  {props.cancelText || 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={props.onConfirm}
                  class={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${getVariantClasses()}`}
                >
                  {props.confirmText || 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Portal>
    </Show>
  );
};

export const useConfirmDialog = () => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [config, setConfig] = createSignal<{
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: 'danger' | 'warning' | 'info';
  }>({
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const confirm = (options: {
    title: string;
    message: string;
    onConfirm: () => void;
    variant?: 'danger' | 'warning' | 'info';
  }) => {
    setConfig(options);
    setIsOpen(true);
  };

  const handleConfirm = () => {
    config().onConfirm();
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    config,
    confirm,
    handleConfirm,
    handleCancel,
  };
};
