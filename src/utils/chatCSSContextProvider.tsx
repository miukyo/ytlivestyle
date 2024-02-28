import localforage from "localforage";
import React, { createContext, useContext, useEffect, useState } from "react";
import js_beautify from "js-beautify";
import { PresetContext, defaultPresets } from "./presetContextProvider";

type ChatCSSState = {
  CSS: string;
  setCSS: React.Dispatch<React.SetStateAction<string>>;
  save: () => void;
  reset: () => void;
  copy: () => void;
  autoSaver: (e: string) => void;
  savingFallback: boolean;
  formatFallback: boolean;
  copyFallback: boolean;
  setAutoSave: () => void;
  autoSave: boolean;
};

export const ChatCSSContext = createContext<ChatCSSState>({
  CSS: "",
  setCSS: () => "",
  save: () => {},
  autoSaver: () => {},
  reset: () => {},
  copy: () => {},
  savingFallback: false,
  formatFallback: false,
  copyFallback: false,
  setAutoSave: () => {},
  autoSave: false,
});

export const ChatCSSProvider = ({ children }: { children?: React.ReactNode }) => {
  const { selectedPreset, presets, updatePreset } = useContext(PresetContext);
  const [CSS, setCSS] = useState<string>("");

  const [autoSave, setAutoSave] = useState<boolean>(true);
  const [savingLoading, setSavingLoading] = useState<boolean>(false);
  const [formatSavingLoading, setFormatSavingLoading] = useState<boolean>(false);
  const [copyLoading, setCopyLoading] = useState<boolean>(false);

  useEffect(() => {
    localforage.getItem("autoSave").then((value) => {
      if (typeof value === "boolean") {
        setAutoSave(value);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCSS(presets[selectedPreset]?.css);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPreset]);

  useEffect(() => {
    localforage.getItem("CSS").then((e) => {
      if (typeof e === "string") {
        setCSS(e);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = (e: string) => {
    setSavingLoading(true);
    const delayDebounceFn = setTimeout(() => {
      setSavingLoading(false);
      updatePreset(e);
    }, 500);
    return () => {
      clearTimeout(delayDebounceFn);
    };
  };


  const saveButton = () => {
    setFormatSavingLoading(true);
    const formatted = js_beautify.css(CSS, { indent_size: 2 });
    setCSS(formatted);
    updatePreset(formatted);
    setTimeout(() => {
      setFormatSavingLoading(false);
    }, 500);
  };

  const autoSaver = async (e: string) => {
    if (autoSave) {
      setCSS(e);
      save(e);
    } else {
      setCSS(e);
    }
  };


  const reset = () => {
    setCSS(defaultPresets[selectedPreset].css);
  };

  const setAutoSaveLocal = async () => {
    await localforage.setItem("autoSave", !autoSave);
    setAutoSave(!autoSave);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(CSS).then(() => {
      setCopyLoading(true);
      setTimeout(() => {
        setCopyLoading(false);
      }, 500);
    });
  };

  return (
    <ChatCSSContext.Provider
      value={{
        CSS,
        setCSS,
        save: saveButton,
        autoSaver,
        reset,
        savingFallback: savingLoading,
        copy: copyToClipboard,
        setAutoSave: setAutoSaveLocal,
        autoSave,
        copyFallback: copyLoading,
        formatFallback: formatSavingLoading,
      }}>
      <>{children}</>
    </ChatCSSContext.Provider>
  );
};
