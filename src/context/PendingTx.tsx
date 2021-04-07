import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { useTicTacToeContract } from "../hooks/Contract/TicTacToe";
import { initialAsync, IAsync } from "./async";
import { makeContext } from "./make";
import Moralis from "moralis";

const PENDING_TXS_KEY = "pending_txs";
type IPendingTxs = {
  [hash: string]: any;
};

export const {
  Provider: PendingTxsProvider,
  useContext: usePendingTxs,
} = makeContext<IAsync<IPendingTxs>>("PendingTxs", {
  ...initialAsync,
  data: getPendingTransactions(),
});

export const useFetchPendingTx = () => {
  const callback = useCallback(
    (
      setPendingTxs: Dispatch<SetStateAction<IAsync<IPendingTxs>>>,
      hash: string
    ) => {
      if (hash) {
        setPendingTxs((v) => ({ loading: true, data: v.data, error: null }));
        Moralis.Web3.enable()
          .then((web3) => web3.eth.getTransaction(hash))
          .then((data) =>
            setPendingTxs((v) => ({
              loading: false,
              data: {
                ...v.data,
                [hash]: data,
              },
              error: null,
            }))
          )
          .catch((error) => {
            console.error(error);
            setPendingTxs((v) => ({ loading: false, data: v.data, error }));
          });
      }
    },
    []
  );
  return callback;
};

export const useRefetchPendingTx = () => {
  const setPendingTxs = usePendingTxs()[1];
  const fetchPendingTx = useFetchPendingTx();
  return useCallback((hash) => {
    return fetchPendingTx(setPendingTxs, hash);
  }, []);
};

export const usePendingTx = (hash: string) => {
  const [{ data, loading, error }, setPendingTxs] = usePendingTxs();
  const fetchPendingTx = useFetchPendingTx();

  useEffect(() => {
    fetchPendingTx(setPendingTxs, hash);
  }, [hash]);

  return {
    loading,
    error,
    data: data?.[hash],
  };
};

export function useStorePendingTx () {
  return useCallback((tx) => {
    console.log(tx)
    tx
    .on('transactionHash', (ev) => {
      // savePendingTransactions({ })
      console.log('transactionHash', tx, ev)
    })
    .on('receipt', (ev) => {
      console.log('receipt', tx, ev)
    })
    .on('complete', (ev) => {
      console.log('complete', tx, ev)
    })
    .on('error', (ev) => {
      console.log('error', tx, ev)
    })
  }, []);
}

export function savePendingTransactions (txs: IPendingTxs) {
  localStorage.setItem(PENDING_TXS_KEY, JSON.stringify(txs));
};

export function getPendingTransactions () {
  const txs = localStorage.getItem(PENDING_TXS_KEY);
  if (!txs) return null;
  return JSON.parse(txs);
};

export function clearPendingTransactions () {
  localStorage.removeItem(PENDING_TXS_KEY);
};
