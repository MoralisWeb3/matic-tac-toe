import Moralis from "moralis";
import React, { createContext, useContext } from "react";
import {
  AVALANCHE_TESTNET,
  MUMBAI_NETWORK,
  OPTIMISM_TEST,
  MOONBASE,
  DUSTY
} from "./chainParams";

const ethereum = (window as any).ethereum;
const initial = ethereum?.chainId ?? "";

export const ChainContext = createContext([initial, () => {}]);
export const useChainContext = () => useContext(ChainContext);
export const ChainProvider = ({ children }) => {
  const value = React.useState(ethereum?.chainId ?? "");
  React.useEffect(() => {
    const setChain = value[1];
    ethereum?.request({ method: "eth_chainId" }).then((v) => setChain(v));

    return Moralis.Web3.onChainChanged((v) => {
      setChain(v);
    });
  }, []);
  return (
    <ChainContext.Provider value={value}>{children}</ChainContext.Provider>
  );
};

export async function addEthereumChain(chainId) {
  const web3 = await Moralis.Web3.enable()
  return web3.currentProvider.request({
    method: "wallet_addEthereumChain",
    params: [addEthereumChainParams(chainId)],
  });
}

function addEthereumChainParams(chainId) {
  switch (chainId) {
    case AVALANCHE_TESTNET.chainId:
      return AVALANCHE_TESTNET;
    case MUMBAI_NETWORK.chainId:
      return MUMBAI_NETWORK;
    case OPTIMISM_TEST.chainId:
      return OPTIMISM_TEST;
    case MOONBASE.chainId:
      return MOONBASE;
    case DUSTY.chainId:
      return DUSTY;
    default:
      return {};
  }
}

export function chainIdToName(chainId) {
  switch (chainId) {
    case AVALANCHE_TESTNET.chainId:
      return AVALANCHE_TESTNET.chainName;
    case DUSTY.chainId:
      return DUSTY.chainName;
    case MUMBAI_NETWORK.chainId:
      return "Matic Mumbai";
    case OPTIMISM_TEST.chainId:
      return "Optimism Test";
    case MOONBASE.chainId:
      return "Moonbase";
    default:
      return "";
  }
}

export function chainIdToTableName (chainId) {
  switch (chainId) {
    case MUMBAI_NETWORK.chainId:
      return 'StartTicTacToe'
    case OPTIMISM_TEST.chainId:
      return "StartTicTacToeOptimism";
    case MOONBASE.chainId:
      return "StartTicTacToeMoonbase";
    default:
      return ""
  }
}