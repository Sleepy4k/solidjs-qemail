import {
  Component,
  createSignal,
  onMount,
  onCleanup,
  For,
  Show,
} from "solid-js";
import { useNavigate } from "@solidjs/router";
import gsap from "gsap";
import { emailService } from "../../../../shared/services/email.service";
import { emailStore } from "../../../../shared/stores/email.store";
import { ROUTES } from "../../../../shared/constants/routes.constant";
import type { EmailMessage } from "../../../../shared/types/email.types";
import { Button } from "../../../../shared/components/ui/Button";
import { Card } from "../../../../shared/components/ui/Card";
import { Alert } from "../../../../shared/components/ui/Alert";
import { EmailLayout } from "../../../../shared/layouts/EmailLayout";
import { AttachmentBadge } from "../../../../shared/components/AttachmentList";
import {
  ConfirmDialog,
  useConfirmDialog,
} from "../../../../shared/components/ConfirmDialog";

export const InboxPage: Component = () => {
  const navigate = useNavigate();

  const [emails, setEmails] = createSignal<EmailMessage[]>([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [isRefreshing, setIsRefreshing] = createSignal(false);
  const [refreshSuccess, setRefreshSuccess] = createSignal("");
  const [error, setError] = createSignal("");
  const [currentPage, setCurrentPage] = createSignal(1);
  const [totalPages, setTotalPages] = createSignal(1);

  const { isOpen, config, confirm, handleConfirm, handleCancel } =
    useConfirmDialog();

  let containerRef: HTMLDivElement | undefined;

  onMount(async () => {
    if (!emailStore.isAuthenticated()) {
      navigate(ROUTES.EMAIL_LOGIN, { replace: true });
      return;
    }

    if (containerRef) {
      gsap.fromTo(
        containerRef,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      );
    }

    await loadInbox();

    const interval = setInterval(loadInbox, 30000);
    onCleanup(() => clearInterval(interval));
  });

  const loadInbox = async () => {
    try {
      const token = emailStore.getToken();
      if (!token) return;

      const response = await emailService.getInbox(token, {
        page: currentPage(),
        limit: 20,
      });

      setEmails(response.data);
      setTotalPages(response.meta.pages);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to load inbox");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEmail = (email: EmailMessage) => {
    navigate(`/inbox/${email.message_id}`);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setRefreshSuccess("");
    setError("");
    try {
      await loadInbox();
      setRefreshSuccess("Inbox berhasil di-refresh!");
      setTimeout(() => setRefreshSuccess(""), 3000);
    } catch {
      // error already set inside loadInbox
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = () => {
    confirm({
      title: "Konfirmasi Logout",
      message: "Apakah kamu yakin ingin logout? Sesi email temporermu akan berakhir.",
      variant: "warning",
      onConfirm: () => {
        emailStore.clearSession();
        navigate("/");
      },
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <EmailLayout currentPage="inbox" showAdminLink={true}>
      <div
        ref={containerRef}
        class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
      >
        <div class="mb-6 sm:mb-8">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div class="min-w-0">
              <h1 class="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                Your Inbox
              </h1>
              <p class="text-xs sm:text-base text-main-gray dark:text-navy-300 truncate">
                {emailStore.session?.email || "Temporary Email"}
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={handleLogout}
              class="self-start sm:self-auto flex-shrink-0"
              icon={
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              }
            >
              Logout
            </Button>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center gap-3 p-3 sm:p-4 bg-blue-50 dark:bg-navy-800 border border-blue-200 dark:border-navy-600 rounded-xl">
            <p class="text-xs sm:text-sm text-blue-900 dark:text-navy-200 flex-1">
              <span class="font-semibold">Auto-refresh enabled.</span> New
              emails will appear automatically every 30 seconds.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing() || isLoading()}
              class="self-start sm:self-auto flex-shrink-0"
              icon={
                <svg
                  class={`w-4 h-4 ${isRefreshing() ? "animate-spin" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              }
            >
              {isRefreshing() ? "Memuat..." : "Refresh Now"}
            </Button>
          </div>
        </div>

        <Show when={error()}>
          <Alert type="error" message={error()} onClose={() => setError("")} />
        </Show>

        <Show when={refreshSuccess()}>
          <Alert type="success" message={refreshSuccess()} onClose={() => setRefreshSuccess("")} />
        </Show>

        <Card>
          <Show
            when={!isLoading() && emails()?.length > 0}
            fallback={
              <div class="text-center py-16">
                {isLoading() ? (
                  <div>
                    <div class="inline-block w-8 h-8 border-4 border-main-red border-t-transparent rounded-full animate-spin mb-4" />
                    <p class="text-main-gray">Loading inbox...</p>
                  </div>
                ) : (
                  <div>
                    <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-navy-700 flex items-center justify-center">
                      <svg
                        class="w-8 h-8 text-gray-400 dark:text-navy-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h3 class="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                      No emails yet
                    </h3>
                    <p class="text-main-gray dark:text-navy-300 text-xs sm:text-base">
                      Your inbox is empty. Emails sent to your temporary address
                      will appear here.
                    </p>
                  </div>
                )}
              </div>
            }
          >
            <div class="divide-y divide-gray-200">
              <For each={emails()}>
                {(email) => (
                  <button
                    onClick={() => handleOpenEmail(email)}
                    class={`w-full text-left px-4 sm:px-6 py-4 hover:bg-gray-100 dark:hover:bg-navy-700 transition-colors ${
                      !email.is_read ? "bg-blue-50/50 dark:bg-navy-800/70" : ""
                    }`}
                  >
                    <div class="flex items-start justify-between gap-3">
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-1">
                          {!email.is_read && (
                            <span class="w-2 h-2 bg-main-red rounded-full flex-shrink-0" />
                          )}
                          <span class="font-semibold text-gray-900 dark:text-white truncate text-sm sm:text-base">
                            {email.sender_name || email.sender}
                          </span>
                        </div>
                        <p class="text-sm text-gray-600 dark:text-navy-300 truncate mb-1 flex items-center gap-1.5">
                        <span class="truncate">{email.subject || "(No Subject)"}</span>
                        <AttachmentBadge count={email.attachments?.length ?? 0} />
                      </p>
                        <p class="text-xs text-main-gray dark:text-navy-400 truncate hidden sm:block">
                          {email.body_text?.substring(0, 100)}...
                        </p>
                      </div>
                      <span class="text-xs text-main-gray dark:text-navy-400 whitespace-nowrap flex-shrink-0 mt-0.5">
                        {formatDate(email.received_at)}
                      </span>
                    </div>
                  </button>
                )}
              </For>
            </div>

            <Show when={totalPages() > 1}>
              <div class="flex items-center justify-center gap-2 px-4 sm:px-6 py-4 border-t border-gray-200">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage() === 1}
                  onClick={() => {
                    setCurrentPage(currentPage() - 1);
                    loadInbox();
                  }}
                >
                  ← Prev
                </Button>
                <span class="text-sm text-main-gray dark:text-navy-300 px-2 sm:px-4">
                  {currentPage()} / {totalPages()}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage() === totalPages()}
                  onClick={() => {
                    setCurrentPage(currentPage() + 1);
                    loadInbox();
                  }}
                >
                  Next →
                </Button>
              </div>
            </Show>
          </Show>
        </Card>
      </div>

      <ConfirmDialog
        isOpen={isOpen()}
        title={config().title}
        message={config().message}
        confirmText="Ya, Logout"
        cancelText="Batal"
        variant={config().variant}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </EmailLayout>
  );
};

export default InboxPage;
