import React from "react";
import { Header, MainTitle } from "../components/Header";
import { GameListCard } from "../components/GameItem";
import { useMoralisQuery } from "../hooks/Moralis/Query";
import { chainIdToName, chainIdToTableName, MUMBAI_NETWORK, MOONBASE, OPTIMISM_TEST  } from "../hooks/Moralis";

const maxCards = 6

const ChainHeaderImage = ({ chainId }) => {
  switch (chainId) {
    case MUMBAI_NETWORK.chainId:
      return <img src={`${process.env.PUBLIC_URL}/logo-polygon.png`} alt={chainIdToName(chainId)} style={{ height: 60, marginBottom: 8 }} />;
    case MOONBASE.chainId:
      return <img src={`${process.env.PUBLIC_URL}/logo-moonbeam.png`} alt={chainIdToName(chainId)} style={{ height: 60, marginBottom: 8 }} />;
    case OPTIMISM_TEST.chainId: 
      return <h1 className="optimism-title">Optimism</h1>
    default:
      return null;
  }
}

export const L2Lobby = ({ chainId }) => {
  const { data: starts, loading } = useMoralisQuery(chainIdToTableName(chainId), {
    live: true,
    filter: (query) => {
      query.descending("block_number");
      query.limit(maxCards);
    },
  });

  return (
    <>
      <Header className="text-center">
        <ChainHeaderImage chainId={chainId} />
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
