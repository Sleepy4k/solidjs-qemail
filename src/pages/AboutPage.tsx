import { Component, onMount } from "solid-js";
import gsap from "gsap";
import { EmailLayout } from "../shared/layouts/EmailLayout";

const AboutPage: Component = () => {
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
    <EmailLayout currentPage="about">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Hero */}
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 class="text-3xl sm:text-5xl font-black text-gray-900 mb-4">
            About{" "}
            <span class="bg-gradient-to-r from-main-red to-red-700 bg-clip-text text-transparent">
              QEmail
            </span>
          </h1>
          <p class="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            A free, fast, and privacy-focused temporary email service. No
            accounts. No tracking. Just a clean inbox when you need one.
          </p>
        </div>

        <div ref={bodyRef} class="space-y-12">
          {/* What is QEmail */}
          <section>
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span class="w-1 h-6 bg-main-red rounded-full inline-block" />
              What is QEmail?
            </h2>
            <div class="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-4">
              <p class="text-gray-600 leading-relaxed">
                <strong class="text-gray-900">QEmail</strong> is a disposable,
                temporary email service that lets you create a working inbox in
                seconds without any registration, personal data, or password.
                Simply visit the home page, pick a domain, and your inbox is
                ready to use.
              </p>
              <p class="text-gray-600 leading-relaxed">
                Each address is fully functional: it can receive emails from any
                sender in real-time. Once you're done, the inbox expires on its
                own there's nothing to delete or manage.
              </p>
              <p class="text-gray-600 leading-relaxed">
                QEmail was built for people who value their privacy and want to
                keep their real inbox free from marketing emails, spam, one-time
                verifications, and unwanted newsletters.
              </p>
            </div>
          </section>

          {/* Mission */}
          <section>
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span class="w-1 h-6 bg-main-red rounded-full inline-block" />
              Our Mission
            </h2>
            <div class="bg-gradient-to-br from-main-red/5 to-red-50 rounded-2xl border border-main-red/10 p-6 sm:p-8">
              <p class="text-gray-700 leading-relaxed text-base sm:text-lg font-medium italic">
                "To give everyone a simple, reliable way to protect their real
                email identity for free, forever."
              </p>
              <p class="text-gray-600 leading-relaxed mt-4">
                The internet requires an email address for almost everything:
                signing up for services, downloading files, reading articles, or
                joining communities. Most of the time, you don't want those
                services to have your real address. QEmail exists so you don't
                have to give it up.
              </p>
            </div>
          </section>

          {/* Key Features */}
          <section>
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span class="w-1 h-6 bg-main-red rounded-full inline-block" />
              Key Features
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: "M13 10V3L4 14h7v7l9-11h-7z",
                  title: "Instant Generation",
                  desc: "Your temporary inbox is created in under a second. No forms, no confirmations just click and go.",
                },
                {
                  icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                  title: "No Registration",
                  desc: "We never ask for your name, phone number, or any personal information. One click is all it takes.",
                },
                {
                  icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                  title: "Privacy by Design",
                  desc: "No cookies, no trackers, no user profiling. Your session is fully anonymous and temporary.",
                },
                {
                  icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                  title: "Real-Time Inbox",
                  desc: "Emails arrive instantly and are displayed with subject, sender, and full content just like a real inbox.",
                },
                {
                  icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
                  title: "Custom or Random",
                  desc: "Choose your own username and password for a memorable address, or let us generate a random one instantly.",
                },
                {
                  icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                  title: "Auto-Expiry",
                  desc: "Inboxes expire automatically after their set period. No cleanup required they simply disappear.",
                },
              ].map((f) => (
                <div class="flex gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-main-red/30 hover:shadow-md transition-all">
                  <div class="flex-shrink-0 w-10 h-10 bg-main-red/10 rounded-lg flex items-center justify-center">
                    <svg
                      class="w-5 h-5 text-main-red"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d={f.icon}
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900 text-sm sm:text-base mb-1">
                      {f.title}
                    </h3>
                    <p class="text-xs sm:text-sm text-gray-500 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Privacy */}
          <section>
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span class="w-1 h-6 bg-main-red rounded-full inline-block" />
              Privacy & Security
            </h2>
            <div class="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-4">
              <p class="text-gray-600 leading-relaxed">
                We take your privacy seriously. Here's exactly what QEmail does
                and doesn't do:
              </p>
              <div class="space-y-3">
                {[
                  {
                    ok: true,
                    text: "All inboxes are temporary and expire automatically",
                  },
                  { ok: true, text: "No personal data is collected or stored" },
                  { ok: true, text: "No login or registration required" },
                  {
                    ok: true,
                    text: "Your session is tied only to your browser nothing else",
                  },
                  {
                    ok: false,
                    text: "We do NOT sell or share any data with third parties",
                  },
                  {
                    ok: false,
                    text: "We do NOT track your activity across sessions",
                  },
                  {
                    ok: false,
                    text: "We do NOT send marketing emails or notifications",
                  },
                ].map((item) => (
                  <div class="flex items-start gap-3">
                    <span
                      class={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${item.ok ? "bg-green-100" : "bg-red-100"}`}
                    >
                      <svg
                        class={`w-3 h-3 ${item.ok ? "text-green-600" : "text-red-600"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="3"
                          d={
                            item.ok ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"
                          }
                        />
                      </svg>
                    </span>
                    <p class="text-sm text-gray-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Stats */}
          <section>
            <div class="grid grid-cols-3 gap-4">
              {[
                { value: "100%", label: "Free Forever" },
                { value: "0", label: "Registration Required" },
                { value: "∞", label: "Addresses Available" },
              ].map((s) => (
                <div class="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 text-center">
                  <p class="text-2xl sm:text-3xl font-black text-main-red">
                    {s.value}
                  </p>
                  <p class="text-xs sm:text-sm text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </EmailLayout>
  );
};

export default AboutPage;
