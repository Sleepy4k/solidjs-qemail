import { Component, For, Show } from "solid-js";
import type { EmailAttachment } from "../types/email.types";

interface AttachmentListProps {
  attachments: EmailAttachment[];
  /** compact variant: smaller padding, used inside email list rows */
  compact?: boolean;
}

const formatBytes = (bytes: number): string => {
  if (!bytes || bytes === 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileIcon = (contentType: string): string => {
  if (contentType.startsWith("image/")) return "🖼️";
  if (contentType === "application/pdf") return "📄";
  if (
    contentType.includes("word") ||
    contentType.includes("document") ||
    contentType.includes("text/")
  )
    return "📝";
  if (
    contentType.includes("spreadsheet") ||
    contentType.includes("excel") ||
    contentType.includes("csv")
  )
    return "📊";
  if (contentType.includes("zip") || contentType.includes("compress"))
    return "🗜️";
  if (contentType.startsWith("audio/")) return "🎵";
  if (contentType.startsWith("video/")) return "🎬";
  return "📎";
};

export const AttachmentList: Component<AttachmentListProps> = (props) => {
  return (
    <Show when={props.attachments.length > 0}>
      <div
        class={`${props.compact ? "mt-2" : "px-4 sm:px-8 py-4 border-t border-gray-200"}`}
      >
        <Show when={!props.compact}>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Attachments ({props.attachments.length})
          </p>
        </Show>
        <div class="flex flex-wrap gap-2">
          <For each={props.attachments}>
            {(att) => (
              <a
                href={att.url}
                download={att.original_filename}
                target="_blank"
                rel="noopener noreferrer"
                class={`inline-flex items-center gap-2 ${props.compact ? "px-2 py-1" : "px-3 py-2"} bg-gray-100 hover:bg-primary-50 border border-gray-200 hover:border-primary-300 rounded-lg text-xs text-gray-700 hover:text-primary-700 transition-colors cursor-pointer`}
              >
                <span class="text-base leading-none">
                  {getFileIcon(att.mime_type)}
                </span>
                <span class="max-w-[150px] truncate font-medium">
                  {att.original_filename || "Attachment"}
                </span>
                <Show when={att.size}>
                  <span class="text-gray-400 flex-shrink-0">
                    {formatBytes(att.size)}
                  </span>
                </Show>
                <svg
                  class="w-3 h-3 flex-shrink-0 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </a>
            )}
          </For>
        </div>
      </div>
    </Show>
  );
};

/** Small paperclip badge used in email list rows to indicate attachments */
export const AttachmentBadge: Component<{ count: number }> = (props) => (
  <Show when={props.count > 0}>
    <span
      class="inline-flex items-center gap-1 text-xs text-gray-500 flex-shrink-0"
      title={`${props.count} attachment${props.count > 1 ? "s" : ""}`}
    >
      <svg
        class="w-3.5 h-3.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
        />
      </svg>
      {props.count}
    </span>
  </Show>
);
