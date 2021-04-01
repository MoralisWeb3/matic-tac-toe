import React from "react";
import { Header, MainTitle } from "../components/Header";
import { GameListCard } from "../components/GameItem";
import { useMoralisQuery } from "../hooks/Moralis/Query";

export const Lobby = () => {
  const { data: starts } = useMoralisQuery("StartTicTacToe", {
    live: true,
    filter: (query) => {
      query.descending("block_number");
    },
  });
  const { data: joins } = useMoralisQuery("JoinTicTacToe", {
    live: true,
    filter: (query) => {
      query.descending("block_number");
    },
  });
  return (
    <>
      <Header className="text-center">
        <MainTitle />
      </Header>
      <div className="container pb-4">
        <div className="row">
          {(starts || []).map((game) => (
            <div
              className="col-xs-12 col-md-4 mb-3"
              key={game.get("gameId")}
            >
              <GameListCard gameId={game.get("gameId")} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
