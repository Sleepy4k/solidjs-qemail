import { Component, Show, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Card, Input, Button, Alert } from "../../../../shared/components/ui";
import { adminStore } from "../../stores/admin.store";
import { ROUTES } from "../../../../shared/constants/routes.constant";
import { useAnimation } from "../../../../shared/hooks/use-animation.hook";
import { Navigation } from "../../../../shared/components/Navigation";

const LoginPage: Component = () => {
  const navigate = useNavigate();

  let formRef: HTMLDivElement | undefined;
  let usernameRef: HTMLInputElement | undefined;
  let passwordRef: HTMLInputElement | undefined;

  const [isLoading, setIsLoading] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal<string>("");

  useAnimation(() => formRef, {
    animation: "fadeIn",
    duration: 0.8,
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!usernameRef || !passwordRef) return;

    const username = usernameRef.value.trim();
    const password = passwordRef.value;

    if (!username || !password) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      await adminStore.login({ username, password });
      navigate(ROUTES.ADMIN.DASHBOARD, { replace: true });
    } catch (err: any) {
      // Parse friendly error messages
      const raw: string = err?.message ?? "";
      let message = "Login failed. Please check your credentials.";

      if (
        raw.toLowerCase().includes("401") ||
        raw.toLowerCase().includes("unauthorized") ||
        raw.toLowerCase().includes("invalid") ||
        raw.toLowerCase().includes("incorrect") ||
        raw.toLowerCase().includes("wrong")
      ) {
        message = "Invalid username or password. Please try again.";
      } else if (
        raw.toLowerCase().includes("network") ||
        raw.toLowerCase().includes("fetch") ||
        raw.toLowerCase().includes("connect")
      ) {
        message =
          "Cannot reach the server. Please check your connection and try again.";
      } else if (raw) {
        message = raw;
      }

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="min-h-screen bg-background-DEFAULT dark:bg-[#0f1117]">
      <Navigation showHomeLink={true} showAdminLink={false} />
      <div class="min-h-[calc(100vh-64px)] bg-gradient-to-br from-main-red/5 via-white dark:via-transparent to-main-red/10 flex items-center justify-center p-4">
        <div ref={formRef} class="w-full max-w-md">
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-main-red rounded-2xl shadow-lg mb-4">
              <svg
                class="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 class="text-3xl font-bold text-gray-900">Admin Login</h1>
            <p class="mt-2 text-gray-600">Sign in to access the admin panel</p>
          </div>

          <Card padding="lg" shadow="xl">
            <form onSubmit={handleSubmit} class="space-y-5">
              <Show when={errorMessage()}>
                <Alert
                  type="error"
                  message={errorMessage()}
                  onClose={() => setErrorMessage("")}
                />
              </Show>

              <Input
                ref={usernameRef}
                label="Username"
                type="text"
                placeholder="Enter your username"
                disabled={isLoading()}
                leftIcon={
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                }
                required
              />

              <Input
                ref={passwordRef}
                label="Password"
                type="password"
                placeholder="Enter your password"
                disabled={isLoading()}
                leftIcon={
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                }
                required
              />

              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={isLoading()}
                disabled={isLoading()}
              >
                Sign In
              </Button>
            </form>
          </Card>

          <p class="mt-6 text-center text-sm text-gray-600">
            Temporary Email Service Admin Panel
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
