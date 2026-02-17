import gsap from 'gsap';

export interface AnimationOptions {
  duration?: number;
  delay?: number;
  ease?: string;
  stagger?: number;
}

/**
 * Fade in animation
 */
export const fadeIn = (element: HTMLElement, options: AnimationOptions = {}) => {
  const { duration = 0.6, delay = 0, ease = 'power2.out' } = options;

  gsap.fromTo(
    element,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration, delay, ease }
  );
};

/**
 * Fade out animation
 */
export const fadeOut = (element: HTMLElement, options: AnimationOptions = {}) => {
  const { duration = 0.4, delay = 0, ease = 'power2.in' } = options;

  return gsap.to(element, {
    opacity: 0,
    y: -20,
    duration,
    delay,
    ease,
  });
};

/**
 * Slide in from left
 */
export const slideInLeft = (element: HTMLElement, options: AnimationOptions = {}) => {
  const { duration = 0.6, delay = 0, ease = 'power3.out' } = options;

  gsap.fromTo(
    element,
    { opacity: 0, x: -50 },
    { opacity: 1, x: 0, duration, delay, ease }
  );
};

/**
 * Slide in from right
 */
export const slideInRight = (element: HTMLElement, options: AnimationOptions = {}) => {
  const { duration = 0.6, delay = 0, ease = 'power3.out' } = options;

  gsap.fromTo(
    element,
    { opacity: 0, x: 50 },
    { opacity: 1, x: 0, duration, delay, ease }
  );
};

/**
 * Scale in animation
 */
export const scaleIn = (element: HTMLElement, options: AnimationOptions = {}) => {
  const { duration = 0.5, delay = 0, ease = 'back.out(1.7)' } = options;

  gsap.fromTo(
    element,
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration, delay, ease }
  );
};

/**
 * Bounce animation
 */
export const bounce = (element: HTMLElement, options: AnimationOptions = {}) => {
  const { duration = 0.8, delay = 0 } = options;

  gsap.to(element, {
    y: -10,
    duration: duration / 2,
    delay,
    ease: 'power2.out',
    yoyo: true,
    repeat: 1,
  });
};

/**
 * Stagger animation for lists
 */
export const staggerFadeIn = (elements: HTMLElement[] | NodeListOf<HTMLElement>, options: AnimationOptions = {}) => {
  const { duration = 0.5, delay = 0, ease = 'power2.out', stagger = 0.1 } = options;

  gsap.fromTo(
    elements,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease,
      stagger,
    }
  );
};

/**
 * Pulse animation
 */
export const pulse = (element: HTMLElement, options: AnimationOptions = {}) => {
  const { duration = 0.6 } = options;

  gsap.to(element, {
    scale: 1.05,
    duration: duration / 2,
    ease: 'power2.inOut',
    yoyo: true,
    repeat: 1,
  });
};

/**
 * Shake animation
 */
export const shake = (element: HTMLElement) => {
  gsap.to(element, {
    x: -10,
    duration: 0.1,
    ease: 'power2.inOut',
    yoyo: true,
    repeat: 5,
  });
};

/**
 * Loading spinner animation
 */
export const rotateInfinite = (element: HTMLElement) => {
  gsap.to(element, {
    rotation: 360,
    duration: 1,
    ease: 'linear',
    repeat: -1,
  });
};
