import React from "react";
import { useTicTacToeContract } from "../../hooks/Contract/TicTacToe";
import { useSelectedToken } from "../../context/Token";
import { useRefetchGame } from "../../context/Game";
import { useBetAmount } from "../../context/Bet";
import { useSetAlert } from "../Alert";
import Moralis from "moralis";
import { useHistory } from "react-router";

const web3 = new Moralis.Web3();

export const DisabledButton = ({ text }) => {
  return (
    <button className="btn btn-primary" disabled>
      {text}
    </button>
  );
};

export const ApproveButton = () => {
  const contract = useTicTacToeContract();
  const setAlert = useSetAlert();
  const refetch = useRefetchGame();
  const [token] = useSelectedToken();
  const [amount] = useBetAmount();

  const handleApprove = async () => {
    await contract
      .approve(token, contract.address, amount)
      .then(() => refetch())
      .then(() =>
        setAlert({
          show: true,
          title: "Approved",
          message: `Successfully approved game to spend ${web3.utils.fromWei(
            amount
          )} your tokens!`,
        })
      )
      .catch((e) => {
        console.error(e);
        setAlert({ show: true, title: "Approve Error", message: e.message });
      });
  };

  return (
    <button className="btn btn-primary" onClick={handleApprove}>
      Approve
    </button>
  );
};

export const StartGameButton = () => {
  const contract = useTicTacToeContract();
  const setAlert = useSetAlert();
  const [token] = useSelectedToken();
  const [amount] = useBetAmount();
  const refetch = useRefetchGame();
  const history = useHistory();

  const handleStart = async () => {
    await contract
      .start(token, amount)
      .then((v) => {
        console.log(v);
        const newGameId = v.events?.Start?.returnValues?.gameId;
        if (newGameId) {
          history.push(`/tic-tac-toe/${newGameId}`);
          setAlert({
            show: true,
            title: "Started",
            message: "Successfully started game!",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setAlert({ show: true, title: "Start Error", message: e.message });
      });
  };

  return (
    <button className="btn btn-primary" onClick={handleStart}>
      Start
    </button>
  );
};

export const JoinGameButton = ({ gameId }: { gameId: string }) => {
  const contract = useTicTacToeContract();
  const setAlert = useSetAlert();
  const [amount] = useBetAmount();
  const refetch = useRefetchGame();

  const handleJoin = async () => {
    await contract
      .join(gameId, amount)
      .then(() => refetch())
      .then(() =>
        setAlert({
          show: true,
          title: "Joined",
          message: "Successfully joined game!",
        })
      )
      .catch((e) => {
        console.error(e);
        setAlert({ show: true, title: "Join Error", message: e.message });
      });
  };

  return (
    <button className="btn btn-primary" onClick={handleJoin}>
      Join
    </button>
  );
};
