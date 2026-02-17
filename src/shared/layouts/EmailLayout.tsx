import { Component, JSX } from "solid-js";
import { Navigation } from "../components/Navigation";

interface EmailLayoutProps {
  children: JSX.Element;
  showAdminLink?: boolean;
  currentPage?: "landing" | "inbox" | "email-login" | "home";
}

export const EmailLayout: Component<EmailLayoutProps> = (props) => {
  return (
    <div class="min-h-screen bg-background-DEFAULT relative">
      {/* Background Pattern */}
      <div class="fixed inset-0 opacity-5 pointer-events-none z-0">
        <div
          class="absolute inset-0"
          style={{
            "background-image": `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ee2737' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Navigation */}
      <div class="relative z-10">
        <Navigation 
          showAdminLink={props.showAdminLink ?? true} 
          currentPage={props.currentPage}
        />
      </div>

      {/* Content */}
      <div class="relative z-10">
        {props.children}
      </div>
    </div>
  );
};
