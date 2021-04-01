import { makeContext } from "./make";

const initialAmount = "10000000000000000";
export const {
  Provider: BetAmountProvider,
  useContext: useBetAmount,
} = makeContext("BetAmount", initialAmount);
