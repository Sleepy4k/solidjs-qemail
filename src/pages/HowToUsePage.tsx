import { Component, onMount } from "solid-js";
import gsap from "gsap";
import { EmailLayout } from "../shared/layouts/EmailLayout";

const StepDetail: Component<{
  number: string;
  title: string;
  description: string;
  detail: string;
  tip?: string;
  gradient: string;
}> = (props) => (
  <div class="flex gap-5 sm:gap-6">
    <div class="flex-shrink-0">
      <div
        class={`w-12 h-12 sm:w-14 sm:h-14 ${props.gradient} rounded-2xl flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-md`}
      >
        {props.number}
      </div>
    </div>
    <div class="flex-1 pb-8 pl-5 sm:pl-6 -ml-[calc(1.5rem+1px)] sm:-ml-[calc(1.75rem+1px)]">
      <div class="ml-[calc(1.5rem+1px)] sm:ml-[calc(1.75rem+1px)]">
        <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-2">
          {props.title}
        </h3>
        <p class="text-sm sm:text-base text-gray-600 leading-relaxed mb-3">
          {props.description}
        </p>
        <div class="bg-gray-50 rounded-xl p-4 border border-gray-200 text-sm text-gray-600 leading-relaxed">
          {props.detail}
        </div>
        {props.tip && (
          <div class="mt-3 flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <svg
              class="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <p class="text-xs sm:text-sm text-amber-700">
              <strong>Tip:</strong> {props.tip}
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);

const HowToUsePage: Component = () => {
  let heroRef: HTMLDivElement | undefined;
  let bodyRef: HTMLDivElement | undefined;

  onMount(() => {
    if (heroRef) {
      gsap.fromTo(
        heroRef,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
      );
    }
    if (bodyRef) {
      gsap.fromTo(
        bodyRef,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: "power2.out" },
      );
    }
  });

  return (
    <EmailLayout currentPage="how-to-use">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div ref={heroRef} class="text-center mb-12 sm:mb-16">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-main-red to-red-700 rounded-2xl mb-6 shadow-lg">
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
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h1 class="text-3xl sm:text-5xl font-black text-gray-900 mb-4">
            How to Use{" "}
            <span class="bg-gradient-to-r from-main-red to-red-700 bg-clip-text text-transparent">
              QEmail
            </span>
          </h1>
          <p class="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about generating, using, and managing
            your temporary email address.
          </p>
        </div>

        <div ref={bodyRef} class="space-y-14">
          <section>
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span class="w-1 h-6 bg-main-red rounded-full inline-block" />
              Quick Overview
            </h2>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  num: "1",
                  label: "Choose Domain",
                  gradient: "bg-gradient-to-br from-main-red to-red-600",
                },
                {
                  num: "2",
                  label: "Generate Email",
                  gradient: "bg-gradient-to-br from-red-500 to-orange-500",
                },
                {
                  num: "3",
                  label: "Share & Receive",
                  gradient: "bg-gradient-to-br from-orange-500 to-amber-500",
                },
                {
                  num: "4",
                  label: "Done!",
                  gradient: "bg-gradient-to-br from-amber-500 to-yellow-500",
                },
              ].map((s) => (
                <div class="flex flex-col items-center text-center p-4 bg-white rounded-2xl border border-gray-200">
                  <div
                    class={`w-12 h-12 ${s.gradient} rounded-xl flex items-center justify-center text-white font-black text-lg shadow mb-3`}
                  >
                    {s.num}
                  </div>
                  <p class="text-xs sm:text-sm font-semibold text-gray-700">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Step by Step */}
          <section>
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <span class="w-1 h-6 bg-main-red rounded-full inline-block" />
              Step-by-Step Guide
            </h2>

            <div class="space-y-0">
              <StepDetail
                number="1"
                gradient="bg-gradient-to-br from-main-red to-red-600"
                title="Open the QEmail Homepage"
                description="Visit the QEmail home page. You'll see the email generation form in the center of the page."
                detail="No login, no sign-up page, no captcha. The form is ready to use as soon as the page loads. The page automatically fetches the list of available domains so you can choose right away."
                tip="Bookmark the homepage so you can quickly generate a new address anytime you need one."
              />
              <StepDetail
                number="2"
                gradient="bg-gradient-to-br from-red-500 to-orange-500"
                title="Choose a Domain"
                description="Select the domain you want to use from the dropdown list."
                detail="A domain is the part of an email address after the '@' symbol (for example, '@qemail.com'). QEmail may offer multiple domains pick any one you like. Some domains may be more recognizable to certain sites, so try a different one if a site rejects your address."
                tip="If a service rejects your email during signup, try switching to a different domain from the list."
              />
              <StepDetail
                number="3"
                gradient="bg-gradient-to-br from-orange-500 to-amber-500"
                title="Choose: Random or Custom"
                description="Decide whether you want a randomly generated address or a custom one you define yourself."
                detail={`Random Email: Click "Generate Random". QEmail immediately creates a random username (like x7k2p9qm1a) and a secure random password. Your address appears instantly in a preview box below. This is the fastest option ideal for one-time use.\n\nCustom Email: Click "Use Custom" to enter your own username and password. For example, you could create myname-test@domain.com. You'll also see an optional "Forward To" field if you fill this in with your real address, incoming emails will be forwarded there automatically.`}
                tip="Use a custom email when you want to remember the address easily or share it with someone without confusion."
              />
              <StepDetail
                number="4"
                gradient="bg-gradient-to-br from-amber-500 to-yellow-500"
                title="Save Your Password"
                description="Before clicking Generate, copy and save the password shown in the preview."
                detail="Your password is the only way to access your inbox later if you close the tab or lose your session. For random emails, the password is auto-generated and displayed in the preview box click the Copy button next to it to copy it to your clipboard. Store it in a safe place (a notes app, password manager, etc.) if you need to return to this inbox later."
                tip="Lost your password? Unfortunately, there is no recovery option. You can always generate a new address instead."
              />
              <StepDetail
                number="5"
                gradient="bg-gradient-to-br from-yellow-500 to-green-500"
                title="Click Generate Email"
                description="Press the big Generate Email button at the bottom of the form."
                detail="QEmail creates your inbox and redirects you to it automatically within a second. You'll see your new email address at the top of the inbox view along with your expiry time. The inbox is now live and ready to receive messages."
                tip="If the button is greyed out, make sure you've selected a domain from the dropdown first."
              />
              <StepDetail
                number="6"
                gradient="bg-gradient-to-br from-green-500 to-teal-500"
                title="Copy Your Email Address"
                description="Once inside your inbox, copy your temporary email address."
                detail="Your full email address (username@domain) is shown at the top of the inbox. Click the copy icon next to it to copy it instantly. You can now paste this address into any website, form, or service that requires an email."
                tip="Share this address wherever you don't want to use your real email trial sign-ups, giveaways, download forms, etc."
              />
              <StepDetail
                number="7"
                gradient="bg-gradient-to-br from-teal-500 to-blue-500"
                title="Wait for Emails to Arrive"
                description="Use your temporary address emails will appear in your inbox in real-time."
                detail="As soon as someone sends an email to your address, it appears in the inbox. You don't need to refresh the page manually the inbox polls for new messages automatically. Click on any email to read its full content including the sender, subject, and body."
                tip="If an email is taking too long to arrive, check the sender confirmation page some services have their own delays."
              />
              <StepDetail
                number="8"
                gradient="bg-gradient-to-br from-blue-500 to-indigo-500"
                title="Your Inbox Expires Automatically"
                description="When the inbox lifetime ends, all messages are permanently deleted."
                detail="Every inbox has an expiry time displayed at the top. Once it expires, the address stops receiving emails and all stored messages are deleted from the server. There is no warning or grace period if you need to keep a message, copy the content before the inbox expires."
                tip="Need more time? Generate a new custom address with the same username or simply create a fresh random one for your next task."
              />
            </div>
          </section>

          {/* Accessing Inbox Later */}
          <section>
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span class="w-1 h-6 bg-main-red rounded-full inline-block" />
              Returning to Your Inbox
            </h2>
            <div class="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-4">
              <p class="text-gray-600 leading-relaxed text-sm sm:text-base">
                If you close the tab or your session expires, you can return to
                your inbox by logging in manually:
              </p>
              <ol class="space-y-3">
                {[
                  "Go to the QEmail homepage.",
                  'Click "My Inbox" in the top navigation bar.',
                  "Enter your temporary email address (username@domain).",
                  "Enter the password you saved when generating the address.",
                  "Press Login. Your inbox will open if the address has not yet expired.",
                ].map((step, i) => (
                  <li class="flex gap-3 text-sm text-gray-600">
                    <span class="flex-shrink-0 w-6 h-6 bg-main-red/10 text-main-red rounded-full flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
                <strong>Important:</strong> If you generated a random email and
                did not copy the password before navigating away, there is no
                way to recover it. Always copy your password before leaving the
                generation page.
              </div>
            </div>
          </section>

          {/* Random vs Custom */}
          <section>
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span class="w-1 h-6 bg-main-red rounded-full inline-block" />
              Random vs. Custom Which Should You Use?
            </h2>
            <div class="grid sm:grid-cols-2 gap-4">
              <div class="bg-white rounded-2xl border border-gray-200 p-6">
                <div class="flex items-center gap-2 mb-4">
                  <div class="w-8 h-8 bg-main-red/10 rounded-lg flex items-center justify-center">
                    <svg
                      class="w-4 h-4 text-main-red"
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
                  </div>
                  <h3 class="font-bold text-gray-900">Random Email</h3>
                </div>
                <ul class="space-y-2 text-sm text-gray-600">
                  {[
                    "Fastest one click, immediately ready",
                    "Username is a random string (e.g. x7k2p9qm1a)",
                    "Password is auto-generated and shown in preview",
                    "Best for one-time verifications",
                    "No need to think of a username",
                  ].map((item) => (
                    <li class="flex gap-2">
                      <svg
                        class="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div class="bg-white rounded-2xl border border-gray-200 p-6">
                <div class="flex items-center gap-2 mb-4">
                  <div class="w-8 h-8 bg-main-red/10 rounded-lg flex items-center justify-center">
                    <svg
                      class="w-4 h-4 text-main-red"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </div>
                  <h3 class="font-bold text-gray-900">Custom Email</h3>
                </div>
                <ul class="space-y-2 text-sm text-gray-600">
                  {[
                    "Choose your own memorable username",
                    "Set your own password for easy recall",
                    "Optional: forward received emails to your real address",
                    "Best when you need to re-access the inbox later",
                    "Useful for sharing the address with others",
                  ].map((item) => (
                    <li class="flex gap-2">
                      <svg
                        class="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Tips */}
          <section>
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span class="w-1 h-6 bg-main-red rounded-full inline-block" />
              Tips & Best Practices
            </h2>
            <div class="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
              {[
                {
                  icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                  title:
                    "Always copy your password before leaving the generation page",
                  desc: "Once you navigate away, there's no way to recover a random email's password.",
                },
                {
                  icon: "M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4",
                  title: "Save important email content before expiry",
                  desc: "Copy any important verification codes or links out of the inbox before the expiry time is reached.",
                },
                {
                  icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
                  title: "Try a different domain if a site refuses the address",
                  desc: "Some websites block known temp email domains. Switching to another domain on QEmail often bypasses this.",
                },
                {
                  icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                  title: "Do not use for sensitive or critical communications",
                  desc: "Temporary emails are not secure for banking, legal, or sensitive personal matters. Use your real email for those.",
                },
                {
                  icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
                  title: "Generate a new address whenever you need one",
                  desc: "There's no limit on how many addresses you can create. Generate a fresh one for every new service you sign up for.",
                },
              ].map((tip) => (
                <div class="flex gap-4 p-5">
                  <div class="flex-shrink-0 w-9 h-9 bg-main-red/10 rounded-lg flex items-center justify-center">
                    <svg
                      class="w-4 h-4 text-main-red"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d={tip.icon}
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900 text-sm sm:text-base">
                      {tip.title}
                    </p>
                    <p class="text-xs sm:text-sm text-gray-500 mt-1">
                      {tip.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </EmailLayout>
  );
};

export default HowToUsePage;
