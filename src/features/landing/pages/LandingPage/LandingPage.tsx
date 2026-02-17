import { Component, createSignal, onMount, For, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import gsap from "gsap";
import { emailService } from "../../../../shared/services/email.service";
import { emailStore } from "../../../../shared/stores/email.store";
import type { Domain } from "../../../../shared/types/email.types";
import { Button } from "../../../../shared/components/ui/Button";
import { Card } from "../../../../shared/components/ui/Card";
import { Select } from "../../../../shared/components/ui/Select";
import { Input } from "../../../../shared/components/ui/Input";
import { Alert } from "../../../../shared/components/ui/Alert";
import { EmailLayout } from "../../../../shared/layouts/EmailLayout";

const LandingPage: Component = () => {
  const navigate = useNavigate();
  
  const [domains, setDomains] = createSignal<Domain[]>([]);
  const [selectedDomainId, setSelectedDomainId] = createSignal<number>(0);
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [isCustom, setIsCustom] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal("");
  const [success, setSuccess] = createSignal("");
  
  let heroRef: HTMLDivElement | undefined;
  let formRef: HTMLDivElement | undefined;
  let featuresRef: HTMLDivElement | undefined;

  onMount(async () => {
    if (heroRef) {
      gsap.fromTo(
        heroRef,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    }

    if (formRef) {
      gsap.fromTo(
        formRef,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.6, delay: 0.2, ease: "power2.out" }
      );
    }

    if (featuresRef) {
      gsap.set(featuresRef, { opacity: 0 });
      gsap.fromTo(
        featuresRef.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.4, ease: "power2.out", onStart: () => {
          if (featuresRef) {
            gsap.to(featuresRef, { opacity: 1, duration: 0.3 });
          }
        }}
      );
    }

    try {
      const domainsData = await emailService.getDomains();
      setDomains(domainsData);
      if (domainsData.length > 0) {
        setSelectedDomainId(domainsData[0].id);
      } else {
        setError("No domains available. Please contact administrator.");
      }
    } catch (err) {
      setError("Failed to load domains. Please try again.");
    }
  });

  const generateRandomString = (length: number) => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  };

  const handleGenerateRandom = () => {
    setUsername(generateRandomString(10));
    setPassword(generateRandomString(16));
    setIsCustom(false);
  };

  const handleGenerate = async (e: Event) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (domains().length === 0) {
      setError("No domains available. Please contact administrator.");
      return;
    }

    if (selectedDomainId() === 0) {
      setError("Please select a domain");
      return;
    }

    if (isCustom() && (!username() || !password())) {
      setError("Please enter username and password");
      return;
    }

    if (!isCustom() && (!username() || !password())) {
      handleGenerateRandom();
    }

    setIsLoading(true);

    try {
      const response = await emailService.generateEmail({
        domain_id: selectedDomainId(),
        username: username() || undefined,
        password: password() || undefined,
      });

      emailStore.setSession({
        email: response.email,
        token: response.token || response.session_token,
        session_token: response.session_token,
        expires_at: response.expires_at,
      });

      setSuccess(`Email berhasil di-generate: ${response.email}`);
      
      setTimeout(() => {
        navigate("/inbox");
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to generate email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseCustom = () => {
    setIsCustom(true);
    setUsername("");
    setPassword("");
  };

  return (
    <EmailLayout currentPage="home">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div ref={heroRef} class="text-center mb-12">
          <h1 class="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-telkom-red via-red-600 to-telkom-darkRed bg-clip-text text-transparent">
            QEmail
          </h1>
          
          <p class="text-xl text-telkom-gray max-w-2xl mx-auto mb-8">
            Generate temporary email addresses instantly. No registration required. 
            Keep your real inbox clean and spam-free.
          </p>
        </div>

        <div ref={formRef} class="max-w-2xl mx-auto mb-16">
          <Card>
            <form onSubmit={handleGenerate} class="space-y-6">
              <div>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">
                  Generate Your Email
                </h2>
                <p class="text-telkom-gray">
                  Choose a domain and customize your temporary email address
                </p>
              </div>

              <Show when={error()}>
                <Alert type="error" message={error()} onClose={() => setError("")} />
              </Show>
              <Show when={success()}>
                <Alert type="success" message={success()} onClose={() => setSuccess("")} />
              </Show>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Select Domain
                </label>
                <Show
                  when={domains().length > 0}
                  fallback={
                    <div class="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                      <p class="text-sm text-red-600 font-medium">⚠️ No domains available</p>
                      <p class="text-xs text-red-500 mt-1">Please contact administrator to add domains</p>
                    </div>
                  }
                >
                  <Select
                    value={selectedDomainId().toString()}
                    onChange={(value) => setSelectedDomainId(parseInt(value))}
                    disabled={isLoading()}
                  >
                    <option value="0">Choose a domain...</option>
                    <For each={domains()}>
                      {(domain) => (
                        <option value={domain.id.toString()}>@{domain.name}</option>
                      )}
                    </For>
                  </Select>
                </Show>
              </div>

              <div class="flex items-center gap-4">
                <Button
                  type="button"
                  variant={isCustom() ? "secondary" : "primary"}
                  onClick={handleGenerateRandom}
                  disabled={isLoading()}
                  class="flex-1"
                >
                  🎲 Generate Random
                </Button>
                <Button
                  type="button"
                  variant={isCustom() ? "primary" : "secondary"}
                  onClick={handleUseCustom}
                  disabled={isLoading()}
                  class="flex-1"
                >
                  ✏️ Use Custom
                </Button>
              </div>

              <Show when={isCustom()}>
                <div class="space-y-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <Input
                    label="Username"
                    type="text"
                    placeholder="your-username"
                    value={username()}
                    onInput={(value) => setUsername(value)}
                    required={isCustom()}
                    disabled={isLoading()}
                  />
                  <Input
                    label="Password"
                    type="password"
                    placeholder="Enter a secure password"
                    value={password()}
                    onInput={(value) => setPassword(value)}
                    required={isCustom()}
                    disabled={isLoading()}
                  />
                  <p class="text-xs text-telkom-gray">
                    Password is required for custom emails. Keep it safe to access your inbox later.
                  </p>
                </div>
              </Show>

              <Show when={!isCustom() && username() && password()}>
                <div class="p-4 bg-telkom-red/5 rounded-xl border border-telkom-red/10 space-y-3">
                  <div>
                    <p class="text-sm font-medium text-telkom-red mb-2">Preview:</p>
                    <p class="text-gray-900 font-mono break-all text-lg">
                      {username()}@{domains().find(d => d.id === selectedDomainId())?.name || "..."}
                    </p>
                  </div>
                  <div class="border-t border-telkom-red/10 pt-3">
                    <p class="text-sm font-medium text-telkom-red mb-2">Default Password:</p>
                    <div class="flex items-center gap-2">
                      <p class="text-gray-900 font-mono break-all flex-1 bg-white px-3 py-2 rounded-lg border border-gray-200">
                        {password()}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(password());
                          setSuccess("Password copied to clipboard!");
                          setTimeout(() => setSuccess(""), 2000);
                        }}
                        class="px-3 py-2 bg-telkom-red hover:bg-telkom-darkRed text-white rounded-lg transition-colors flex items-center gap-1"
                      >
                        📋 Copy
                      </button>
                    </div>
                    <p class="text-xs text-gray-600 mt-2">
                      Save this password to access your inbox later
                    </p>
                  </div>
                </div>
              </Show>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading() || selectedDomainId() === 0 || domains().length === 0}
                class="w-full"
              >
                {isLoading() ? (
                  <>
                    <span class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  <>Generate Email</>
                )}
              </Button>
            </form>
          </Card>
        </div>

        <div ref={featuresRef} class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <FeatureCard
            title="Lightning Fast"
            description="Get your temporary email in seconds. No signup, no hassle."
          />
          <FeatureCard
            title="Privacy First"
            description="No personal information required. Stay anonymous online."
          />
          <FeatureCard
            title="Easy to Use"
            description="Simple interface, powerful features. Just generate and go."
          />
        </div>
      </div>
    </EmailLayout>
  );
};

const FeatureCard: Component<{ title: string; description: string }> = (props) => {
  return (
    <div class="p-6 bg-white rounded-2xl border border-gray-200 hover:border-telkom-red/30 hover:shadow-xl transition-all duration-300">
      <h3 class="text-lg font-bold text-gray-900 mb-2">{props.title}</h3>
      <p class="text-sm text-telkom-gray">{props.description}</p>
    </div>
  );
};

export default LandingPage;
