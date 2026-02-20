import { Component, createSignal, onMount } from "solid-js";
import gsap from "gsap";
import { EmailLayout } from "../shared/layouts/EmailLayout";

const FAQItem: Component<{ question: string; answer: string }> = (props) => {
  const [open, setOpen] = createSignal(false);
  return (
    <div class="border border-gray-200 rounded-xl overflow-hidden">
      <button
        class="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open())}
      >
        <span class="font-medium text-gray-900 text-sm sm:text-base pr-3">
          {props.question}
        </span>
        <svg
          class={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open() ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        class={`px-5 bg-gray-50 text-sm text-gray-600 leading-relaxed overflow-hidden transition-all duration-300 ${
          open() ? "py-4 max-h-96" : "max-h-0 py-0"
        }`}
      >
        {props.answer}
      </div>
    </div>
  );
};

const FAQPage: Component = () => {
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
    <EmailLayout currentPage="faq">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
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
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 class="text-3xl sm:text-5xl font-black text-gray-900 mb-4">
            Frequently Asked{" "}
            <span class="bg-gradient-to-r from-main-red to-red-700 bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p class="text-base sm:text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
            Everything you might want to know about QEmail, all in one place.
          </p>
        </div>

        <div ref={bodyRef} class="space-y-10">
          <section>
            <div class="flex items-center gap-3 mb-5">
              <div class="w-9 h-9 bg-main-red/10 rounded-xl flex items-center justify-center flex-shrink-0">
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
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 class="text-lg sm:text-xl font-bold text-gray-900">
                General
              </h2>
            </div>
            <div class="space-y-3">
              <FAQItem
                question="What is QEmail?"
                answer="QEmail is a free, disposable temporary email service. You can create a working inbox in seconds without any registration or personal information. Simply visit the homepage, choose a domain, generate your address, and start receiving emails instantly."
              />
              <FAQItem
                question="Is QEmail completely free?"
                answer="Yes, QEmail is 100% free to use. There are no paid plans, no premium features behind a paywall, and no hidden costs. You can generate as many addresses as you need at no charge."
              />
              <FAQItem
                question="Do I need to create an account or register?"
                answer="No. You never need to register or provide any personal information no name, no phone number, no real email address. Just open the website, generate an address, and your inbox is ready immediately."
              />
              <FAQItem
                question="How long does a temporary inbox last?"
                answer="Each inbox has an expiry time that is shown at the top of the inbox once it's created. Random inboxes typically expire after a few hours to a day. Custom inboxes may have a configurable expiry. Once expired, the address stops receiving emails and all messages are permanently deleted."
              />
              <FAQItem
                question="Can I use QEmail to send emails?"
                answer="No. QEmail is a receive-only service. You can receive emails sent to your temporary address, but you cannot send outgoing messages from it."
              />
              <FAQItem
                question="Is there a limit to how many addresses I can create?"
                answer="No. You can generate as many temporary addresses as you want. Each generation creates a fresh, independent inbox. There is no daily cap or usage limit."
              />
            </div>
          </section>

          <section>
            <div class="flex items-center gap-3 mb-5">
              <div class="w-9 h-9 bg-main-red/10 rounded-xl flex items-center justify-center flex-shrink-0">
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
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 class="text-lg sm:text-xl font-bold text-gray-900">
                Using QEmail
              </h2>
            </div>
            <div class="space-y-3">
              <FAQItem
                question="How do I get my temporary email address?"
                answer="Go to the QEmail homepage. Select a domain from the dropdown, then choose either 'Generate Random' for an instant address or 'Use Custom' to set your own username and password. Click Generate Email and your inbox opens automatically."
              />
              <FAQItem
                question="What is the difference between Random and Custom email?"
                answer="A Random email has an auto-generated username (like x7k2p9qm1a) and a randomly created password it's the fastest option for one-time use. A Custom email lets you choose your own username and password, which makes it easier to remember and return to later. Custom emails also support the optional 'Forward To' field."
              />
              <FAQItem
                question="What is the 'Forward To' field in custom emails?"
                answer="When creating a custom email, you can optionally enter your real email address in the 'Forward To' field. Any email received by your temporary address will then also be forwarded to your real inbox automatically. This is useful if you want to receive notifications without keeping the QEmail tab open."
              />
              <FAQItem
                question="I didn't copy my password can I recover my inbox?"
                answer="Unfortunately, no. Passwords cannot be recovered once the generation page is closed. You will need to generate a new email address. To avoid this in the future, always copy or save your password before navigating away from the generation page."
              />
              <FAQItem
                question="Can I return to my inbox after closing the tab?"
                answer="Yes, as long as the inbox has not yet expired. Go to the homepage, click 'My Inbox' in the navigation bar, enter your email address and password, then press Login. If the inbox is still active, you will be taken directly to it."
              />
              <FAQItem
                question="Can I use the same address multiple times?"
                answer="If the inbox has not expired, you can continue using the same address by logging back in with your credentials. Once the inbox expires, the address is permanently gone and cannot be reused or restored."
              />
              <FAQItem
                question="Why isn't my email arriving in my inbox?"
                answer="Emails typically arrive within a few seconds. If it's been more than a minute: (1) double-check you gave the exact correct address to the sender including the correct domain, (2) check whether the sender's system shows any delivery errors or delays, (3) confirm your inbox has not already expired, (4) try refreshing the inbox page manually."
              />
              <FAQItem
                question="A website refused to accept my temporary email. What can I do?"
                answer="Some websites block known temporary email domains. Try switching to a different domain from the dropdown on the QEmail homepage QEmail offers multiple domains and some may not be blocked by that site. If all domains are blocked, the website actively prevents disposable emails from being used."
              />
            </div>
          </section>

          <section>
            <div class="flex items-center gap-3 mb-5">
              <div class="w-9 h-9 bg-main-red/10 rounded-xl flex items-center justify-center flex-shrink-0">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h2 class="text-lg sm:text-xl font-bold text-gray-900">
                Privacy & Security
              </h2>
            </div>
            <div class="space-y-3">
              <FAQItem
                question="Are the emails in my inbox private?"
                answer="Your inbox is accessible to anyone who knows the email address and password. For random addresses, the username is a hard-to-guess random string, making it unlikely that others can access it. However, QEmail inboxes are not designed to be highly secure do not use them for sensitive, financial, or confidential communications."
              />
              <FAQItem
                question="What happens to my emails after the inbox expires?"
                answer="All emails and data associated with an expired inbox are permanently and automatically deleted from our servers. There is no grace period, no archive, and no way to retrieve them after expiry."
              />
              <FAQItem
                question="Does QEmail store or track my personal data?"
                answer="No. QEmail does not collect personal data. We do not ask for your name, phone number, or real email address. Your session is anonymous and not linked to any personal identity. We do not track your activity across sessions or use cookies for profiling."
              />
              <FAQItem
                question="Does QEmail sell data to third parties?"
                answer="No. QEmail does not sell, share, or transfer any user data to third parties. The service is designed with privacy as a core principle."
              />
              <FAQItem
                question="Is QEmail safe to use for account verifications?"
                answer="QEmail is safe for low-risk verifications such as newsletter signups, free trial registrations, software downloads, and similar purposes. Do not use it for accounts where security matters banking, government services, medical portals, or anything that stores sensitive personal or financial information."
              />
              <FAQItem
                question="Can someone else read my emails if they guess my address?"
                answer="If someone knows both your email address and password, they can access your inbox. Random emails use a hard-to-guess username and auto-generated password, making this very unlikely. For custom emails, the security depends entirely on how strong and unique your chosen password is."
              />
            </div>
          </section>

          <section>
            <div class="flex items-center gap-3 mb-5">
              <div class="w-9 h-9 bg-main-red/10 rounded-xl flex items-center justify-center flex-shrink-0">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 class="text-lg sm:text-xl font-bold text-gray-900">
                Inbox & Expiry
              </h2>
            </div>
            <div class="space-y-3">
              <FAQItem
                question="How do I know when my inbox will expire?"
                answer="The expiry time is displayed at the top of your inbox view once it has been created. You can see the exact date and time your inbox will stop receiving emails and be deleted."
              />
              <FAQItem
                question="Will I be notified before my inbox expires?"
                answer="No. There is no notification system for expiry. It is your responsibility to check the expiry time and save any important content (such as verification codes or links) before the inbox expires."
              />
              <FAQItem
                question="Can I extend the lifetime of my inbox?"
                answer="No. Once an inbox is created, its expiry time is fixed and cannot be extended. If you need more time, you can generate a new custom email with the same username this creates a fresh inbox with a new expiry period."
              />
              <FAQItem
                question="What should I do if I need to keep an email's content?"
                answer="Copy the content you need (verification codes, links, important text) out of the inbox before the expiry time. You can paste it into a notes app, document, or password manager. There is no export function manual copying is the only way to save it."
              />
            </div>
          </section>
        </div>
      </div>
    </EmailLayout>
  );
};

export default FAQPage;
