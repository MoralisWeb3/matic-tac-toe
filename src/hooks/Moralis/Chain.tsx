import Moralis from "moralis";
import React, { createContext, useContext } from "react";

const ethereum = (window as any).ethereum
const initial = ethereum?.chainId ?? "";

export const ChainContext = createContext([initial, () => {}]);
export const useChainContext = () => useContext(ChainContext);
export const ChainProvider = ({ children }) => {
  const value = React.useState(ethereum?.chainId ?? "");
  React.useEffect(() => {
    const [chain, setChain] = value
    setTimeout(() => {
      if (chain !== ethereum?.chainId) {
        setChain(ethereum?.chainId);
      }
    }, 100);
    return Moralis.Web3.onChainChanged((v) => {
      setChain(v);
    });
  }, []);
  return (
    <ChainContext.Provider value={value}>{children}</ChainContext.Provider>
  );
};
