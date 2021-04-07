import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react";
import { useTicTacToeContract } from "../hooks/Contract/TicTacToe";
import { initialAsync, IAsync } from "./async";

type IGame = {
  gameId: string;
  token?: string;
  player0?: string;
  balance0?: string;
  player1?: string;
  balance1?: string;
  turn?: number;
  row1?: string;
  row2?: string;
  row3?: string;
};

export const useLoadGame = (gameId) => {
  const value = useState<IAsync<IGame>>(initialAsync);
  const fetchGame = useFetchGame();

  useEffect(() => {
    fetchGame(value[1], gameId)
  }, [gameId]);

  return value;
};

export const useFetchGame = () => {
  const contract = useTicTacToeContract();
  const callback = useCallback((setGame: Dispatch<SetStateAction<IAsync<IGame>>>, gameId: string) => {
    if (gameId) {
      setGame(v => ({ ...v, loading: true }));
      contract
        .game(gameId)
        .then((data) => {
          setGame({ loading: false, data: { gameId, ...data }, error: null });
        })
        .catch((error) => {
          console.error(error);
          setGame({ loading: false, data: null, error });
        });
    }
  }, [])
  return callback
}

export const useRefetchGame = () => {
  const [game, setGame] = useGame()
  const fetchGame = useFetchGame();
  const gameId = game?.data?.gameId
  return useCallback(() => {
    if (gameId) {
      fetchGame(setGame, gameId)
    } else {
      console.warn('No gameId to refetch')
    }
  }, [gameId])
}

export const GameContext = createContext<
  [IAsync<IGame>, Dispatch<SetStateAction<IAsync<IGame>>>]
>([initialAsync, () => {}]);
export const useGame = () => useContext(GameContext);
export const GameProvider = ({ value, children }) => {
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
