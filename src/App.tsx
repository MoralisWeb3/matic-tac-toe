import React from "react";
import { Route, Switch } from "react-router-dom";
import { useSetDocTitleEffect } from "./components/Header";
import { useUserContext } from "./hooks/Moralis/User";
import { L2Lobby } from "./routes/Lobby";
import { TicTacToe } from "./routes/TicTacToe";

export const App = () => {
  const [userData] = useUserContext();
  useSetDocTitleEffect();

  if (!userData) {
    return (
      <div className="bg-light py-5">
        <h4 className="text-center">
          Please sign up or login to play tic tac toe.
        </h4>
      </div>
    );
  }

  return (
    <>
      <Switch>
        <Route path="/" exact>
          <L2Lobby chainId="0x13881" />
          <L2Lobby chainId="0x507" />
          <L2Lobby chainId="0x45" />
        </Route>
        <Route path="/tic-tac-toe" exact component={TicTacToe} />
        <Route
          path="/tic-tac-toe/:chainId/:gameId"
          exact
          component={TicTacToe}
        />
      </Switch>
    </>
  );
};

export default App;
