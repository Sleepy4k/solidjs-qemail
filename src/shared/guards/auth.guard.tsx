import { Component, JSX, onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { adminStore } from '../../features/admin/stores/admin.store';
import { ROUTES } from '../constants/routes.constant';

export interface GuardProps {
  children: JSX.Element;
}

export const AdminGuard: Component<GuardProps> = (props) => {
  const navigate = useNavigate();

  onMount(() => {
    if (!adminStore.isAuthenticated()) {
      navigate(ROUTES.ADMIN.LOGIN, { replace: true });
    }
  });

  return <>{props.children}</>;
};

export const GuestGuard: Component<GuardProps> = (props) => {
  const navigate = useNavigate();

  onMount(() => {
    if (adminStore.isAuthenticated()) {
      navigate(ROUTES.ADMIN.DASHBOARD, { replace: true });
    }
  });

  return <>{props.children}</>;
};
