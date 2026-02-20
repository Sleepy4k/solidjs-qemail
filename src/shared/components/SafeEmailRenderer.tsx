import { Component, createEffect, onMount } from "solid-js";

interface SafeEmailRendererProps {
  html: string;
  class?: string;
  minHeight?: number;
}

export const SafeEmailRenderer: Component<SafeEmailRendererProps> = (props) => {
  let iframeRef: HTMLIFrameElement | undefined;

  const resize = () => {
    if (!iframeRef?.contentDocument?.body) return;
    const scrollH = iframeRef.contentDocument.documentElement.scrollHeight;
    iframeRef.style.height = `${scrollH}px`;
  };

  const injectContent = (html: string) => {
    if (!iframeRef?.contentDocument) return;
    const doc = iframeRef.contentDocument;
    doc.open();
    doc.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  html, body { margin: 0; padding: 0; }
  img { max-width: 100%; height: auto; }
  a { pointer-events: none; cursor: default; }
</style>
</head>
<body>${html}</body>
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
