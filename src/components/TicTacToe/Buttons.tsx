import React from "react";
import { useHistory } from "react-router";
import { useRefetchGame } from "../../context/Game";
import { useTokenFromList } from "../../context/Token";
import { useRefetchAllowance } from "../../context/Allowance";
import { useTicTacToeContract } from "../../hooks/Contract/TicTacToe";
import { formatBalance } from "../../utils";
import { useSetAlert } from "../Alert";

export const DisabledButton = ({ text }) => {
  return (
    <button className="btn btn-primary" disabled>
      {text}
    </button>
  );
};

export const ApproveButton = ({ token, amount }) => {
  const contract = useTicTacToeContract();
  const setAlert = useSetAlert();
  const refetch = useRefetchAllowance();
  const tokenData = useTokenFromList(token)

  const handleApprove = async () => {
    try {
      await contract
        .approve(token, contract.address, amount)
        .then(() => refetch(token, contract.address))
        .then(() =>
          setAlert({
            show: true,
            title: "Approved",
            message: `Successfully approved game to spend ${formatBalance(amount, tokenData?.decimals)} ${tokenData?.symbol ?? ''} tokens!`,
          })
        );
    } catch (e) {
      console.error(e);
      setAlert({ show: true, title: "Approve Error", message: e.message });
    }
  };

  return (
    <button className="btn btn-primary" onClick={handleApprove}>
      Approve
    </button>
  );
};

export const StartGameButton = ({ token, amount }: { token: string, amount: string }) => {
  const contract = useTicTacToeContract();
  const setAlert = useSetAlert();
  const history = useHistory();

  const handleStart = async () => {
    await contract
      .start(token, amount)
      .then((v) => {
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

export const JoinGameButton = ({ gameId, amount }: { gameId: string, amount: string }) => {
  const contract = useTicTacToeContract();
  const setAlert = useSetAlert();
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
