import { useMemo } from "react";
import { IAsync, initialAsync } from "./async";
import { makeContext } from "./make";

const initialToken = "";

const initialTokenList: IToken[] = [
  {
    symbol: "MERC",
    address: "0x3429e89F3bE1e840aE719c9dF59e586E52003eF8",
    name: "MERC",
    decimals: 12
  },
  {
    symbol: "RAIN",
    address: "0x5aEc90591F32F1098c8eCe7f21C718C3732019b5",
    name: "RAIN",
    decimals: 8
  },
];

type IToken = {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
};

export const {
  Provider: SelectedTokenProvider,
  useContext: useSelectedToken,
} = makeContext("SelectedToken", initialToken);

export const {
  Provider: TokenListProvider,
  useContext: useTokenList,
} = makeContext<IAsync<IToken[]>>("TokenList", {
  ...initialAsync,
  data: initialTokenList,
});

export function useTokenFromList(address) {
  const [{ data }] = useTokenList();
  const tokensByAddress = useMemo(
    () =>
      data?.reduce((acc, token) => {
        acc[token.address?.toLowerCase()] = token;
        return acc;
      }, {}) ?? {},
    [data]
  );
  return tokensByAddress[address?.toLowerCase()];
}
