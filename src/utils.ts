import Moralis from "moralis";

const web3 = new Moralis.Web3();

(window as any).web3 = web3;

export function formatAddress(address = "") {
  return address.slice(0, 6).concat("...", address.slice(-6));
}
export function formatBalance(balance = "", decimals = 18) {
  return Number(balance) / 10 ** decimals;
}
export function toWei(balance = "", decimals = 18) {
  return `0x${(Number(balance) * 10 ** decimals).toString(16)}`
}
export function zeroAddress() {
  return "0x0000000000000000000000000000000000000000";
}
export function getCurrentAddress() {
  return ((window as any).ethereum?.selectedAddress ?? "").toLowerCase();
}