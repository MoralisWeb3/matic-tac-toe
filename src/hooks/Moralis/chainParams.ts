export const AVALANCHE_TESTNET = {
  chainId: "0xa869", // A 0x-prefixed hexadecimal chainId
  chainName: "Avalanche Testnet C-Chain",
  nativeCurrency: {
    name: "Avalanche",
    symbol: "AVAX",
    decimals: 18,
  },
  rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
  blockExplorerUrls: ["https://cchain.explorer.avax-test.network/"],
};

export const MUMBAI_NETWORK = {
  chainId: "0x13881",
  chainName: "Mumbai",
  nativeCurrency: {
    name: "Matic",
    symbol: "Matic",
    decimals: 18,
  },
  rpcUrls: ["https://rpc-mumbai.matic.today"],
  blockExplorerUrls: ["https://explorer-mumbai.maticvigil.com/"],
};

export const OPTIMISM_TEST = {
  chainId: "0x45",
  chainName: "Optimism Test",
  nativeCurrency: {
    name: "Keth",
    symbol: "Keth",
    decimals: 18,
  },
  rpcUrls: ["https://kovan.optimism.io/"],
  //   blockExplorerUrls: [],
};

export const MOONBASE = {
  chainId: "0x507",
  chainName: "Moonbase Alpha",
  nativeCurrency: {
    name: "Dev",
    symbol: "DEV",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.testnet.moonbeam.network"],
  //   blockExplorerUrls: [],
};

export const DUSTY = {
  chainId: "0x50",
  chainName: "Dusty",
  nativeCurrency: {
    name: "PLD",
    symbol: "PLD",
    decimals: 15,
  },
  rpcUrls: ["https://rpc.dusty.plasmnet.io:8545"],
};
