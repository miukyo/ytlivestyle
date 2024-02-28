import { useContext, useEffect, useRef } from "react";
import { ChatCSSContext } from "@/utils/chatCSSContextProvider";

export default function PreviewIframe() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const { CSS } = useContext(ChatCSSContext);

  useEffect(() => {
    const win = frameRef.current && frameRef.current.contentWindow;
    if (!win) return;
    const CSSheetURL = URL.createObjectURL(new Blob([CSS], { type: "text/css" }));

    const delayDebounceFn = setTimeout(() => {
      win.postMessage({ url: CSSheetURL }, win.origin);
    }, 500);

    return () => {
      clearTimeout(delayDebounceFn);
    };
  }, [CSS]);

  return (
    <>
      <iframe
        title="preview"
        ref={frameRef}
        style={{ colorScheme: "normal" }}
        className="block w-full h-full z-10 relative min-h-[40rem]"
        src="/preview.html"
      />
    </>
  );
}
