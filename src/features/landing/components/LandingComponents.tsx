import { Component, JSX, onMount } from 'solid-js';
import * as animations from '../../../shared/utils/animation.util';

interface FeatureCardProps {
  emoji: string;
  title: string;
  description: string;
  gradient: string;
  delay?: number;
}

export const FeatureCard: Component<FeatureCardProps> = (props) => {
  let cardRef: HTMLDivElement | undefined;

  onMount(() => {
    if (cardRef) {
      animations.scaleIn(cardRef, { duration: 0.6, delay: props.delay || 0 });
    }
  });

  return (
    <div
      ref={cardRef}
      class={`
        relative group overflow-hidden
        bg-white/80 backdrop-blur-sm
        rounded-3xl p-8
        border border-gray-200/50
        hover:border-transparent
        hover:shadow-2xl hover:scale-105
        transition-all duration-300
        cursor-pointer
      `}
    >
      <div
        class={`
          absolute inset-0 opacity-0 group-hover:opacity-100
          transition-opacity duration-300
          ${props.gradient}
        `}
      />

      <div class="relative z-10">
        <div class="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
          {props.emoji}
        </div>
        <h3 class="text-2xl font-bold text-gray-900 group-hover:text-white mb-3 transition-colors">
          {props.title}
        </h3>
        <p class="text-gray-600 group-hover:text-white/90 transition-colors leading-relaxed">
          {props.description}
        </p>
      </div>

      <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl" />
    </div>
  );
};

interface StepCardProps {
  number: string;
  title: string;
  description: string;
  gradient: string;
}

export const StepCard: Component<StepCardProps> = (props) => {
  return (
    <div class="relative">
      <div
        class={`
          inline-flex items-center justify-center
          w-16 h-16 rounded-2xl mb-6
          ${props.gradient}
          text-white font-bold text-2xl
          shadow-lg transform hover:scale-110 transition-transform
        `}
      >
        {props.number}
      </div>

      <h3 class="text-xl font-bold text-gray-900 mb-3">
        {props.title}
      </h3>
      <p class="text-gray-600 leading-relaxed">
        {props.description}
      </p>

      <div class="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary-200 to-transparent" />
    </div>
  );
};

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: JSX.Element;
}

export const CTAButton: Component<ButtonProps> = (props) => {
  const variants = {
    primary: 'bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-primary-500/50 hover:shadow-xl hover:shadow-primary-500/60',
    secondary: 'bg-white/90 backdrop-blur-sm text-gray-900 border-2 border-gray-200 hover:border-primary-500 hover:bg-white',
    ghost: 'bg-transparent text-gray-900 hover:bg-white/50',
  };

  const sizes = {
    sm: 'px-6 py-3 text-sm',
    md: 'px-8 py-4 text-base',
    lg: 'px-10 py-5 text-lg',
  };

  return (
    <button
      {...props}
      class={`
        inline-flex items-center justify-center gap-3
        ${variants[props.variant || 'primary']}
        ${sizes[props.size || 'md']}
        rounded-full font-bold
        transform hover:scale-105 active:scale-95
        transition-all duration-200
        ${props.class || ''}
      `}
    >
      {props.icon}
      {props.children}
    </button>
  );
};
