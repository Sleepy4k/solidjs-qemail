import gsap from "gsap";

export interface AnimationOptions {
  duration?: number;
  delay?: number;
  ease?: string;
  stagger?: number;
}

export const fadeIn = (
  element: HTMLElement,
  options: AnimationOptions = {},
) => {
  const { duration = 0.6, delay = 0, ease = "power2.out" } = options;

  gsap.fromTo(
    element,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration, delay, ease },
  );
};

export const fadeOut = (
  element: HTMLElement,
  options: AnimationOptions = {},
) => {
  const { duration = 0.4, delay = 0, ease = "power2.in" } = options;

  return gsap.to(element, {
    opacity: 0,
    y: -20,
    duration,
    delay,
    ease,
  });
};

export const slideInLeft = (
  element: HTMLElement,
  options: AnimationOptions = {},
) => {
  const { duration = 0.6, delay = 0, ease = "power3.out" } = options;

  gsap.fromTo(
    element,
    { opacity: 0, x: -50 },
    { opacity: 1, x: 0, duration, delay, ease },
  );
};

export const slideInRight = (
  element: HTMLElement,
  options: AnimationOptions = {},
) => {
  const { duration = 0.6, delay = 0, ease = "power3.out" } = options;

  gsap.fromTo(
    element,
    { opacity: 0, x: 50 },
    { opacity: 1, x: 0, duration, delay, ease },
  );
};

export const scaleIn = (
  element: HTMLElement,
  options: AnimationOptions = {},
) => {
  const { duration = 0.5, delay = 0, ease = "back.out(1.7)" } = options;

  gsap.fromTo(
    element,
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration, delay, ease },
  );
};

export const bounce = (
  element: HTMLElement,
  options: AnimationOptions = {},
) => {
  const { duration = 0.8, delay = 0 } = options;

  gsap.to(element, {
    y: -10,
    duration: duration / 2,
    delay,
    ease: "power2.out",
    yoyo: true,
    repeat: 1,
  });
};

export const staggerFadeIn = (
  elements: HTMLElement[] | NodeListOf<HTMLElement>,
  options: AnimationOptions = {},
) => {
  const {
    duration = 0.5,
    delay = 0,
    ease = "power2.out",
    stagger = 0.1,
  } = options;

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
    },
  );
};

export const pulse = (element: HTMLElement, options: AnimationOptions = {}) => {
  const { duration = 0.6 } = options;

  gsap.to(element, {
    scale: 1.05,
    duration: duration / 2,
    ease: "power2.inOut",
    yoyo: true,
    repeat: 1,
  });
};

export const shake = (element: HTMLElement) => {
  gsap.to(element, {
    x: -10,
    duration: 0.1,
    ease: "power2.inOut",
    yoyo: true,
    repeat: 5,
  });
};

export const rotateInfinite = (element: HTMLElement) => {
  gsap.to(element, {
    rotation: 360,
    duration: 1,
    ease: "linear",
    repeat: -1,
  });
};
