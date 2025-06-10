import { createContext, useContext } from "react";

export interface CollapsibleContextType {
  isOpen: boolean;
  toggle: () => void;
}

export const CollapsibleContext = createContext<
  CollapsibleContextType | undefined
>(undefined);

export const useCollapsible = () => {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error("Collapsible components must be used within a Collapsible");
  }
  return context;
};
