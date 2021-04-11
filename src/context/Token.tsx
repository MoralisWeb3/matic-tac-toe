import { useMemo } from "react";
import { IAsync, initialAsync } from "./async";
import { makeContext } from "./make";

const initialToken = "";

const initialTokenList: IToken[] = [
  {
    symbol: "MERC",
    address: "0x3429e89F3bE1e840aE719c9dF59e586E52003eF8",
    name: "MERC",
    decimals: 12,
    chainId: "0x13881",
  },
  {
    symbol: "RAIN",
    address: "0x5aEc90591F32F1098c8eCe7f21C718C3732019b5",
    name: "RAIN",
    decimals: 8,
    chainId: "0x13881",
  },
  {
    symbol: "MOR",
    address: "0xa1Fc806fc659029A88D76Cd3BCD7B30BA779CBA9",
    name: "MORALIS (Optimism)",
    decimals: 18,
    chainId: "0x45",
  },
  {
    symbol: "MOR",
    address: "0x2A05684dfC7Ee4e1709d682945eBE74aaF505242",
    name: "MORALIS (Moonbase)",
    decimals: 18,
    chainId: "0x507",
  },
  // {
  //   symbol: "XYZ",
  //   address: "0x5d34329065383d4817300cC5da29CB03f7Cb163e",
  //   name: "XYZ (Dusty Plasm)",
  //   decimals: 18,
  //   chainId: "0x50",
  // },
];

type IToken = {
  address: string;
  name: string;
  symbol: string;
  chainId: string;
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
