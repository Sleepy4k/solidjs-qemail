import { Component, JSX, createEffect, onCleanup, onMount } from 'solid-js';
import { useLocation } from '@solidjs/router';
import NProgress from 'nprogress';

export const PageWrapper: Component<{ children: JSX.Element }> = (props) => {
  const location = useLocation();
  let isFirstRender = true;
  
  onMount(() => {
    isFirstRender = false;
  });

  createEffect(() => {
    location.pathname;
    
    if (!isFirstRender) {
      NProgress.start();
      
      const timer = setTimeout(() => {
        NProgress.done();
      }, 500);
      
      onCleanup(() => {
        clearTimeout(timer);
        NProgress.done();
      });
    }
  });

  return <>{props.children}</>;
};
