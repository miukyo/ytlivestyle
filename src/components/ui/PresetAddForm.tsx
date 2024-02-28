import { ChatCSSContext } from "@/utils/chatCSSContextProvider";
import { PresetContext } from "@/utils/presetContextProvider";
import React, { useContext, useState } from "react";

const PresetAddForm = ({
  setModal,
  setSelectedPreset,
  presetsLength,
}: {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedPreset: React.Dispatch<React.SetStateAction<number>>;
  presetsLength: number;
}) => {
  const { CSS } = useContext(ChatCSSContext);
  const { addPreset } = useContext(PresetContext);
  const [name, setName] = useState<string>("");
  const handleSubmit = () => {
    if (name.length > 0) {
      addPreset(name, CSS);
      setModal(false);
      setName("");
      setSelectedPreset(presetsLength);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="flex flex-col gap-2">
      <input
        name="presetName"
        type="text"
        placeholder="Preset Name"
        className="input input-solid grow max-w-none"
        onChange={(e) => setName(e.target.value)}
        value={name}
      />
      <button type="submit" className="btn btn-primary">
        Add
      </button>
    </form>
  );
};

export default PresetAddForm;
