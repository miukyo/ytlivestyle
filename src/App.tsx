import PreviewIframe from "@components/previewIframe";
import { ChatCSSProvider } from "./utils/chatCSSContextProvider";
import { useState } from "react";
import CodeEditor from "@components/editor/codeEditor";
import PresetEditor from "@components/editor/presetEditor";
import { PresetContextProvider } from "./utils/presetContextProvider";
import { Analytics } from "@vercel/analytics/react"

function App() {
  // const [CSS, setCSS] = useState<string>("");
  const [editorMode, setEditorMode] = useState<"css" | "preset">("preset");
  // useEffect(() => {
  //   localforage.getItem("cssStyle").then((value) => {
  //     if (typeof value === "string") {
  //       setCSS(value);
  //     } else {
  //       setCSS(defaultCSS);
  //     }
  //   });
  // }, []);
  return (
    <PresetContextProvider>
      <Analytics />
      <ChatCSSProvider>
        <div className="xl:max-w-7xl mx-auto pt-16 px-10 lg:grid grid-cols-2 gap-5">
          <div>
            <div className="text-gray-12 mb-5">
              <h1 className="text-5xl font-black tracking-tighter">
                Youtube Chat Styler{" "}
                <span className="badge badge-primary tracking-normal">Alpha v0.2</span>
              </h1>
              <p className="leading-5 text-gray-8 mt-5">
                Are you tired of the same old YouTube Live Chat? Do you want to spice up your chat
                with some style and flair? We have the perfect tool for you! With this tool, you can
                easily customize the look and feel of your live chat. And the best part is, it’s
                completely free to use!
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between gap-2">
                <h1 className="text-4xl font-black text-gray-12">Customization</h1>
                <div className="btn-group">
                  <button
                    onClick={() => setEditorMode("preset")}
                    className={`btn btn-sm ${
                      editorMode === "preset" ? "btn-active btn-solid-primary" : ""
                    }`}>
                    Preset
                  </button>
                  <button
                    onClick={() => setEditorMode("css")}
                    className={`btn btn-sm ${
                      editorMode === "css" ? "btn-active btn-solid-primary" : ""
                    }`}>
                    CSS
                  </button>
                </div>
              </div>
            </div>
            {editorMode === "css" && <CodeEditor />}
            {editorMode === "preset" && <PresetEditor />}
          </div>
          <div className="sticky top-16 flex flex-col h-fit">
            <div
              style={{
                backgroundPosition: "0 0, 15px 15px",
                backgroundSize: "30px 30px",
                backgroundRepeat: "repeat",
                backgroundImage:
                  "linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee 100%), linear-gradient(45deg, #eee 25%, #fff 25%, #fff 75%, #eee 75%, #eee 100%)",
              }}
              className="grow-0 mt-5 xl:mt-0 rounded-lg overflow-hidden h-[50rem] p-3 mb-5 flex items-center">
              <div className="absolute bg-black bg-opacity-25 h-full w-full left-0 top-0"></div>
              <PreviewIframe />
            </div>
            <p className="text-sm text-center text-gray-8">
              Created by{" "}
              <a target="_blank" href="https://x.com/miuky0" className="text-primary">
                miukyo
              </a>
              <br />
              Please report any bug to my dm!
            </p>
          </div>
        </div>
      </ChatCSSProvider>
    </PresetContextProvider>
  );
}

export default App;
