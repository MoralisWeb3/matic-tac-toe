import ERC20 from "./ERC20.json";
import Moralis from "moralis";

export async function initERC20(address: string) {
  const web3 = await Moralis.Web3.enable();
  return new web3.eth.Contract(ERC20.abi, address);
}