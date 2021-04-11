import TicTacToe from "./TicTacToe.json";
import ERC20 from "../ERC20/ERC20.json";
import Moralis from "moralis";
import { getCurrentAddress } from "../../../utils";
import { useChainContext } from "../../Moralis";
import { useStorePendingTx } from "../../../context/PendingTx";
import { useMemo } from "react";

export const ticTacToeAddresses = {
  '0x13881': TicTacToe.networks['80001'].address,
  '0x45': '0x9B959c65cA793Ad7772D3915617D2b0A430D0c3B', //TicTacToe.networks['80001'].address
  '0x507': '0x916D0749aE454118628d138750945A321344b8c7',
  '0x50': '0xDc968bA1f27D73753a847F186bf96fe391458a31',
}
async function initTicTacToe(address) {
  const web3 = await Moralis.Web3.enable();
  return new web3.eth.Contract(TicTacToe.abi, address);
}

async function initERC20(address: string) {
  const web3 = await Moralis.Web3.enable();
  return new web3.eth.Contract(ERC20.abi, address);
}

export function useTicTacToeContract() {
  const [chainId] = useChainContext()
  const storePendingTx = useStorePendingTx()
  const address = ticTacToeAddresses[chainId]

  return useMemo(() => ({
    address,
    approve: async (token: string, address: string, amount: string) => {
      const contract = await initERC20(token);
      const from = getCurrentAddress();
      return contract.methods.approve(address, amount).send({ from });
    },
    balanceOf: async (token: string, address: string) => {
      const contract = await initERC20(token);
      const from = getCurrentAddress();
      return contract.methods.balanceOf(address).call({ from });
    },
    allowance: async (token: string, address: string) => {
      const contract = await initERC20(token);
      const from = getCurrentAddress();
      return contract.methods.allowance(from, address).call({ from });
    },
    game: async (gameId: string) => {
        const chain = await (window as any)?.ethereum?.request({ method: 'eth_chainId' })
        const contract = await initTicTacToe(ticTacToeAddresses[chain]);
        const from = getCurrentAddress();
        return contract.methods.get_game_status(gameId).call({ from })
        .then((v) => ({
          player0: v[0],
          balance0: v[1],
          player1: v[2],
          balance1: v[3],
          token: v[4],
          turn: Number(v[5]),
          row1: v[6],
          row2: v[7],
          row3: v[8],
        }))
    },
    start: async (token: string, amount: string) => {
      const contract = await initTicTacToe(address);
      const from = getCurrentAddress();
      return contract.methods.start(token, amount).send({ from });
    },
    join: async (gameId: string, amount: string) => {
      const contract = await initTicTacToe(address);
      const from = getCurrentAddress();
      return contract.methods.join(gameId, amount).send({ from });
    },
    play: async (gameId: string, row: number, col: number) => {
      const contract = await initTicTacToe(address);
      const from = getCurrentAddress();
      const tx = contract.methods.play(gameId, String(row), String(col)).send({ from });
      storePendingTx(tx);
      return tx;
    },
  }), [chainId]);
}
