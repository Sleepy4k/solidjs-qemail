import { Component, JSX, splitProps, mergeProps } from 'solid-js';

export interface InputProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'onInput'> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  inputSize?: 'sm' | 'md' | 'lg';
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  onInput?: (value: string) => void;
}

const Input: Component<InputProps> = (props) => {
  const merged = mergeProps(
    {
      fullWidth: true,
      inputSize: 'md' as const,
      type: 'text',
    },
    props
  );

  const [local, others] = splitProps(merged, [
    'label',
    'error',
    'helperText',
    'fullWidth',
    'inputSize',
    'leftIcon',
    'rightIcon',
    'onInput',
    'class',
  ]);

  let inputRef: HTMLInputElement | undefined;

  const handleInput = () => {
    if (inputRef && local.onInput) {
      local.onInput(inputRef.value);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg',
  };

  const baseClasses = 'w-full border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed';
  const errorClasses = local.error
    ? 'border-red-500 focus:ring-red-500'
    : 'border-gray-300 hover:border-gray-400';

  return (
    <div class={local.fullWidth ? 'w-full' : ''}>
      {local.label && (
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {local.label}
        </label>
      )}
      
      <div class="relative">
        {local.leftIcon && (
          <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {local.leftIcon}
          </div>
        )}

        <input
          ref={inputRef}
          class={`
            ${baseClasses}
            ${errorClasses}
            ${sizeClasses[local.inputSize]}
            ${local.leftIcon ? 'pl-10' : ''}
            ${local.rightIcon ? 'pr-10' : ''}
            ${local.class || ''}
          `}
          onInput={handleInput}
          {...others}
        />

        {local.rightIcon && (
          <div class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {local.rightIcon}
          </div>
        )}
      </div>

      {local.error && (
        <p class="mt-1 text-sm text-red-600">{local.error}</p>
      )}
      
      {!local.error && local.helperText && (
        <p class="mt-1 text-sm text-gray-500">{local.helperText}</p>
      )}
    </div>
  );
};

export default Input;
