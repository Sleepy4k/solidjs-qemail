import { Component, createSignal, createMemo, onMount, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import gsap from "gsap";
import { emailService } from "../../../../shared/services/email.service";
import { emailStore } from "../../../../shared/stores/email.store";
import type { Domain } from "../../../../shared/types/email.types";
import { Button } from "../../../../shared/components/ui/Button";
import { Card } from "../../../../shared/components/ui/Card";
import { Input } from "../../../../shared/components/ui/Input";
import { Alert } from "../../../../shared/components/ui/Alert";
import { SearchableSelect } from "../../../../shared/components/ui/SearchableSelect";
import { EmailLayout } from "../../../../shared/layouts/EmailLayout";

export const EmailLoginPage: Component = () => {
  const navigate = useNavigate();

  let usernameRef: HTMLInputElement | undefined;
  let passwordRef: HTMLInputElement | undefined;

  const [domains, setDomains] = createSignal<Domain[]>([]);
  const [selectedDomainId, setSelectedDomainId] = createSignal<number>(0);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal("");

  let cardRef: HTMLDivElement | undefined;

  const domainOptions = createMemo(() =>
    domains().map((d) => ({ value: d.id, label: `@${d.name}` })),
  );

  onMount(async () => {
    if (emailStore.isAuthenticated()) {
      navigate("/inbox");
      return;
    }

    if (cardRef) {
      gsap.fromTo(
        cardRef,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power2.out" },
      );
    }

    try {
      const domainsData = await emailService.getDomains();
      setDomains(domainsData);
      if (domainsData.length > 0) {
        setSelectedDomainId(domainsData[0].id);
      }
    } catch {
      setError("Failed to load domains");
    }
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");

    const username = usernameRef?.value.trim() ?? "";
    const password = passwordRef?.value ?? "";

    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    if (!selectedDomainId()) {
      setError("Please select a domain");
      return;
    }

    const selectedDomain = domains().find((d) => d.id === selectedDomainId());
    if (!selectedDomain) {
      setError("Invalid domain selected");
      return;
    }

    const email = `${username}@${selectedDomain.name}`;
    setIsLoading(true);

    try {
      const response = await emailService.loginEmail({ email, password });

      emailStore.setSession({
        email: response.email,
        token: response.token,
        session_token: response.session_token,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });

      navigate("/inbox");
    } catch (err: any) {
      setError(err.message || "Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EmailLayout currentPage="email-login">
      <div class="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-8">
        <div class="w-full max-w-md">
          <div ref={cardRef}>
            <Card>
              <div class="mb-8 text-center">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">
                  Access Your Inbox
                </h1>
                <p class="text-main-gray">
                  Login with your temporary email credentials
                </p>
              </div>

              <form onSubmit={handleSubmit} class="space-y-5">
                <Show when={error()}>
                  <Alert
                    type="error"
                    message={error()}
                    onClose={() => setError("")}
                  />
                </Show>

                <Input
                  ref={usernameRef}
                  label="Username"
                  type="text"
                  placeholder="your-username"
                  required
                  disabled={isLoading()}
                />

                <Show
                  when={domains().length > 0}
                  fallback={
                    <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p class="text-sm text-yellow-700">Loading domains...</p>
                    </div>
                  }
                >
                  <SearchableSelect
                    label="Domain"
                    options={domainOptions()}
                    value={selectedDomainId()}
                    onChange={(val) => setSelectedDomainId(Number(val))}
                    disabled={isLoading()}
                    placeholder="Select domain..."
                    helperText="Choose the domain for your email address"
                  />
                </Show>

                <Input
                  ref={passwordRef}
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading()}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isLoading()}
                  class="w-full"
                >
                  {isLoading() ? (
                    <>
                      <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Logging in...
                    </>
                  ) : (
                    <>Login to Inbox</>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h3 class="text-sm font-semibold text-blue-900 mb-1">
              Password Protected Emails
            </h3>
            <p class="text-xs text-gray-600">
              Only custom emails with passwords require login. Random generated
              emails can be accessed directly with the session token.
            </p>
          </div>
        </div>
      </div>
    </EmailLayout>
  );
};

export default EmailLoginPage;
