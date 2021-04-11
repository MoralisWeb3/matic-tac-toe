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

type IAllowances = {
  [chainId: string]: { [token: string]: { [address: string]: string } };
};

export const {
  Provider: AllowancesProvider,
  useContext: useAllowances,
} = makeContext<IAsync<IAllowances>>("Allowances", initialAsync);

export const useFetchAllowance = () => {
  const contract = useTicTacToeContract();
  const callback = useCallback(
    (
      setAllowances: Dispatch<SetStateAction<IAsync<IAllowances>>>,
      chainId: string,
      token: string,
      address: string
    ) => {
      if (token && address) {
        setAllowances((v) => ({ loading: true, data: v.data, error: null }));
        contract
          .allowance(token, address)
          .then((data) =>
            setAllowances((v) => ({
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
            setAllowances((v) => ({ loading: false, data: v.data, error }));
          });
      }
    },
    []
  );
  return callback;
};

export const useRefetchAllowance = () => {
  const setAllowances = useAllowances()[1];
  const fetchAllowance = useFetchAllowance();
  const [chainId] = useChainContext();
  return useCallback(
    (token, address) => {
      return fetchAllowance(setAllowances, chainId, token, address);
    },
    [chainId]
  );
};

export const useAllowance = (token: string, address: string) => {
  const [{ data, loading, error }, setAllowances] = useAllowances();
  const fetchAllowance = useFetchAllowance();
  const [chainId] = useChainContext();

  useEffect(() => {
    fetchAllowance(setAllowances, chainId, token, address);
  }, [chainId, token, address]);

  return {
    loading,
    error,
    data: data?.[chainId]?.[token]?.[address],
  };
};
