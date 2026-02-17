import { Component, createSignal, onMount, Show, For } from "solid-js";
import { useNavigate } from "@solidjs/router";
import gsap from "gsap";
import { emailService } from "../../../../shared/services/email.service";
import { emailStore } from "../../../../shared/stores/email.store";
import type { Domain } from "../../../../shared/types/email.types";
import { Button } from "../../../../shared/components/ui/Button";
import { Card } from "../../../../shared/components/ui/Card";
import { Input } from "../../../../shared/components/ui/Input";
import { Alert } from "../../../../shared/components/ui/Alert";
import { EmailLayout } from "../../../../shared/layouts/EmailLayout";

export const EmailLoginPage: Component = () => {
  const navigate = useNavigate();

  const [domains, setDomains] = createSignal<Domain[]>([]);
  const [selectedDomainId, setSelectedDomainId] = createSignal<number>(0);
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal("");

  let cardRef: HTMLDivElement | undefined;

  onMount(async () => {
    if (emailStore.isAuthenticated()) {
      navigate("/inbox");
      return;
    }

    if (cardRef) {
      gsap.fromTo(
        cardRef,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power2.out" }
      );
    }

    try {
      const domainsData = await emailService.getDomains();
      setDomains(domainsData);
      if (domainsData.length > 0) {
        setSelectedDomainId(domainsData[0].id);
      }
    } catch (err) {
      setError("Failed to load domains");
    }
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");

    if (!username() || !password()) {
      setError("Please enter username and password");
      return;
    }

    if (!selectedDomainId()) {
      setError("Please select a domain");
      return;
    }

    const selectedDomain = domains().find(d => d.id === selectedDomainId());
    if (!selectedDomain) {
      setError("Invalid domain selected");
      return;
    }

    const email = `${username()}@${selectedDomain.name}`;

    setIsLoading(true);

    try {
      const response = await emailService.loginEmail({
        email: email,
        password: password(),
      });

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
          <Card>
            <div class="mb-8 text-center">
              <h1 class="text-3xl font-bold text-gray-900 mb-2">
                Access Your Inbox
              </h1>
              <p class="text-main-gray">
                Login with your temporary email credentials
              </p>
            </div>

            <form onSubmit={handleSubmit} class="space-y-6">
              {error() && (
                <Alert
                  type="error"
                  message={error()}
                  onClose={() => setError("")}
                />
              )}

              <Input
                label="Username"
                type="text"
                placeholder="your-username"
                value={username()}
                onInput={(value) => setUsername(value)}
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
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Domain
                  </label>
                  <select
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main-red focus:border-transparent transition-all"
                    value={selectedDomainId()}
                    onChange={(e) =>
                      setSelectedDomainId(Number(e.currentTarget.value))
                    }
                    disabled={isLoading()}
                  >
                    <For each={domains()}>
                      {(domain) => (
                        <option value={domain.id}>{domain.name}</option>
                      )}
                    </For>
                  </select>
                </div>
              </Show>

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password()}
                onInput={(value) => setPassword(value)}
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
