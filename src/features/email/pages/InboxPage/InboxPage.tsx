import { Component, createSignal, onMount, For, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import gsap from "gsap";
import { emailService } from "../../../../shared/services/email.service";
import { emailStore } from "../../../../shared/stores/email.store";
import type { EmailMessage } from "../../../../shared/types/email.types";
import { Button } from "../../../../shared/components/ui/Button";
import { Card } from "../../../../shared/components/ui/Card";
import { Alert } from "../../../../shared/components/ui/Alert";
import { Modal } from "../../../../shared/components/ui/Modal";
import { EmailLayout } from "../../../../shared/layouts/EmailLayout";

export const InboxPage: Component = () => {
  const navigate = useNavigate();

  const [emails, setEmails] = createSignal<EmailMessage[]>([]);
  const [selectedEmail, setSelectedEmail] = createSignal<EmailMessage | null>(null);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal("");
  const [showEmailModal, setShowEmailModal] = createSignal(false);
  const [currentPage, setCurrentPage] = createSignal(1);
  const [totalPages, setTotalPages] = createSignal(1);

  let containerRef: HTMLDivElement | undefined;

  onMount(async () => {
    if (!emailStore.isAuthenticated()) {
      navigate("/");
      return;
    }

    if (containerRef) {
      gsap.fromTo(
        containerRef,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );
    }

    await loadInbox();

    const interval = setInterval(loadInbox, 30000);
    return () => clearInterval(interval);
  });

  const loadInbox = async () => {
    try {
      const token = emailStore.getToken();
      if (!token) {
        navigate("/");
        return;
      }

      const response = await emailService.getInbox(token, {
        page: currentPage(),
        limit: 20,
      });

      setEmails(response.emails);
      setTotalPages(response.total_pages);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to load inbox");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEmail = async (email: EmailMessage) => {
    setSelectedEmail(email);
    setShowEmailModal(true);

    if (!email.is_read) {
      email.is_read = true;
      setEmails([...emails()]);
    }
  };

  const handleDeleteEmail = async (messageId: string) => {
    if (!confirm("Are you sure you want to delete this email?")) return;

    try {
      const token = emailStore.getToken();
      if (!token) return;

      await emailService.deleteMessage(token, messageId);
      
      setEmails(emails().filter(e => e.message_id !== messageId));
      setShowEmailModal(false);
      setSelectedEmail(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete email");
    }
  };

  const handleLogout = () => {
    emailStore.clearSession();
    navigate("/");
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
      <>
      <div ref={containerRef} class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 mb-2">Your Inbox</h1>
              <p class="text-telkom-gray">
                {emailStore.session?.email || "Temporary Email"}
              </p>
            </div>
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>

          <div class="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div class="flex-1">
              <p class="text-sm text-blue-900">
                <span class="font-semibold">Auto-refresh enabled.</span> New emails will
                appear automatically every 30 seconds.
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={loadInbox} disabled={isLoading()}>
              {isLoading() ? "Refreshing..." : "Refresh Now"}
            </Button>
          </div>
        </div>

        <Show when={error()}>
          <Alert type="error" message={error()} onClose={() => setError("")} />
        </Show>

        <Card>
          <Show
            when={!isLoading() && emails()?.length > 0}
            fallback={
              <div class="text-center py-16">
                {isLoading() ? (
                  <div>
                    <div class="inline-block w-8 h-8 border-4 border-telkom-red border-t-transparent rounded-full animate-spin mb-4" />
                    <p class="text-telkom-gray">Loading inbox...</p>
                  </div>
                ) : (
                  <div>
                    <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">No emails yet</h3>
                    <p class="text-telkom-gray">
                      Your inbox is empty. Emails sent to your temporary address will appear
                      here.
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
                    class={`w-full text-left px-6 py-4 hover:bg-gray-50 transition-colors ${
                      !email.is_read ? "bg-blue-50/50" : ""
                    }`}
                  >
                    <div class="flex items-start justify-between gap-4">
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-1">
                          {!email.is_read && (
                            <span class="w-2 h-2 bg-telkom-red rounded-full" />
                          )}
                          <span class="font-semibold text-gray-900 truncate">
                            {email.sender_name || email.sender}
                          </span>
                        </div>
                        <p class="text-sm text-gray-600 truncate mb-1">
                          {email.subject || "(No Subject)"}
                        </p>
                        <p class="text-xs text-telkom-gray truncate">
                          {email.body_text?.substring(0, 100)}...
                        </p>
                      </div>
                      <span class="text-xs text-telkom-gray whitespace-nowrap">
                        {formatDate(email.received_at)}
                      </span>
                    </div>
                  </button>
                )}
              </For>
            </div>

            <Show when={totalPages() > 1}>
              <div class="flex items-center justify-center gap-2 px-6 py-4 border-t border-gray-200">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage() === 1}
                  onClick={() => {
                    setCurrentPage(currentPage() - 1);
                    loadInbox();
                  }}
                >
                  ← Previous
                </Button>
                <span class="text-sm text-telkom-gray px-4">
                  Page {currentPage()} of {totalPages()}
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

      <Modal
        isOpen={showEmailModal()}
        onClose={() => {
          setShowEmailModal(false);
          setSelectedEmail(null);
        }}
        title="Email Details"
      >
        <Show when={selectedEmail()}>
          {(email) => (
            <div class="space-y-6">
              <div class="space-y-3">
                <div>
                  <label class="text-xs font-semibold text-telkom-gray uppercase tracking-wide">
                    From
                  </label>
                  <p class="text-sm text-gray-900 mt-1">
                    {email().sender_name ? (
                      <>
                        {email().sender_name} <span class="text-telkom-gray">&lt;{email().sender}&gt;</span>
                      </>
                    ) : (
                      email().sender
                    )}
                  </p>
                </div>
                <div>
                  <label class="text-xs font-semibold text-telkom-gray uppercase tracking-wide">
                    To
                  </label>
                  <p class="text-sm text-gray-900 mt-1">{email().recipient}</p>
                </div>
                <div>
                  <label class="text-xs font-semibold text-telkom-gray uppercase tracking-wide">
                    Subject
                  </label>
                  <p class="text-sm text-gray-900 mt-1 font-semibold">
                    {email().subject || "(No Subject)"}
                  </p>
                </div>
                <div>
                  <label class="text-xs font-semibold text-telkom-gray uppercase tracking-wide">
                    Date
                  </label>
                  <p class="text-sm text-gray-900 mt-1">
                    {new Date(email().received_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div class="border-t border-gray-200 pt-6">
                <Show
                  when={email().body_html}
                  fallback={
                    <div class="prose prose-sm max-w-none">
                      <pre class="whitespace-pre-wrap text-sm text-gray-900 font-sans">
                        {email().body_text}
                      </pre>
                    </div>
                  }
                >
                  <div
                    class="prose prose-sm max-w-none"
                    innerHTML={email().body_html!}
                  />
                </Show>
              </div>

              <div class="flex items-center gap-3 pt-4 border-t border-gray-200">
                <Button
                  variant="primary"
                  onClick={() => {
                    handleDeleteEmail(email().message_id);
                  }}
                  class="flex-1"
                >
                  Delete Email
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowEmailModal(false);
                    setSelectedEmail(null);
                  }}
                  class="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </Show>
      </Modal>
      </>
    </EmailLayout>
  );
};

export default InboxPage;
