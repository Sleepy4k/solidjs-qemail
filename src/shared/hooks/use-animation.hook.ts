import { onMount, onCleanup } from 'solid-js';
import gsap from 'gsap';
import * as animations from '../utils/animation.util';

export interface UseAnimationOptions {
  animation?: keyof typeof animations;
  duration?: number;
  delay?: number;
  ease?: string;
  stagger?: number;
  trigger?: 'mount' | 'manual';
}

/**
 * Hook for applying animations to elements
 */
export const useAnimation = (
  getElement: () => HTMLElement | null | undefined,
  options: UseAnimationOptions = {}
) => {
  const {
    animation = 'fadeIn',
    duration = 0.6,
    delay = 0,
    ease = 'power2.out',
    stagger,
    trigger = 'mount',
  } = options;

  const animate = () => {
    const element = getElement();
    if (!element) return;

    const animationFn = animations[animation] as any;
    if (animationFn) {
      animationFn(element, { duration, delay, ease, stagger });
    }
  };

  if (trigger === 'mount') {
    onMount(() => {
      animate();
    });
  }

  return { animate };
};

/**
 * Hook for list animations with stagger
 */
export const useStaggerAnimation = (
  getElements: () => HTMLElement[] | NodeListOf<HTMLElement> | null | undefined,
  options: Omit<UseAnimationOptions, 'animation'> = {}
) => {
  const {
    duration = 0.5,
    delay = 0,
    ease = 'power2.out',
    stagger = 0.1,
    trigger = 'mount',
  } = options;

  const animate = () => {
    const elements = getElements();
    if (!elements || (Array.isArray(elements) && elements.length === 0)) return;

    animations.staggerFadeIn(elements as any, {
      duration,
      delay,
      ease,
      stagger,
    });
  };

  if (trigger === 'mount') {
    onMount(() => {
      // Add small delay to ensure DOM is ready
      setTimeout(animate, 50);
    });
  }

  return { animate };
};

/**
 * Hook for timeline animations
 */
export const useTimeline = () => {
  let timeline: gsap.core.Timeline | null = null;

  onMount(() => {
    timeline = gsap.timeline();
  });

  onCleanup(() => {
    timeline?.kill();
  });

  return {
    getTimeline: () => timeline,
    play: () => timeline?.play(),
    pause: () => timeline?.pause(),
    reverse: () => timeline?.reverse(),
    restart: () => timeline?.restart(),
  };
};

/**
 * Hook for scroll-triggered animations
 */
export const useScrollAnimation = (
  getElement: () => HTMLElement | null | undefined,
  options: UseAnimationOptions = {}
) => {
  let observer: IntersectionObserver | null = null;

  onMount(() => {
    const element = getElement();
    if (!element) return;

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const { animate } = useAnimation(getElement, { ...options, trigger: 'manual' });
            animate();
            observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
  });

  onCleanup(() => {
    observer?.disconnect();
  });
};
