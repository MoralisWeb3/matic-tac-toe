import React, {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
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

export const RealtimeGameContext = createContext<IAsync<IGame>>(initialAsync);
export const useRealtimeGame = () => useContext(RealtimeGameContext);
export const RealtimeGameProvider = ({ value, children }) => {
  return (
    <RealtimeGameContext.Provider value={value}>
      {children}
    </RealtimeGameContext.Provider>
  );
};
