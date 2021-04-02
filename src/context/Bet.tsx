import { makeContext } from "./make";

const initialAmount = "";
export const {
  Provider: BetAmountProvider,
  useContext: useBetAmount,
} = makeContext("BetAmount", initialAmount);
