import { createContext } from "react";

type ChatStylesState = {
  styles: string;
  setStyles: React.Dispatch<React.SetStateAction<string>>;
};

export const ChatStyleContext = createContext<ChatStylesState>({ styles: "", setStyles: () => "" });
