import { Component, JSX } from "solid-js";
import { Navigation } from "../components/Navigation";
import BACKGROUND from "@assets/images/background.png";

interface EmailLayoutProps {
  children: JSX.Element;
  showAdminLink?: boolean;
  currentPage?:
    | "landing"
    | "inbox"
    | "email-login"
    | "home"
    | "about"
    | "how-to-use"
    | "faq";
}

export const EmailLayout: Component<EmailLayoutProps> = (props) => {
  return (
    <div class="min-h-screen bg-background-DEFAULT dark:bg-navy-900 relative">
      <div class="fixed inset-0 opacity-5 pointer-events-none z-0">
        <div
          class="absolute inset-0"
          style={{
            "background-image": `url(${BACKGROUND})`,
            "background-position": "center",
          }}
        />
      </div>

      <Navigation
        showAdminLink={props.showAdminLink ?? true}
        currentPage={props.currentPage}
      />

      <div class="relative z-10">{props.children}</div>
    </div>
  );
};
