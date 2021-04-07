import React from "react";
import { Header, MainTitle } from "../components/Header";
import { GameListCard } from "../components/GameItem";
import { useMoralisQuery } from "../hooks/Moralis/Query";

const maxCards = 6

export const L2Lobby = ({ chainId, tableName }) => {
  const { data: starts, loading } = useMoralisQuery(tableName, {
    live: true,
    filter: (query) => {
      query.descending("block_number");
      query.limit(maxCards);
    },
  });

  return (
    <>
      <Header className="text-center">
        <MainTitle chainId={chainId} />
      </Header>
      <div className="container pb-4">
        <div className="row">
          {new Array(maxCards).fill(null).map((_, i) => (
            <div className="col-xs-12 col-md-4 mb-3" key={i}>
              <GameListCard
                game={starts?.[i]?.attributes}
                chainId={chainId}
                loading={loading}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
