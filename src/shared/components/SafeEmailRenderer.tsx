import { Component, createEffect, onMount } from "solid-js";

interface SafeEmailRendererProps {
  html: string;
  class?: string;
  minHeight?: number;
}

/** Extract only the <body> content from a full HTML document, or return as-is. */
const extractBodyContent = (html: string): string => {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) return bodyMatch[1];
  // Strip top-level <html>/<head> if present but no explicit body
  const headlessHtml = html.replace(/<\/?html[^>]*>/gi, "").replace(/<head[\s\S]*?<\/head>/gi, "");
  return headlessHtml;
};

export const SafeEmailRenderer: Component<SafeEmailRendererProps> = (props) => {
  let iframeRef: HTMLIFrameElement | undefined;

  const resize = () => {
    if (!iframeRef?.contentDocument?.body) return;
    const scrollH = iframeRef.contentDocument.documentElement.scrollHeight;
    iframeRef.style.height = `${Math.max(scrollH, props.minHeight ?? 80)}px`;
  };

  const injectContent = (html: string) => {
    if (!iframeRef?.contentDocument) return;
    const bodyContent = extractBodyContent(html);
    const doc = iframeRef.contentDocument;
    doc.open();
    doc.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  html, body {
    margin: 0;
    padding: 8px;
    background: #ffffff;
    color: #111827;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    word-break: break-word;
  }
  img { max-width: 100%; height: auto; }
  a { pointer-events: none; cursor: default; }
  table { max-width: 100%; }
  pre, code { white-space: pre-wrap; word-break: break-all; }
</style>
</head>
<body>${bodyContent}</body>
</html>`);
    doc.close();
  };

  onMount(() => {
    injectContent(props.html);
  });

  createEffect(() => {
    const html = props.html;
    if (!iframeRef) return;
    injectContent(html);
  });

  return (
    <iframe
      ref={iframeRef}
      sandbox="allow-same-origin"
      class={`w-full border-0 block ${props.class ?? ""}`}
      style={{ "min-height": `${props.minHeight ?? 80}px` }}
      title="Email content"
      aria-label="Email content"
      onLoad={resize}
    />
  );
};

