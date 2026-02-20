import { Component, createSignal, onMount, Show } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import gsap from "gsap";
import { emailService } from "../../../../shared/services/email.service";
import { emailStore } from "../../../../shared/stores/email.store";
import { ROUTES } from "../../../../shared/constants/routes.constant";
import type { EmailMessage } from "../../../../shared/types/email.types";
import { Button } from "../../../../shared/components/ui/Button";
import { Alert } from "../../../../shared/components/ui/Alert";
import { EmailLayout } from "../../../../shared/layouts/EmailLayout";
import {
  ConfirmDialog,
  useConfirmDialog,
} from "../../../../shared/components/ConfirmDialog";
import { SafeEmailRenderer } from "../../../../shared/components/SafeEmailRenderer";

export const EmailViewPage: Component = () => {
  const params = useParams<{ messageId: string }>();
  const navigate = useNavigate();

  const [email, setEmail] = createSignal<EmailMessage | null>(null);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal("");
  const [isDeleting, setIsDeleting] = createSignal(false);
  const {
    isOpen: isConfirmOpen,
    config: confirmConfig,
    confirm,
    handleConfirm,
    handleCancel,
  } = useConfirmDialog();

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

    await loadEmail();
  });

  const loadEmail = async () => {
    try {
      const token = emailStore.getToken();
      if (!token) {
        navigate(ROUTES.EMAIL_LOGIN, { replace: true });
        return;
      }

      const data = await emailService.getMessage(token, params.messageId);
      setEmail(data);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to load email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    confirm({
      title: "Delete Email",
      message:
        "Are you sure you want to delete this email? This action cannot be undone.",
      variant: "danger",
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          const token = emailStore.getToken();
          if (!token) return;
          await emailService.deleteMessage(token, params.messageId);
          navigate("/inbox");
        } catch (err: any) {
          setError(err.message || "Failed to delete email");
          setIsDeleting(false);
        }
      },
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <EmailLayout currentPage="inbox" showAdminLink={true}>
      <div
        ref={containerRef}
        class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
      >
        {/* Back button + title */}
        <div class="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/inbox")}
            class="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Back to inbox"
          >
            <svg
              class="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 class="text-lg sm:text-2xl font-bold text-gray-900 truncate">
            {isLoading() ? "Loading..." : email()?.subject || "(No Subject)"}
          </h1>
        </div>

        <Show when={error()}>
          <Alert type="error" message={error()} onClose={() => setError("")} />
        </Show>

        <Show
          when={!isLoading()}
          fallback={
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
              <div class="inline-block w-8 h-8 border-4 border-main-red border-t-transparent rounded-full animate-spin mb-4" />
              <p class="text-main-gray">Loading email...</p>
            </div>
          }
        >
          <Show when={email()}>
            {(msg) => (
              <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Email header */}
                <div class="px-4 sm:px-8 py-5 sm:py-6 border-b border-gray-200 bg-gray-50">
                  <h2 class="text-base sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 break-words">
                    {msg().subject || "(No Subject)"}
                  </h2>
                  <div class="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-6">
                    {/* Sender avatar + info */}
                    <div class="flex items-start gap-3 flex-1 min-w-0">
                      <div class="w-10 h-10 rounded-full bg-main-red/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span class="text-main-red font-semibold text-sm uppercase">
                          {(msg().sender_name || msg().sender).charAt(0)}
                        </span>
                      </div>
                      <div class="min-w-0">
                        <p class="font-semibold text-gray-900 text-sm sm:text-base">
                          {msg().sender_name || msg().sender}
                        </p>
                        <Show when={msg().sender_name}>
                          <p class="text-xs sm:text-sm text-main-gray break-all">
                            {msg().sender}
                          </p>
                        </Show>
                      </div>
                    </div>
                    {/* Date */}
                    <p class="text-xs sm:text-sm text-main-gray flex-shrink-0 pl-13 sm:pl-0">
                      {formatDate(msg().received_at)}
                    </p>
                  </div>
                </div>

                {/* Email body */}
                <div class="px-4 sm:px-8 py-6 sm:py-8 min-h-64">
                  <Show
                    when={msg().body_html}
                    fallback={
                      <pre class="whitespace-pre-wrap text-sm sm:text-base text-gray-800 font-sans leading-relaxed break-words">
                        {msg().body_text || "(No content)"}
                      </pre>
                    }
                  >
                    <SafeEmailRenderer html={msg().body_html!} />
                  </Show>
                </div>

                {/* Actions */}
                <div class="px-4 sm:px-8 py-4 sm:py-5 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/inbox")}
                    class="sm:flex-none w-full sm:w-auto"
                  >
                    ← Back to Inbox
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleDelete}
                    disabled={isDeleting()}
                    class="sm:ml-auto w-full sm:w-auto"
                  >
                    {isDeleting() ? "Deleting..." : "Delete Email"}
                  </Button>
                </div>
              </div>
            )}
          </Show>
        </Show>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen()}
        title={confirmConfig().title}
        message={confirmConfig().message}
        variant={confirmConfig().variant}
        confirmText="Delete"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </EmailLayout>
  );
};

export default EmailViewPage;
