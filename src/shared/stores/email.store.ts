import { createSignal } from "solid-js";

interface EmailSession {
  email: string;
  token: string;
  session_token: string;
  expires_at: string;
}

const getStoredSession = (): EmailSession | null => {
  const stored = localStorage.getItem("email_session");
  if (!stored) return null;

  try {
    const session = JSON.parse(stored) as EmailSession;

    if (new Date(session.expires_at) < new Date()) {
      localStorage.removeItem("email_session");
      return null;
    }

    return session;
  } catch {
    return null;
  }
};

const [emailSession, setEmailSession] = createSignal<EmailSession | null>(
  getStoredSession(),
);

export const emailStore = {
  get session() {
    return emailSession();
  },

  setSession(session: EmailSession) {
    localStorage.setItem("email_session", JSON.stringify(session));
    setEmailSession(session);
  },

  clearSession() {
    localStorage.removeItem("email_session");
    setEmailSession(null);
  },

  isAuthenticated(): boolean {
    const session = emailSession();
    if (!session) return false;

    if (new Date(session.expires_at) < new Date()) {
      this.clearSession();
      return false;
    }

    return true;
  },

  getToken(): string | null {
    const session = emailSession();
    return session?.session_token || session?.token || null;
  },
};
