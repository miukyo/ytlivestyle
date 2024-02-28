import { useContext, useState } from "react";
import {
  IconBook,
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
import { ChatCSSContext } from "../../utils/chatCSSContextProvider";
import { PresetContext } from "@/utils/presetContextProvider";
import Modal from "../ui/Modal";

function CodeEditor() {
  const {
    CSS,
    save,
    savingFallback,
    setAutoSave,
    copy,
    reset,
    autoSave,
    autoSaver,
    copyFallback,
    formatFallback,
  } = useContext(ChatCSSContext);
  const { checkReset } = useContext(PresetContext);
  const [guideOpen, setGuideOpen] = useState(false);

  // const handleKeyPress = useCallback(
  //   async (event: KeyboardEvent) => {
  //     if (event.ctrlKey && event.key === "s") {
  //       event.preventDefault();
  //       await localforage.setItem("cssStyle", styles);
  //       setFormatSavingLoading(true);
  //       setTimeout(() => {
  //         setFormatSavingLoading(false);
  //       }, 500);
  //     }
  //   },
  //   [styles]
  // );

  // useEffect(() => {
  //   document.addEventListener("keydown", handleKeyPress);

  //   return () => {
  //     document.removeEventListener("keydown", handleKeyPress);
  //   };
  // }, [handleKeyPress]);
  return (
    <>
      <Modal isOpen={guideOpen} setIsOpen={setGuideOpen}>
        <h2 className="text-xl">Guide</h2>
        <div className="text-sm">
          <p className="text-gray-8">List of placeholder that supported by preset editor</p>
          <div className="grid grid-cols-[60px_1fr] font-normal">
            <kbd className="color kbd-xs">Color</kbd>
            <span>
              : insert comment
              <kbd className="color kbd-xs">/*color*/</kbd> after variable.
            </span>

            <kbd className="color kbd-xs">Number</kbd>
            <span>
              : insert comment
              <kbd className="color kbd-xs">/*number*/</kbd> after variable.
            </span>

            <kbd className="color kbd-xs">Text</kbd>
            <span>
              : insert comment
              <kbd className="color kbd-xs">/*text*/</kbd> after variable.
            </span>

            <kbd className="color kbd-xs">Select</kbd>
            <span>
              : insert comment
              <kbd className="color kbd-xs">/*select*/</kbd> after variable. use
              <kbd className="color kbd-xs">||</kbd> as separator between options. you can use
              <kbd className="color kbd-xs">[]</kbd>as an alias. example:
              <kbd className="color kbd-xs">/* select || [exp]10px || [exp2]20px */</kbd>
            </span>
          </div>
          <p className="text-gray-8">Optional suffix</p>
          <div className="grid grid-cols-[70px_1fr] font-normal">
            <kbd className="color kbd-xs">+ unit</kbd>
            <span className="font-normal">
              : insert <kbd className="color kbd-xs">+</kbd> after placeholder as unit suffix for
              the value. example:<kbd className="color kbd-xs">/* number + px */</kbd>
            </span>
            <kbd className="color kbd-xs"># desc</kbd>
            <span className="font-normal">
              : insert <kbd className="color kbd-xs">#</kbd> after placeholder to add description
              example:<kbd className="color kbd-xs">/* color # Change the color of ... */</kbd>
            </span>
          </div>
          <p className="mt-3 text-warning text-opacity-50">
            *Placeholders only works inside of <kbd className="color kbd-xs">:root</kbd> selector!
          </p>
        </div>
      </Modal>

      <div className="mt-5 rounded-lg overflow-hidden relative">
        {formatFallback ? (
          <div className="absolute pointer-events-none -bottom-5 left-0 w-full z-20 animate-fade animate-reverse animate-delay-300 animate-duration-200">
            <div className="w-full px-20 py-5 animate-fade-up animate-duration-150 animate-ease-out">
              <div className="alert alert-success max-w-sm mx-auto scale-75 shadow-xl">
                <IconCircleCheckFilled size={48} />
                <div className="flex flex-col">
                  <span>Saved</span>
                  <span className="text-content2">Your CSS are saved!</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {copyFallback ? (
          <div className="absolute pointer-events-none -bottom-5 left-0 w-full z-20 animate-fade animate-reverse animate-delay-300 animate-duration-200">
            <div className="w-full px-20 py-5 animate-fade-up animate-duration-150 animate-ease-out">
              <div className="alert alert-info max-w-sm mx-auto scale-75 shadow-xl">
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
          value={CSS}
          height="525px"
          theme={atomone}
          extensions={[langs.css(), color]}
          basicSetup={{ lintKeymap: true }}
          onChange={autoSaver}
        />
        <span
          className="tooltip tooltip-left absolute z-50 bottom-5 right-5 hover:before:right-3 [--tooltip-bg:transparent] [--tooltip-border:transparent]"
          data-tooltip="Guide">
          <button
            onClick={() => setGuideOpen(true)}
            className="btn btn-sm p-2 bg-opacity-50 backdrop-blur">
            <IconBook size={16} />
          </button>
        </span>
      </div>

      <div className="flex justify-between items-center mt-3 mb-5">
        <div className="gap-2 flex items-center">
          <input
            type="checkbox"
            className="switch switch-primary"
            onChange={setAutoSave}
            checked={autoSave}
          />
          <p>Autosave</p>
          {savingFallback ? <div className="spinner-simple [--spinner-size:15px]"></div> : null}
        </div>
        <div className="gap-2 flex">
          {checkReset() ? (
            <button onClick={reset} className="btn flex gap-1">
              <IconReload size={16} />
              Reset
            </button>
          ) : null}
          <button onClick={save} className="btn flex gap-1">
            <IconDeviceFloppy size={16} />
            Format & Save
          </button>
          <button onClick={copy} className="btn btn-primary flex gap-1">
            <IconCopy size={16} />
            Copy
          </button>
        </div>
      </div>
    </>
  );
}

export default CodeEditor;
