import TicTacToe from "./TicTacToe.json";
import ERC20 from "../ERC20/ERC20.json";
import Moralis from "moralis";
import { getCurrentAddress } from "../../../utils";

export const ticTacToeAddress = TicTacToe.networks['80001'].address
async function initTicTacToe(address = ticTacToeAddress) {
  const web3 = await Moralis.Web3.enable();
  return new web3.eth.Contract(TicTacToe.abi, address);
}

async function initERC20(address: string) {
  const web3 = await Moralis.Web3.enable();
  return new web3.eth.Contract(ERC20.abi, address);
}

export function useTicTacToeContract() {
  return {
    address: ticTacToeAddress,
    approve: async (token: string, address: string, amount: string) => {
      const contract = await initERC20(token);
      const from = getCurrentAddress();
      return contract.methods.approve(address, amount).send({ from });
    },
    allowance: async (token: string, address: string) => {
      const contract = await initERC20(token);
      const from = getCurrentAddress();
      return contract.methods.allowance(from, address).call({ from });
    },
    game: async (gameId: string) => {
        const contract = await initTicTacToe();
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
      const contract = await initTicTacToe();
      const from = getCurrentAddress();
      return contract.methods.start(token, amount).send({ from });
    },
    join: async (gameId: string, amount: string) => {
      const contract = await initTicTacToe();
      const from = getCurrentAddress();
      return contract.methods.join(gameId, amount).send({ from });
    },
    play: async (gameId: string, row: number, col: number) => {
      const contract = await initTicTacToe();
      const from = getCurrentAddress();
      return contract.methods.play(gameId, String(row), String(col)).send({ from });
    },
  };
}
