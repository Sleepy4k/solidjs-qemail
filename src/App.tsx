import {
  Component,
  lazy,
  Suspense,
  onMount,
  onCleanup,
  type JSX,
} from "solid-js";
import { Router, Route, useLocation } from "@solidjs/router";
import { AdminGuard, GuestGuard } from "./shared/guards/auth.guard";
import { AdminLayout } from "./features/admin/layouts/AdminLayout";
import { PageWrapper } from "./shared/components/PageWrapper";
import { Skeleton } from "./shared/components/Skeleton";
import NProgress from "nprogress";

NProgress.configure({ showSpinner: false, trickleSpeed: 150 });

const LandingPage = lazy(
  () => import("./features/landing/pages/LandingPage/LandingPage"),
);
const EmailLoginPage = lazy(
  () => import("./features/email/pages/EmailLoginPage/EmailLoginPage"),
);
const InboxPage = lazy(
  () => import("./features/email/pages/InboxPage/InboxPage"),
);
const EmailViewPage = lazy(
  () => import("./features/email/pages/EmailViewPage/EmailViewPage"),
);

const LoginPage = lazy(
  () => import("./features/admin/pages/LoginPage/LoginPage"),
);
const DashboardPage = lazy(
  () => import("./features/admin/pages/DashboardPage/DashboardPage"),
);
const DomainsPage = lazy(
  () => import("./features/admin/pages/DomainsPage/DomainsPage"),
);
const AccountsPage = lazy(
  () => import("./features/admin/pages/AccountsPage/AccountsPage"),
);
const AccountInboxPage = lazy(
  () => import("./features/admin/pages/AccountInboxPage/AccountInboxPage"),
);
const SettingsPage = lazy(
  () => import("./features/admin/pages/SettingsPage/SettingsPage"),
);
const LogsPage = lazy(() => import("./features/admin/pages/LogsPage/LogsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const HowToUsePage = lazy(() => import("./pages/HowToUsePage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));

const AdminLoadingSkeleton: Component = () => (
  <div class="min-h-screen bg-gray-50 flex">
    <aside class="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col flex-shrink-0">
      <div class="p-5 border-b border-gray-200">
        <div class="flex items-center gap-3">
          <Skeleton
            variant="rectangular"
            width="2.5rem"
            height="2.5rem"
            className="rounded-xl"
          />
          <div class="space-y-1 flex-1">
            <Skeleton height="0.85rem" width="60%" />
            <Skeleton height="0.7rem" width="40%" />
          </div>
        </div>
      </div>
      <nav class="flex-1 p-4 space-y-1">
        {Array.from({ length: 5 }).map(() => (
          <Skeleton height="2.75rem" className="rounded-lg" />
        ))}
      </nav>
      <div class="p-4 border-t border-gray-200 space-y-2">
        <Skeleton height="3rem" className="rounded-lg" />
        <Skeleton height="2.5rem" className="rounded-lg" />
      </div>
    </aside>

    <div class="flex-1 flex flex-col min-w-0">
      <div class="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <Skeleton
          variant="rectangular"
          width="2rem"
          height="2rem"
          className="rounded-lg"
        />
        <Skeleton width="7rem" height="1.25rem" />
        <div class="w-8" />
      </div>

      <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-5">
        <div class="flex items-center justify-between">
          <div class="space-y-1">
            <Skeleton height="1.75rem" width="14rem" />
            <Skeleton height="0.9rem" width="20rem" />
          </div>
          <Skeleton height="2.25rem" width="6rem" className="rounded-lg" />
        </div>
        <Skeleton height="5rem" className="rounded-xl" />
        <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div class="p-4 border-b border-gray-200 space-y-3">
            {Array.from({ length: 6 }).map(() => (
              <Skeleton height="1rem" />
            ))}
          </div>
        </div>
      </main>
    </div>
  </div>
);

const PublicLoadingSkeleton: Component = () => (
  <div class="min-h-screen bg-white flex flex-col">
    <div class="border-b border-gray-200 px-4 h-14 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Skeleton
          variant="rectangular"
          width="2rem"
          height="2rem"
          className="rounded-lg"
        />
        <Skeleton width="5rem" height="1rem" />
      </div>
      <div class="hidden sm:flex items-center gap-3">
        {Array.from({ length: 4 }).map(() => (
          <Skeleton width="4rem" height="1rem" />
        ))}
      </div>
    </div>

    <div class="flex-1 flex items-center justify-center p-8">
      <div class="w-full max-w-lg space-y-4 text-center">
        <Skeleton height="2.5rem" width="60%" className="mx-auto" />
        <Skeleton height="1rem" width="80%" className="mx-auto" />
        <Skeleton height="1rem" width="50%" className="mx-auto" />
        <div class="pt-4 space-y-3">
          <Skeleton height="3rem" className="rounded-xl" />
          <Skeleton height="3rem" className="rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

const LoadingFallback: Component = () => {
  const location = useLocation();

  onMount(() => {
    NProgress.start();
    onCleanup(() => NProgress.done());
  });

  const isAdminPage = () =>
    location.pathname.startsWith("/admin") &&
    location.pathname !== "/admin/login";

  return isAdminPage() ? <AdminLoadingSkeleton /> : <PublicLoadingSkeleton />;
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
const EmailViewPageRoute: Component = () => (
  <PageWrapper>
    <EmailViewPage />
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
const AdminLogsRoute: Component = () => (
  <PageWrapper>
    <ProtectedAdminRoute>
      <LogsPage />
    </ProtectedAdminRoute>
  </PageWrapper>
);
const NotFoundRoute: Component = () => (
  <PageWrapper>
    <NotFoundPage />
  </PageWrapper>
);
const AboutRoute: Component = () => (
  <PageWrapper>
    <AboutPage />
  </PageWrapper>
);
const HowToUseRoute: Component = () => (
  <PageWrapper>
    <HowToUsePage />
  </PageWrapper>
);
const FAQRoute: Component = () => (
  <PageWrapper>
    <FAQPage />
  </PageWrapper>
);

const App: Component = () => (
  <Router>
    <Suspense fallback={<LoadingFallback />}>
      <Route path="/" component={LandingPageRoute} />
      <Route path="/inbox/login" component={EmailLoginPageRoute} />
      <Route path="/inbox" component={InboxPageRoute} />
      <Route path="/inbox/:messageId" component={EmailViewPageRoute} />

      <Route path="/admin/login" component={AdminLoginRoute} />
      <Route path="/admin" component={AdminDashboardRoute} />
      <Route path="/admin/domains" component={AdminDomainsRoute} />
      <Route path="/admin/accounts" component={AdminAccountsRoute} />
      <Route
        path="/admin/accounts/:accountId/inbox"
        component={AdminAccountInboxRoute}
      />
      <Route path="/admin/settings" component={AdminSettingsRoute} />
      <Route path="/admin/logs" component={AdminLogsRoute} />

      <Route path="/about" component={AboutRoute} />
      <Route path="/how-to-use" component={HowToUseRoute} />
      <Route path="/faq" component={FAQRoute} />

      <Route path="*" component={NotFoundRoute} />
    </Suspense>
  </Router>
);

export default App;
