import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { useChainContext } from "../hooks/Moralis";
import { useTicTacToeContract } from "../hooks/Contract/TicTacToe";
import { initialAsync, IAsync } from "./async";
import { makeContext } from "./make";

type ITokenBalances = {
  [chainId: string]: { [token: string]: { [address: string]: string }}
};

export const {
  Provider: TokenBalancesProvider,
  useContext: useTokenBalances,
} = makeContext<IAsync<ITokenBalances>>("TokenBalances", initialAsync);

export const useFetchTokenBalance = () => {
  const contract = useTicTacToeContract();
  const callback = useCallback(
    (setTokenBalances: Dispatch<SetStateAction<IAsync<ITokenBalances>>>, chainId: string, token: string, address: string) => {
        if (token && address) {
            setTokenBalances((v) => ({ loading: true, data: v.data, error: null }));
            contract
              .balanceOf(token, address)
              .then((data) =>
                setTokenBalances((v) => ({
                  loading: false,
                  data: {
                    ...v.data,
                    [chainId]: {
                      ...v.data?.[chainId],
                      [token]: {
                        ...v.data?.[chainId]?.[token],
                        [address]: data,
                      },
                    },
                  },
                  error: null,
                }))
              )
              .catch((error) => {
                console.error(error);
                setTokenBalances((v) => ({ loading: false, data: v.data, error }));
              });
          }
    },
    []
  );
  return callback;
};

export const useRefetchBalance = () => {
  const setBalances = useTokenBalances()[1];
  const fetchTokenBalance = useFetchTokenBalance();
  const [chainId] = useChainContext();
  return useCallback((token, address) => {
    return fetchTokenBalance(setBalances, chainId, token, address);
  }, [chainId]);
};

export const useTokenBalance = (token: string, address: string) => {
  const [{ data, loading, error }, setTokenBalances] = useTokenBalances();
  const fetchTokenBalance = useFetchTokenBalance();
  const [chainId] = useChainContext()

  useEffect(() => {
    fetchTokenBalance(setTokenBalances, chainId, token, address);
  }, [chainId, token, address]);

  return {
    loading,
    error,
    data: data?.[chainId]?.[token]?.[address],
  };
};
