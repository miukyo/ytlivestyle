import localforage from "localforage";
import { createContext, useEffect, useState } from "react";

type PresetState = {
  presets: { id: string; name: string; css: string }[];
  addPreset: (name: string, css: string) => void;
  updatePreset: (css: string) => void;
  selectedPreset: number;
  checkReset: () => boolean;
  setSelectedPreset: React.Dispatch<React.SetStateAction<number>>;
};

export const PresetContext = createContext<PresetState>({
  presets: [],
  addPreset: () => {},
  updatePreset: () => {},
  selectedPreset: 0,
  setSelectedPreset: () => {},
  checkReset: () => false,
});


// eslint-disable-next-line react-refresh/only-export-components
export const defaultPresets: PresetState["presets"] = [
  {
    id: "00000000-0000-0000-0000-000000000000",
    name: "Simple Compact",
    css: (await import("@/css/presets/simpleCompact.css?raw")).default,
  },
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Simple",
    css: (await import("@/css/presets/simple.css?raw")).default,
  },
];

export const PresetContextProvider = ({ children }: { children?: React.ReactNode }) => {
  const [presets, setPresets] = useState<PresetState["presets"]>([]);
  const [selectedPreset, setSelectedPreset] = useState<number>(0);
  const addPreset: PresetState["addPreset"] = (name, css) => {
    const id = crypto.randomUUID();
    setPresets([...presets, { id, name, css }]);
  };

  const updatePreset: PresetState["updatePreset"] = (css) => {
    const data = [...presets];
    const index = data.findIndex((i) => i.id === presets[selectedPreset].id);
    if (index !== -1) {
      data[index] = { ...data[index], css };
      setPresets(data);
    }
  };

  useEffect(() => {
    localforage.setItem("Presets", presets);
  }, [presets]);

  useEffect(() => {
    localforage.setItem("SelectedPreset", selectedPreset);
  }, [selectedPreset]);

  useEffect(() => {
    localforage.getItem("Presets").then((value) => {
      if (typeof value === "object" && (value as [])?.length > 0) {
        setPresets(value as PresetState["presets"]);
      } else {
        setPresets(defaultPresets);
      }
    });

    localforage.getItem("SelectedPreset").then((value) => {
      if (typeof value === "number") {
        setSelectedPreset(value);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localforage.setItem("CSS", presets[selectedPreset]?.css);
  }, [presets, selectedPreset]);
  const checkReset = () => {
    const idDefault = defaultPresets.map((i) => i.id);
    if (idDefault.includes(presets[selectedPreset]?.id)) {
      return true;
    }
    return false;
  };
  return (
    <PresetContext.Provider
      value={{ presets, addPreset, selectedPreset, setSelectedPreset, updatePreset, checkReset }}>
      {children}
    </PresetContext.Provider>
  );
};
