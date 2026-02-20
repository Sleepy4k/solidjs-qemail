import { Component } from "solid-js";
import { A } from "@solidjs/router";

const NotFoundPage: Component = () => {
  return (
    <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div class="text-center max-w-md">
        <div class="mb-8 relative">
          <p class="text-[8rem] sm:text-[10rem] font-black text-gray-400 leading-none select-none">
            404
          </p>
        </div>

        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          Page Not Found
        </h1>
        <p class="text-gray-500 text-sm sm:text-base mb-2">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div class="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <A
            href="/"
            class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-lg font-medium text-sm hover:bg-primary-700 transition-colors"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Go Home
          </A>
          <button
            onClick={() => window.history.back()}
            class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-400 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
