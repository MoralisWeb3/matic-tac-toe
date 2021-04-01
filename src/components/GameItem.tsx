import Moralis from "moralis";
import React from "react";
import { Link } from "react-router-dom";
import { useLoadGame } from "../context/Game";
import { formatAddress, zeroAddress } from "../utils"

const web3 = new Moralis.Web3();

export const GameListCard = ({ gameId }) => {
  const [game] = useLoadGame(gameId);
  return (
    <div className="card">
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col">
            <p className="mb-0">
              <strong>#{gameId}</strong>
            </p>
            <p className="mb-0">{formatAddress(game?.data?.player0)}</p>
            <p className="mb-0">{web3.utils.fromWei(game?.data?.balance0 ?? "")}</p>
          </div>
          <div className="col">
            <p className="mb-0">
              {game?.data?.player1 === zeroAddress()
                ? "Waiting for player"
                : "In Progress"}
            </p>
            <p className="mb-0 ">{formatAddress(game?.data?.player1)}</p>
            <p className="mb-0">{web3.utils.fromWei(game?.data?.balance1 ?? "")}</p>
          </div>
        </div>
        <div className="text-end">
          <Link className="btn btn-primary" to={`/tic-tac-toe/${gameId}`}>
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

export const GameListItem = ({ gameId }) => {
  const [game] = useLoadGame(gameId);
  return (
    <li className="list-group-item">
      <div className="row align-items-center">
        <div className="col">
          <p className="mb-0">
            <strong>#{gameId}</strong>
          </p>
          <p className="mb-0">{formatAddress(game?.data?.player0)}</p>
          <p className="mb-0">{web3.utils.fromWei(game?.data?.balance0 ?? "")}</p>
        </div>
        <div className="col">
          <p className="mb-0">
            {game?.data?.player1 === zeroAddress()
              ? "Waiting for player"
              : "In Progress"}
          </p>
          <p className="mb-0 ">{formatAddress(game?.data?.player1)}</p>
          <p className="mb-0">{web3.utils.fromWei(game?.data?.balance1 ?? "")}</p>
        </div>
      </div>
      <div className="text-end">
        <Link className="btn btn-primary" to={`/tic-tac-toe/${gameId}`}>
          View
        </Link>
      </div>
    </li>
  );
};