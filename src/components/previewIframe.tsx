import { useContext, useEffect, useRef } from "react";
import { ChatStyleContext } from "../utils/chatStyleContextProvider";

export default function PreviewIframe() {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const { styles } = useContext(ChatStyleContext);

  useEffect(() => {
    const win = frameRef.current && frameRef.current.contentWindow;
    if (!win) return;
    const styleSheetURL = URL.createObjectURL(new Blob([styles], { type: "text/css" }));

    const delayDebounceFn = setTimeout(() => {
      win.postMessage({ url: styleSheetURL }, win.origin);
    }, 500);

    return () => {
      clearTimeout(delayDebounceFn);
    };
  }, [styles]);

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
