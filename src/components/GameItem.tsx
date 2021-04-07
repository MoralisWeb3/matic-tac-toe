import React from "react";
import { useHistory } from "react-router-dom";
import { useLoadGame } from "../context/Game";
import { useTokenFromList } from "../context/Token";
import {
  formatAddress,
  zeroAddress,
  formatBalance,
  chainIdToName,
} from "../utils";

export const GameListCard = ({ game, chainId, loading }) => {
  if (!loading && !game) return null
  return (
    <div className="card">
      <div className="card-body">
        <GameDetails game={game} chainId={chainId} loading={loading} />
      </div>
    </div>
  );
};

export const GameListItem = ({ game, chainId, loading }) => {
  return (
    <li className="list-group-item">
      <GameDetails game={game} chainId={chainId} loading={loading} />
    </li>
  );
};

const GameDetails = ({ game, chainId, loading }) => {
  // const [game] = useLoadGame(gameId);
  const token = useTokenFromList(game?.token);
  const history = useHistory();
  return (
    <>
      <div className="row align-items-center">
        <div className="col">
          <p className="mb-0">
            <strong>#{game?.gameId}</strong> <span>{chainIdToName(chainId)}</span>
          </p>
          <p className="mb-0">{formatAddress(game?.player0)}</p>
          <p className="mb-0">
            {formatBalance(game?.balance0 ?? "", token?.decimals)}{" "}
            {token?.symbol}
          </p>
        </div>
        {/* <div className="col">
          <p className="mb-0">
            {game?.player1 === zeroAddress()
              ? "Waiting for player"
              : "In Progress"}
          </p>
          <p className="mb-0 ">{formatAddress(game?.player1)}</p>
          <p className="mb-0">
            {formatBalance(game?.balance1 ?? "", token?.decimals)}{" "}
            {token?.symbol}
          </p>
        </div> */}
      </div>
      <div className="text-end">
        <button
          className="btn btn-primary"
          disabled={!game?.gameId}
          onClick={() => history.push(`/tic-tac-toe/${chainId}/${game?.gameId}`)}
        >
          View
        </button>
      </div>
    </>
  );
};
