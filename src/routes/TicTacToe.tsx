import React from "react";
import { useParams } from "react-router-dom";
import { useSetAlert } from "../components/Alert";
import { Header, MainTitle } from "../components/Header";
import { TicTacToeBoard } from "../components/TicTacToe/Board";
import {
  ApproveButton,
  DisabledButton,
  JoinGameButton,
  StartGameButton,
} from "../components/TicTacToe/Buttons";
import { GameStatusText } from "../components/TicTacToe/Status";
import { GameCreateForm } from "../components/TicTacToe/Create";
import { findWinner, gameDataBoxes, areAllBoxesClicked } from "../components/TicTacToe/utils";
import { useAllowance } from "../context/Allowance";
import {
  GameProvider,
  useGame,
  useLoadGame,
  useRefetchGame,
} from "../context/Game";
import { useSelectedToken, useTokenFromList } from "../context/Token";
import { useTicTacToeContract } from "../hooks/Contract/TicTacToe";
import { useAddressContext } from "../hooks/Moralis";
import { formatAddress, getCurrentAddress, toWei, zeroAddress } from "../utils";
import { useBetAmount } from "../context/Bet";

export const TicTacToe = () => {
  const params = useParams<{ gameId: string }>();
  const value = useLoadGame(params.gameId);

  return (
    <GameProvider value={value}>
      <Header>
        <MainTitle />
        {params.gameId ? <GameStatusText /> : <GameCreateForm />}
      </Header>
      <div className="mx-auto" style={{ width: 250 }}>
        {params.gameId ? <TicTacToeGame /> : null}
        <div className="d-grid gap-2 mx-auto my-4">
          <GameCurrentActionButton />
        </div>
      </div>
    </GameProvider>
  );
};

const TicTacToeGame = () => {
  const [game] = useGame();
  const gameData = game?.data;
  const boxes = gameDataBoxes(gameData);

  const { handleBoxClick } = useTicTacToeActions();

  return <TicTacToeBoard boxes={boxes} onBoxClick={handleBoxClick} />;
};

const GameCurrentActionButton = () => {
  const [game] = useGame();
  const contract = useTicTacToeContract();
  const [token] = useSelectedToken();
  const [address] = useAddressContext();
  const [amount] = useBetAmount();
  const allowance = useAllowance(game?.data?.token ?? token, contract.address);
  const selectedTokenData = useTokenFromList(token);
  // const gameTokenData = useTokenFromList(game?.data?.token);

  console.log(allowance, game)

  if (game.loading || allowance.loading) {
    return <DisabledButton text="Loading..." />;
  }

  if (game.error) {
    return <DisabledButton text={game.error.message} />;
  }

  if (!game.data) {
    if (!amount) {
      return <DisabledButton text="Set bet amount" />
    }

    const weiAmount = toWei(amount, selectedTokenData?.decimals)
    if (allowance.data && Number(allowance.data) >= Number(weiAmount)) {
      return <StartGameButton amount={weiAmount} token={token} />;
    }

    return <ApproveButton amount={weiAmount} token={token} />;
  }

  if (game.data.player1 === zeroAddress()) {
    const isPlayer0 =
      address?.toLowerCase() === game.data?.player0?.toLowerCase();
    // const isPlayer1 = address?.toLowerCase() === game?.player1?.toLowerCase()
    if (isPlayer0) {
      return <DisabledButton text="Waiting for players" />;
    }

    if (!game.data.balance0) {
      return <DisabledButton text={<span>&nbsp;</span>} />
    }

    if (Number(allowance.data) >= Number(game.data.balance0)) {
      return <JoinGameButton gameId={game.data.gameId} amount={game.data.balance0} />;
    }

    return <ApproveButton amount={game.data.balance0} token={game?.data?.token} />;
  }

  const boxes = gameDataBoxes(game.data);
  const winner = findWinner(boxes);

  if (winner) {
    return <DisabledButton text={`Winner ${winner}`} />;
  }

  if (areAllBoxesClicked(boxes)) {
    return <DisabledButton text={`Tie Game`} />;
  }

  return <DisabledButton text="Game In Progress" />;
};

const useTicTacToeActions = () => {
  const contract = useTicTacToeContract();
  const setAlert = useSetAlert();
  const refetch = useRefetchGame();
  const [game] = useGame();

  const handleBoxClick = async (num: number) => {
    const row = Math.floor(num / 3);
    const col = num % 3;

    try {
      const gameId = game?.data?.gameId;
      if (!gameId) {
        throw new Error("Game not found");
      }
      const turn = game?.data?.turn ?? 0;
      const address = getCurrentAddress()?.toLowerCase();
      const nextUpAddress = game?.data?.[`player${turn}`]?.toLowerCase();
      if (address !== nextUpAddress) {
        throw new Error(`Next to play is ${formatAddress(nextUpAddress)}`);
      }
      await contract.play(gameId, row, col).then(() => refetch());
      setAlert({
        show: true,
        title: "Played",
        message: `Successfully played ${row} ${col}!`,
      });
    } catch (e) {
      console.error(e);
      setAlert({ show: true, title: "Play Error", message: e.message });
    }
  };

  return { handleBoxClick };
};
