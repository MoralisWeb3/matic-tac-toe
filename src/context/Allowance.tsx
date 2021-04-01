import React, { useEffect, useState, createContext, useContext } from "react";
import { useTicTacToeContract } from "../hooks/Contract/TicTacToe";
import { initialAsync, IAsync } from "./async";
import { makeContext } from "./make";

type IAllowances = {
  [token: string]: { [address: string]: string };
};

export const {
  Provider: AllowancesProvider,
  useContext: useAllowances,
} = makeContext<IAsync<IAllowances>>("Allowances", initialAsync);

export const useAllowance = (token: string, address: string) => {
  const contract = useTicTacToeContract();
  const [{ data, loading, error }, setAllowances] = useAllowances();

  useEffect(() => {
    if (token && address) {
      setAllowances((v) => ({ loading: true, data: v.data, error: null }));
      contract
        .allowance(token, address)
        .then((data) =>
          setAllowances((v) => ({
            loading: false,
            data: {
              ...v.data,
              [token]: {
                ...v.data?.[token],
                [address]: data
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
  }, [token, address]);

  return {
    loading,
    error,
    data: data?.[token]?.[address],
  };
};
