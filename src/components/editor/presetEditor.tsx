import { useContext, useEffect, useState } from "react";
import { ChatCSSContext } from "@/utils/chatCSSContextProvider";
import { Listbox } from "@headlessui/react";
import {
  IconChevronDown,
  IconCircleCheckFilled,
  IconCopy,
  IconDeviceFloppy,
  IconReload,
} from "@tabler/icons-react";
import { IconInfoCircleFilled } from "@tabler/icons-react";
import { IconPlus } from "@tabler/icons-react";
import { PresetContext } from "@/utils/presetContextProvider";
import Modal from "../ui/Modal";
import PresetAddForm from "../ui/PresetAddForm";

interface RootVariables {
  [property: string]: {
    value: string;
    type: string;
    unit?: string;
    description?: string;
    options?: { name?: string; value: string }[];
  };
}

function PresetEditor() {
  const {
    CSS,
    autoSaver,
    reset,
    save,
    copy,
    savingFallback,
    formatFallback,
    setAutoSave,
    autoSave,
    copyFallback,
  } = useContext(ChatCSSContext);
  const { selectedPreset, setSelectedPreset, presets, checkReset } = useContext(PresetContext);

  // const [selectedPreset, setSelectedPreset] = useState<string>("Simple");
  const [openAddPresetModal, setOpenAddPresetModal] = useState<boolean>(false);
  const [rootVariables, setRootVariables] = useState<RootVariables>({});

  const parseRootVariables = (CSS: string): RootVariables => {
    const variables: RootVariables = {};
    const regex = /:root\s*{\s*([^}]*)\s*}/g;
    const cssVariables = regex.exec(CSS)?.toString();

    if (cssVariables && cssVariables[1]) {
      const pattern =
        /--(?<variableName>[\w-]+):\s*(?<value>[^;]+)\s*;\s*\/\*\s*(?<type>[^+#*]+)?\s*(?:\s*\+\s*(?<unit>[^#*]+)\s*)?\s*(?:\s*#(?<description>[^*]+))?\s*\*\//gs;
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(cssVariables)) !== null) {
        const variableName: string = match.groups?.variableName?.trim() || "";
        let value: string = match.groups?.value.trim() || "";
        const rawType: string = match.groups?.type.trim() || "";
        const type: string = rawType.split("||")[0].trim();
        const unit: string = match.groups?.unit?.trim() || "";
        const description: string = match.groups?.description?.trim() || "";

        let options;
        if (type === "select") {
          options = rawType
            .split("||")
            .slice(1)
            .map((option) => {
              const [name, rawValue] = option.trim().split("]");
              if (name && rawValue) {
                return { name: name ? name.slice(1) : rawValue, value: rawValue };
              } else {
                return { value: option.trim() };
              }
            });
        }

        if (type === "number") {
          const val = value.match(/\d*/);
          value = val?.[0] || value;
        }

        if (type.match(/\b(?:text|number|color|select)\b/)) {
          variables[variableName] = { value, unit, type, description, options };
        }
      }
    }
    return variables;
  };

  const updateVariables = () => {
    const parsedVariables = parseRootVariables(CSS);
    setRootVariables(parsedVariables);
  };

  useEffect(() => {
    updateVariables();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CSS]);

  const handleInputChange = (property: string, value: string) => {
    setRootVariables({ ...rootVariables, [property]: { ...rootVariables[property], value } });
    const updatedCssText = CSS.replace(
      new RegExp(`--${property}:\\s*([^;]+);`),
      `--${property}: ${value + rootVariables[property].unit};`
    );
    autoSaver(updatedCssText);
  };
  return (
    <div className="mt-2 relative">
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
      <p>Choose Preset</p>
      <Modal isOpen={openAddPresetModal} setIsOpen={setOpenAddPresetModal}>
        <h2 className="text-xl">Add Preset</h2>
        <p className="text-sm text-gray-8">
          This will save your CSS style to local storage. Beware that clearing cookies/data will
          remove your existing presets
        </p>
        <PresetAddForm
          setSelectedPreset={setSelectedPreset}
          presetsLength={presets.length}
          setModal={setOpenAddPresetModal}
        />
      </Modal>
      <Listbox
        value={selectedPreset}
        onChange={(e) => {
          setSelectedPreset(e);
        }}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-gray-3 py-3 pl-4 pr-10 text-left focus:outline-none sm:text-sm">
            <span className="block truncate">
              {presets?.filter((e) => e === presets[selectedPreset])[0]?.name}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <IconChevronDown size={20} />
            </span>
          </Listbox.Button>
          <Listbox.Options className="z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-gray-3 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {presets &&
              presets.map((option, index) => (
                <Listbox.Option
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 px-4 ${
                      active ? "bg-gray-5" : "text-content1"
                    }`
                  }
                  key={index}
                  value={index}>
                  <span className="block truncate">{option.name}</span>
                </Listbox.Option>
              ))}
            <Listbox.Option
              className={({ active }) =>
                `relative cursor-pointer select-none py-2 px-4 flex gap-2 items-center ${
                  active ? "bg-gray-5" : "text-content1"
                }`
              }
              onClick={() => setOpenAddPresetModal(true)}
              value={selectedPreset}>
              <IconPlus size={16} />
              <span>Add new preset</span>
            </Listbox.Option>
          </Listbox.Options>
        </div>
      </Listbox>
      <div className="my-2 grid gap-2">
        {Object.entries(rootVariables).map(
          ([property, { value, type, unit, description, options }]) => (
            <div className="flex items-center justify-between relative" key={property}>
              <div className="flex flex-col">
              <p>{property.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</p>
              <span className="block truncate text-xs text-content3 whitespace-break-spaces mr-5">{description}</span></div>
              <div className="flex gap-2">
                {type === "select" ? (
                  <Listbox
                    value={value}
                    onChange={(e) => {
                      handleInputChange(property, e);
                    }}>
                    <div className="relative mt-1">
                      <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-gray-3 py-3 pl-4 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                        <span className="block truncate">
                          {options?.filter((e) => e.value === value)[0]?.name || value}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <IconChevronDown size={20} />
                        </span>
                      </Listbox.Button>
                      <Listbox.Options className="z-50 absolute mt-1 max-h-60 right-0 overflow-auto rounded-xl bg-gray-3 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                        {options &&
                          options.map((option, index) => (
                            <Listbox.Option
                              className={({ active }) =>
                                `relative cursor-pointer select-none py-2 p-4 ${
                                  active ? "bg-gray-5" : "text-content1"
                                }`
                              }
                              key={index}
                              value={option.value}>
                              <span className="block truncate">{option.name || option.value}</span>
                            </Listbox.Option>
                          ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                ) : (
                  <input
                    className={`input input-solid min-w-[5rem] max-w-none w-fit ${
                      !!unit && "pr-8"
                    } ${type === "color" && "p-0 bg-transparent border-0 min-w-[4rem]"}`}
                    type={type}
                    min={0}
                    value={value}
                    onChange={(e) => {
                      handleInputChange(property, e.target.value);
                    }}
                  />
                )}
                {unit ? (
                  <span className="absolute right-2 h-full flex items-center bg-gray-4 p-1">
                    {unit}
                  </span>
                ) : null}
              </div>
            </div>
          )
        )}
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
            Save
          </button>
          <button onClick={copy} className="btn btn-primary flex gap-1">
            <IconCopy size={16} />
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}

export default PresetEditor;
