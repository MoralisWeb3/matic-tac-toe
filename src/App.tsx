import React from "react";
import { Route, Switch } from "react-router-dom";
import { useUserContext } from "./hooks/Moralis/User";
import { Lobby } from "./routes/Lobby";
import { TicTacToe } from "./routes/TicTacToe";

export const App = () => {
  const [userData] = useUserContext();

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
        <Route path="/" exact component={Lobby} />
        <Route path="/tic-tac-toe" exact component={TicTacToe} />
        <Route path="/tic-tac-toe/:gameId" exact component={TicTacToe} />
      </Switch>
    </>
  );
};

export default App;
