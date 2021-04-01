import React, {
  createContext,
  FC,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

export function makeContext<V>(name: string, initial: V) {
  const Context = createContext<null | [V, Dispatch<SetStateAction<V>>]>(null);
  const useSafeContext = () => {
    const ctx = useContext(Context);
    if (!ctx) throw new Error(`${name} provider not found in tree`);
    return ctx;
  };
  const Provider: FC = ({ children }) => {
    const value = useState(initial);
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };
  return {
    Context,
    Provider,
    useContext: useSafeContext,
  };
}
