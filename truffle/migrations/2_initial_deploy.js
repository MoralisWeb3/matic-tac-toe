const TicTacToe = artifacts.require("TicTacToe");
const Moralis = artifacts.require("Moralis");

module.exports = function (deployer) {
  // Deploy tic tac toe contract
  deployer.deploy(TicTacToe);

  // Deploy erc20 contract and send ourselves balance
  // deployer.deploy(Moralis);
};
