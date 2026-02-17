import { Component, JSX, splitProps, mergeProps, onMount } from 'solid-js';
import * as animations from '../../../utils/animation.util';

export interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  bordered?: boolean;
  animated?: boolean;
}

const Card: Component<CardProps> = (props) => {
  const merged = mergeProps(
    {
      hover: false,
      padding: 'md' as const,
      shadow: 'md' as const,
      bordered: true,
      animated: true,
    },
    props
  );

  const [local, others] = splitProps(merged, [
    'hover',
    'padding',
    'shadow',
    'bordered',
    'animated',
    'children',
    'class',
  ]);

  let cardRef: HTMLDivElement | undefined;

  onMount(() => {
    if (local.animated && cardRef) {
      animations.fadeIn(cardRef, { duration: 0.5 });
    }
  });

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const baseClasses = 'bg-white rounded-lg transition-all duration-300';
  const hoverClasses = local.hover ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : '';
  const borderClasses = local.bordered ? 'border border-gray-200' : '';

  return (
    <div
      ref={cardRef}
      class={`
        ${baseClasses}
        ${paddingClasses[local.padding]}
        ${shadowClasses[local.shadow]}
        ${hoverClasses}
        ${borderClasses}
        ${local.class || ''}
      `}
      {...others}
    >
      {local.children}
    </div>
  );
};

export default Card;
