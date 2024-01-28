import PreviewIframe from "./components/previewIframe";
import { ChatStyleContext } from "./utils/chatStyleContextProvider";
import { useState } from "react";
import { IconLock } from "@tabler/icons-react";
import CodeEditor from "./components/codeEditor";

function App() {
  const [styles, setStyles] = useState<string>("");
  return (
    <ChatStyleContext.Provider
      value={{
        styles,
        setStyles,
      }}>
      <div className="xl:max-w-7xl mx-auto pt-16 px-10 xl:grid grid-cols-2 gap-5">
        <div>
          <div className="text-gray-12 mb-5">
            <h1 className="text-5xl font-black tracking-tighter">
              Youtube Chat Styler{" "}
              <span className="badge badge-primary tracking-normal">Alpha v0.1</span>
            </h1>
            <p className="leading-5 text-gray-8 mt-5">
              Are you tired of the same old YouTube Live Chat? Do you want to spice up your chat
              with some style and flair? If you answered yes to these questions, then you are in
              luck! We have the perfect tool for you: a CSS editor for YouTube Live Chat! With this
              tool, you can easily write CSS code to customize the look and feel of your live chat.
              And the best part is, it’s completely free to use! Just type in your CSS code and see
              the magic happen.
            </p>
          </div>
          <div>
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-4xl font-black text-gray-12">Customization</h1>
              <div className="btn-group">
                <button className="btn btn-sm btn-solid-primary">CSS</button>
                <span className="tooltip tooltip-bottom" data-tooltip="Coming soon">
                  <button className="btn btn-sm flex gap-1 text-gray-8 cursor-not-allowed">
                    <IconLock size={14} />
                    Preset
                  </button>
                </span>
              </div>
            </div>
          </div>
          <CodeEditor />
        </div>
        <div>
          <div
            style={{
              backgroundPosition: "0 0, 15px 15px",
              backgroundSize: "30px 30px",
              backgroundRepeat: "repeat",
              backgroundImage:
                "linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee 100%), linear-gradient(45deg, #eee 25%, #fff 25%, #fff 75%, #eee 75%, #eee 100%)",
            }}
            className="grow-0 mt-5 xl:mt-0 rounded-lg overflow-hidden h-full max-h-[50rem] p-3 mb-5 flex items-center sticky top-16">
            <div className="absolute bg-black bg-opacity-25 h-full w-full left-0 top-0"></div>
            <PreviewIframe />
          </div>
          <p className="text-sm text-center text-gray-8">
            Created by{" "}
            <a target="_blank" href="https://x.com/miuky0" className="text-blue-500">
              miukyo
            </a>
            <br />
            Support me to make this website better!
          </p>
        </div>
      </div>
    </ChatStyleContext.Provider>
  );
}

export default App;
