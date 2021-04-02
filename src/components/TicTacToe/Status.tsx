import React, { useMemo } from "react";
import { useGame } from "../../context/Game";
import { gameDataBoxes, findWinner } from "./utils";
import { formatAddress, formatBalance } from "../../utils";
import { useTokenFromList } from "../../context/Token";

export const GameStatusText = () => {
  const [game] = useGame();
  const gameData = game?.data;
  const player0 = gameData?.player0 ?? "";
  const player1 = gameData?.player1 ?? "";
  const balance0 = gameData?.balance0 ?? "0";
  const balance1 = gameData?.balance1 ?? "0";
  const turn = gameData?.turn ?? 0;
  const winner = useMemo(() => findWinner(gameDataBoxes(gameData)), [gameData]);
  const token = useTokenFromList(gameData?.token);
  return (
    <div className="text-center">
      <GamePlayerStatus
        address={player0}
        balance={balance0}
        tokenSymbol={token?.symbol}
        tokenDecimals={token?.decimals}
        isPlayersTurn={turn === 0}
        isWinner={winner === "O"}
      />
      <p className="text-muted">vs</p>
      <GamePlayerStatus
        address={player1}
        balance={balance1}
        tokenSymbol={token?.symbol}
        tokenDecimals={token?.decimals}
        isPlayersTurn={turn === 1}
        isWinner={winner === "X"}
      />
    </div>
  );
};

export const GamePlayerStatus = ({
  address,
  balance,
  tokenSymbol,
  tokenDecimals,
  isPlayersTurn,
  isWinner,
}) => {
  return (
    <p className={`${isPlayersTurn ? "text-primary mb-0" : ""}`}>
      {formatAddress(address)}{" "}
      <span className="badge bg-secondary">
        {formatBalance(balance, tokenDecimals)} {tokenSymbol}
      </span>{" "}
      {isWinner ? <span className="badge bg-primary">Winner</span> : null}
    </p>
  );
};
