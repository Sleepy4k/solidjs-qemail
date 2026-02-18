import { Component, JSX, Show, onMount, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';
import gsap from 'gsap';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: JSX.Element;
  footer?: JSX.Element;
}

const Modal: Component<ModalProps> = (props) => {
  let overlayRef: HTMLDivElement | undefined;
  let contentRef: HTMLDivElement | undefined;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.isOpen) {
      props.onClose();
    }
  };

  onMount(() => {
    document.addEventListener('keydown', handleEscape);
  });

  onCleanup(() => {
    document.removeEventListener('keydown', handleEscape);
  });

  onMount(() => {
    if (props.isOpen && overlayRef && contentRef) {
      gsap.fromTo(
        overlayRef,
        { opacity: 0 },
        { opacity: 1, duration: 0.2 }
      );
      gsap.fromTo(
        contentRef,
        { opacity: 0, scale: 0.9, y: -20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'back.out(1.7)' }
      );
    }
  });

  return (
    <Show when={props.isOpen}>
      <Portal>
        <div class="fixed inset-0 z-[9000] overflow-y-auto">
          <div
            ref={overlayRef}
            class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={props.onClose}
          />

          <div class="flex min-h-full items-center justify-center p-4">
            <div
              ref={contentRef}
              class={`
                relative bg-white rounded-xl shadow-2xl w-full
                ${sizeClasses[props.size || 'md']}
                transform transition-all
              `}
              onClick={(e) => e.stopPropagation()}
            >
              <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 class="text-xl font-semibold text-gray-900">
                  {props.title}
                </h3>
                <button
                  onClick={props.onClose}
                  class="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div class="p-6">
                {props.children}
              </div>

              <Show when={props.footer}>
                <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                  {props.footer}
                </div>
              </Show>
            </div>
          </div>
        </div>
      </Portal>
    </Show>
  );
};

export default Modal;
