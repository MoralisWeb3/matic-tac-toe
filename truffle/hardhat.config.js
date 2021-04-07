require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("hardhat-deploy");
require("@eth-optimism/plugins/hardhat/compiler");

const mnemonic = "test test test test test test test test test test test junk";

module.exports = {
  networks: {
    hardhat: {
      accounts: {
        mnemonic,
      },
    },
    optimism: {
      url: "https://kovan.optimism.io",
      accounts: [mnemonic],
    },
  },
  solidity: "0.7.6",
  ovm: {
    solcVersion: "0.7.6",
  },
  namedAccounts: {
    deployer: 0,
  },
};
