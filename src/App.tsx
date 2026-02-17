import { Component, lazy, Suspense, onMount, type JSX } from 'solid-js';
import { Router, Route } from '@solidjs/router';
import { AdminGuard, GuestGuard } from './shared/guards/auth.guard';
import { AdminLayout } from './features/admin/layouts/AdminLayout';
import { PageWrapper } from './shared/components/PageWrapper';
import NProgress from 'nprogress';

NProgress.configure({ showSpinner: true, trickleSpeed: 200 });

const LandingPage = lazy(() => import('./features/landing/pages/LandingPage/LandingPage'));
const EmailLoginPage = lazy(() => import('./features/email/pages/EmailLoginPage/EmailLoginPage'));
const InboxPage = lazy(() => import('./features/email/pages/InboxPage/InboxPage'));

const LoginPage = lazy(() => import('./features/admin/pages/LoginPage/LoginPage'));
const DashboardPage = lazy(() => import('./features/admin/pages/DashboardPage/DashboardPage'));
const DomainsPage = lazy(() => import('./features/admin/pages/DomainsPage/DomainsPage'));
const AccountsPage = lazy(() => import('./features/admin/pages/AccountsPage/AccountsPage'));
const AccountInboxPage = lazy(() => import('./features/admin/pages/AccountInboxPage/AccountInboxPage'));
const SettingsPage = lazy(() => import('./features/admin/pages/SettingsPage/SettingsPage'));

const LoadingFallback: Component = () => {
  onMount(() => {
    NProgress.start();
    return () => NProgress.done();
  });

  return (
    <div class="min-h-screen flex items-center justify-center bg-background-DEFAULT">
      <div class="text-center">
        <div class="animate-spin w-16 h-16 border-4 border-main-red border-t-transparent rounded-full mx-auto"></div>
        <p class="mt-4 text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
};

const ProtectedAdminRoute: Component<{ children: JSX.Element }> = (props) => (
  <AdminGuard>
    <AdminLayout>{props.children}</AdminLayout>
  </AdminGuard>
);

const GuestRoute: Component<{ children: JSX.Element }> = (props) => (
  <GuestGuard>{props.children}</GuestGuard>
);

const LandingPageRoute: Component = () => (
  <PageWrapper>
    <LandingPage />
  </PageWrapper>
);

const EmailLoginPageRoute: Component = () => (
  <PageWrapper>
    <EmailLoginPage />
  </PageWrapper>
);

const InboxPageRoute: Component = () => (
  <PageWrapper>
    <InboxPage />
  </PageWrapper>
);

const AdminLoginRoute: Component = () => (
  <PageWrapper>
    <GuestRoute>
      <LoginPage />
    </GuestRoute>
  </PageWrapper>
);

const AdminDashboardRoute: Component = () => (
  <PageWrapper>
    <ProtectedAdminRoute>
      <DashboardPage />
    </ProtectedAdminRoute>
  </PageWrapper>
);

const AdminDomainsRoute: Component = () => (
  <PageWrapper>
    <ProtectedAdminRoute>
      <DomainsPage />
    </ProtectedAdminRoute>
  </PageWrapper>
);

const AdminAccountsRoute: Component = () => (
  <PageWrapper>
    <ProtectedAdminRoute>
      <AccountsPage />
    </ProtectedAdminRoute>
  </PageWrapper>
);

const AdminAccountInboxRoute: Component = () => (
  <PageWrapper>
    <ProtectedAdminRoute>
      <AccountInboxPage />
    </ProtectedAdminRoute>
  </PageWrapper>
);

const AdminSettingsRoute: Component = () => (
  <PageWrapper>
    <ProtectedAdminRoute>
      <SettingsPage />
    </ProtectedAdminRoute>
  </PageWrapper>
);

const App: Component = () => {
  onMount(() => {
    NProgress.configure({ showSpinner: true, trickleSpeed: 200 });
  });

  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Route path="/" component={LandingPageRoute} />
        <Route path="/email/login" component={EmailLoginPageRoute} />
        <Route path="/inbox" component={InboxPageRoute} />

        <Route path="/admin/login" component={AdminLoginRoute} />

        <Route path="/admin" component={AdminDashboardRoute} />
        <Route path="/admin/dashboard" component={AdminDashboardRoute} />
        <Route path="/admin/domains" component={AdminDomainsRoute} />
        <Route path="/admin/accounts" component={AdminAccountsRoute} />
        <Route path="/admin/accounts/:accountId/inbox" component={AdminAccountInboxRoute} />
        <Route path="/admin/settings" component={AdminSettingsRoute} />
      </Suspense>
    </Router>
  );
};

export default App;
