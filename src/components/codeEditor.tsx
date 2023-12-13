import localforage from "localforage";
import js_beautify from "js-beautify";
import defaultCSS from "../css/defaultCSS.css?raw";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  IconCircleCheckFilled,
  IconCopy,
  IconDeviceFloppy,
  IconInfoCircleFilled,
  IconReload,
} from "@tabler/icons-react";
import { atomone } from "@uiw/codemirror-theme-atomone";
import ReactCodeMirror from "@uiw/react-codemirror";
import { langs } from "@uiw/codemirror-extensions-langs";
import { color } from "@uiw/codemirror-extensions-color";
import { ChatStyleContext } from "../utils/chatStyleContextProvider";

function CodeEditor() {
  const { styles, setStyles } = useContext(ChatStyleContext);
  const [autoSave, setAutoSave] = useState<boolean>(true);
  const [savingLoading, setSavingLoading] = useState<boolean>(false);
  const [formatSavingLoading, setFormatSavingLoading] = useState<boolean>(false);
  const [copyLoading, setCopyLoading] = useState<boolean>(false);

  useEffect(() => {
    localforage.getItem("cssStyle").then((value) => {
      if (typeof value === "string") {
        setStyles(value);
      } else {
        setStyles(defaultCSS);
      }
    });
    localforage.getItem("autoSave").then((value) => {
      if (typeof value === "boolean") {
        setAutoSave(value);
      }
    });
  }, []);
  const reset = () => {
    setStyles(defaultCSS);
  };
  const formatnsave = async () => {
    const formatted = js_beautify.css(styles, { indent_size: 2 });
    setStyles(formatted);
    await localforage.setItem("cssStyle", formatted);
    setFormatSavingLoading(true);
    setTimeout(() => {
      setFormatSavingLoading(false);
    }, 500);
  };
  const autoSaver = async (e: string) => {
    if (autoSave) {
      setStyles(e);
      setSavingLoading(true);
      const delayDebounceFn = setTimeout(async () => {
        setSavingLoading(false);
        await localforage.setItem("cssStyle", e);
      }, 500);
      return () => {
        setSavingLoading(false);
        clearTimeout(delayDebounceFn);
      };
    } else {
      setStyles(e);
    }
  };
  const setAutoSaveLocal = async () => {
    await localforage.setItem("autoSave", !autoSave);
    setAutoSave(!autoSave);
  };
  const handleKeyPress = useCallback(
    async (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "s") {
        event.preventDefault();
        await localforage.setItem("cssStyle", styles);
        setFormatSavingLoading(true);
        setTimeout(() => {
          setFormatSavingLoading(false);
        }, 500);
      }
    },
    [styles]
  );

  const copyToClipboard = () => {
    navigator.clipboard.writeText(styles).then(() => {
      setCopyLoading(true);
      setTimeout(() => {
        setCopyLoading(false);
      }, 500);
    });
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);
  return (
    <>
      {" "}
      <div className="mt-5 rounded-lg overflow-hidden relative">
        {formatSavingLoading ? (
          <div className="absolute pointer-events-none -bottom-5 left-0 w-full z-20 animate-fade animate-reverse animate-delay-300 animate-duration-200">
            <div className="w-full px-20 py-5 animate-fade-up animate-duration-150 animate-ease-out">
              <div className="alert max-w-sm mx-auto scale-75 shadow-xl">
                <IconCircleCheckFilled size={48} />
                <div className="flex flex-col">
                  <span>Saved</span>
                  <span className="text-content2">Your CSS are saved!</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {copyLoading ? (
          <div className="absolute pointer-events-none -bottom-5 left-0 w-full z-20 animate-fade animate-reverse animate-delay-300 animate-duration-200">
            <div className="w-full px-20 py-5 animate-fade-up animate-duration-150 animate-ease-out">
              <div className="alert max-w-sm mx-auto scale-75 shadow-xl">
                <IconInfoCircleFilled size={48} />
                <div className="flex flex-col">
                  <span>Copied</span>
                  <span className="text-content2">Your CSS are copied to your clipboard!</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <ReactCodeMirror
          value={styles}
          height="525px"
          theme={atomone}
          extensions={[langs.css(), color]}
          onChange={autoSaver}
        />
      </div>
      <div className="flex justify-between items-center mt-3">
        <div className="gap-2 flex items-center">
          <input
            type="checkbox"
            className="switch switch-primary"
            onChange={setAutoSaveLocal}
            checked={autoSave}
          />
          <p>Autosave</p>
          {savingLoading ? <div className="spinner-simple [--spinner-size:15px]"></div> : null}
        </div>
        <div className="gap-2 flex">
          <button onClick={() => reset()} className="btn flex gap-1">
            <IconReload size={16} />
            Reset
          </button>
          <button onClick={() => formatnsave()} className="btn flex gap-1">
            <IconDeviceFloppy size={16} />
            Format & Save
          </button>
          <button onClick={() => copyToClipboard()} className="btn btn-primary flex gap-1">
            <IconCopy size={16} />
            Copy
          </button>
        </div>
      </div>
    </>
  );
}

export default CodeEditor;
