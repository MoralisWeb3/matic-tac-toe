import React, { useEffect, useRef, useState } from "react";
import Moralis from 'moralis';
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
import { RealtimeGameProvider, useRealtimeGame } from "../context/RealtimeGame";
import { useSelectedToken, useTokenFromList } from "../context/Token";
import { useTicTacToeContract } from "../hooks/Contract/TicTacToe";
import { useAddressContext, useChainContext, chainIdToTableName } from "../hooks/Moralis";
import { formatAddress, getCurrentAddressAsync, toWei, zeroAddress } from "../utils";
import { useBetAmount } from "../context/Bet";
import { useTokenBalance } from "../context/TokenBalance";
import { IncorrectChainModal } from "../components/ChainModal";
import { useMoralisQuery } from "../hooks/Moralis/Query";

export const TicTacToe = () => {
  const params = useParams<{ gameId: string, chainId: string }>();
  const value = useLoadGame(params.gameId);
  const [chainId] = useChainContext()
  const realtime = useMoralisQuery(chainIdToTableName(chainId), {
    live: true,
    skip: !params.gameId,
    params: [params.gameId, params.chainId],
    filter: (query) => {
      query.equalTo("gameId", params.gameId);
      query.descending("block_number");
    },
  });

  return (
    <GameProvider value={value}>
      <RealtimeGameProvider value={realtime}>
        <Header>
          <MainTitle chainId={params.chainId || chainId} />
          {params.gameId ? <GameStatusText /> : <GameCreateForm />}
        </Header>
        <div className="mx-auto" style={{ width: 250 }}>
          {params.gameId ? <TicTacToeGame /> : null}
          <div className="d-grid gap-2 mx-auto my-4">
            <GameCurrentActionButton />
          </div>
        </div>
        <IncorrectChainModal chainId={params.chainId} />
      </RealtimeGameProvider>
    </GameProvider>
  );
};


const web3 = new Moralis.Web3((window as any).ethereum)
const TicTacToeGame = () => {
  const [game] = useGame();
  const gameData = game?.data;
  const realtimeGame = useRealtimeGame();
  const boxes = gameDataBoxes(gameData);
  const pendingBoxes = gameDataBoxes(realtimeGame?.data?.[0]?.attributes);
  const refetch = useRefetchGame();
  const [chainId] = useChainContext()
  const prevChain = useRef(null)

  console.log(gameData, realtimeGame)

  useEffect(() => {
    if (prevChain.current && prevChain.current !== chainId) {
      refetch()
    }
    prevChain.current = chainId
  }, [chainId])

  useEffect(() => {
    const joinTopic = web3.utils.sha3('Join(uint256,address,address,uint256)')
    const playTopic = web3.utils.sha3('Play(uint256,uint256,uint256,uint256)')

    const joinEvent = web3.eth.subscribe('logs', {
      topics: [joinTopic],
      fromBlock: 'latest'
    })
    .on('connected', () => {
      console.log('Subscribed to', joinTopic)
    })
    .on('data', (v) => {
      console.log('Join Event', v)
      refetch()
    })
    .on('error', (e) => {
      console.log('Join Sub Error', e)
    })
    
    const playEvent = web3.eth.subscribe('logs', {
      topics: [playTopic],
      fromBlock: 'latest'
    })
    .on('connected', () => {
      console.log('Subscribed to', playTopic)
    })
    .on('data', (v) => {
      console.log('Play Event', v)
      refetch()
    })
    .on('error', (e) => {
      console.log('Play Sub Error', e)
    })

    return () => {
      playEvent.unsubscribe()
      joinEvent.unsubscribe()
    }
  }, [chainId, refetch])

  const { handleBoxClick } = useTicTacToeActions();

  return <TicTacToeBoard boxes={boxes} pendingBoxes={pendingBoxes} onBoxClick={handleBoxClick} />;
};

const GameCurrentActionButton = () => {
  const [game] = useGame();
  const contract = useTicTacToeContract();
  const [token] = useSelectedToken();
  const [address] = useAddressContext();
  const [amount] = useBetAmount();
  const allowance = useAllowance(game?.data?.token ?? token, contract.address);
  const balance = useTokenBalance(game?.data?.token ?? token, address);
  const selectedTokenData = useTokenFromList(token);

  if (game.loading || allowance.loading || balance.loading) {
    return <DisabledButton text="Loading..." />;
  }

  if (game.error) {
    return <DisabledButton text={game.error.message} />;
  }

  if (!game.data) {
    const weiAmount = toWei(amount, selectedTokenData?.decimals)

    if (!amount) {
      return <DisabledButton text="Set bet amount" />
    }

    if (!balance.data || Number(balance.data) < Number(weiAmount)) {
      return <DisabledButton text="Insufficient balance" />
    }

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

    if (Number(balance.data) < Number(game.data.balance0)) {
      return <DisabledButton text="Insufficient balance" />;
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
    return <DisabledButton text="Tie Game" />;
  }

  return <DisabledButton text="Game In Progress" />;
};

const useTicTacToeActions = () => {
  const contract = useTicTacToeContract();
  const setAlert = useSetAlert();
  const refetch = useRefetchGame();
  const [loading, setLoading] = useState(false);
  const [game] = useGame();
  const realtime = useRealtimeGame();
  

  const handleBoxClick = async (num: number) => {
    const row = Math.floor(num / 3);
    const col = num % 3;
    setLoading(true);
    if (loading) return;

    try {
      const gameId = game?.data?.gameId;
      if (!gameId) {
        throw new Error("Game not found");
      }
      if (game?.data?.[`player1`] === zeroAddress()) {
        throw new Error("Waiting for second player to join");
      }
      const turn = game?.data?.turn ?? 0;
      const web3 = await Moralis.Web3.enable();
      const address = await getCurrentAddressAsync(web3);
      const nextUpAddress = game?.data?.[`player${turn}`]?.toLowerCase();
      if (address !== nextUpAddress) {
        throw new Error(`Next to play is ${formatAddress(nextUpAddress)}`);
      }

      const realtimeData = realtime.data?.[0]
      if (realtimeData) {
        const rows = [game?.data?.row1, game?.data?.row2, game?.data?.row3]
        const rowStr = rows[row]
        if (rowStr) {
          rows[row] = rowStr.slice(0, col).concat(String(turn + 2), rowStr.slice(col + 1))
        }
        realtimeData.set('row1', rows[0])
        realtimeData.set('row2', rows[1])
        realtimeData.set('row3', rows[2])
        await realtimeData.save()
      }
    } catch (e) {
      setAlert({ show: true, title: "Play Error", message: e.message });
      setLoading(false);
      return;
    }

    try {
      const gameId = game?.data?.gameId;
      if (!gameId) {
        throw new Error("Game not found");
      }

      await contract.play(gameId, row, col).then(() => refetch());
      setAlert({
        show: true,
        title: "Played",
        message: `Successfully played ${row} ${col}!`,
      });
    } catch (e) {
      console.error(e);
      const realtimeData = realtime.data?.[0]
      if (realtimeData) {
        realtimeData.set('row1', game?.data?.row1)
        realtimeData.set('row2', game?.data?.row2)
        realtimeData.set('row3', game?.data?.row3)
        await realtimeData.save()
      }
      
      setAlert({ show: true, title: "Play Error", message: e.message });
    }
    setLoading(false);
  };

  // useEffect(() => {
  //   const id = setInterval(() => {
  //     refetch()
  //   }, 5000)

  //   return () => clearInterval(id)
  // }, [])

  return { handleBoxClick, loading };
};
