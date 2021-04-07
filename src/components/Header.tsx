import React, { FC, useEffect } from "react";
import { useChainContext } from "../hooks/Moralis";

export const Header: FC<{ className?: string }> = ({ children, className }) => {
  return (
    <div className={`bg-light py-5 mb-4 ${className ?? ""}`}>
      <div className="container">{children}</div>
    </div>
  );
};

export const useSetDocTitleEffect = () => {
  const [chainId] = useChainContext();

  useEffect(() => {
    document.title = chainIdToTitle(chainId);
  }, [chainId]);
};

export const MainTitle = ({ chainId }) => {
  return <h4 className="text-center">{chainIdToTitle(chainId)}</h4>;
};

function chainIdToTitle(chainId) {
  switch (chainId) {
    case "0x13881":
      return "MaTic Tac Toe";
    case "0x45":
      return "OptimisTic Tac Toe";
    case "0x507":
      return "MoonTic Tac Toe";
    default:
      return "Tic Tac Toe";
  }
}
