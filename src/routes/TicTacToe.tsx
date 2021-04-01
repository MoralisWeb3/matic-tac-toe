import React from "react";
import { useParams } from "react-router-dom";
import { useSetAlert } from "../components/Alert";
import { GameProvider, useGame, useLoadGame, useRefetchGame } from "../context/Game";
import { Header, MainTitle } from "../components/Header";
import { TicTacToeBoard } from "../components/TicTacToe/Board";
import {
  DisabledButton,
  StartGameButton,
  JoinGameButton,
  ApproveButton,
} from "../components/TicTacToe/Buttons";
import { useTicTacToeContract } from "../hooks/Contract/TicTacToe";
import { useAddressContext } from "../hooks/Moralis";
import { zeroAddress } from "../utils";
import { useAllowance } from "../context/Allowance";
import { useSelectedToken } from "../context/Token";

export const TicTacToe = () => {
  const params = useParams<{ gameId: string }>();
  const { handleBoxClick } = useTicTacToeActions(params);
  const value = useLoadGame(params.gameId);

  const game = value?.[0]?.data
  const boxes = (game?.row1 ?? "")
    .concat(game?.row2 ?? "", game?.row3 ?? "")
    .split("")
    .map((v) => (v === "3" ? "X" : v === "2" ? "O" : ""));

  return (
    <GameProvider value={value}>
      <Header className="text-center">
        <MainTitle />
        <GameStatusText />
      </Header>
      <div className="mx-auto" style={{ width: 250 }}>
        <TicTacToeBoard boxes={boxes} onBoxClick={handleBoxClick} />
        <div className="d-grid gap-2 mx-auto my-4">
          <GameCurrentActionButton />
        </div>
      </div>
    </GameProvider>
  );
};

const GameStatusText = () => {
  const [game] = useGame();

  return (
    <p className="text-center">Player {(game?.data?.turn ?? 0) + 1}'s turn</p>
  );
};

const GameCurrentActionButton = () => {
  const [game] = useGame();
  const contract = useTicTacToeContract();
  const [token] = useSelectedToken();
  const [address] = useAddressContext();
  const allowance = useAllowance(token, contract.address);

  if (game.loading || allowance.loading) {
    return <DisabledButton text="Loading..." />;
  }

  if (game.error) {
    return <DisabledButton text={game.error.message} />;
  }

  if (!game.data) {
    if (allowance.data && allowance.data > "0") {
      return <StartGameButton />;
    }
    return <ApproveButton />;
  }

  if (game.data.player1 === zeroAddress()) {
    const isPlayer0 =
      address?.toLowerCase() === game.data?.player0?.toLowerCase();
    // const isPlayer1 = address?.toLowerCase() === game?.player1?.toLowerCase()
    if (isPlayer0) {
      return <DisabledButton text="Waiting for players" />;
    }

    if (
      !game.data.balance0 ||
      !allowance.data ||
      allowance.data >= game.data.balance0
    ) {
      return <JoinGameButton gameId={game.data.gameId} />;
    }

    return <ApproveButton />;
  }

  return <DisabledButton text="Game In Progress" />;
};

const useTicTacToeActions = ({ gameId }: { gameId: string }) => {
  const contract = useTicTacToeContract();
  const setAlert = useSetAlert();
  const refetch = useRefetchGame();

  const handleBoxClick = async (num: number) => {
    const row = Math.floor(num / 3)
    const col = num % 3
    contract
      .play(gameId, row, col)
      .then(() => refetch())
      .then(() => {
        setAlert({
          show: true,
          title: "Played",
          message: `Successfully played ${row} ${col}!`,
        })
      })
      .catch((e) => {
        console.error(e);
        setAlert({ show: true, title: "Play Error", message: e.message });
      });
  };

  return { handleBoxClick };
};
