import React from "react";
import {
  useSelectedToken,
  useTokenList,
  useTokenFromList,
} from "../../context/Token";
import { useBetAmount } from "../../context/Bet";
import { useTokenBalance } from "../../context/TokenBalance";
import { useAddressContext, useChainContext } from "../../hooks/Moralis";
import { formatBalance, chainIdToName } from "../../utils";

export const GameCreateForm = () => {
  const [token, setToken] = useSelectedToken();
  const [amount, setAmount] = useBetAmount();
  const [address] = useAddressContext();
  const [chainId] = useChainContext();
  const balance = useTokenBalance(token, address);
  const [{ data }] = useTokenList();
  const selectedTokenData = useTokenFromList(token);

  return (
    <div className="mx-auto mt-4" style={{ maxWidth: 250 }}>
      <p>Game Options</p>
      <div className="mb-3">
        <label htmlFor="bet-token" className="form-label">
          Bet Token
        </label>
        <select
          id="bet-token"
          className="form-select"
          aria-label="Default select example"
          value={token}
          onChange={(ev) => setToken(ev.target.value)}
        >
          <option>Select token</option>
          {data?.map((token) => (
            <option key={token.address} value={token.address}>
              {token.name}
            </option>
          ))}
          {/* <option value={token}>MOR</option> */}
          {/* <option value="2">Two</option> */}
          {/* <option value="3">Three</option> */}
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="bet-amount-input" className="form-label">
          Bet Amount
        </label>
        <input
          type="email"
          className="form-control"
          id="bet-amount-input"
          placeholder="0.0"
          value={amount}
          onChange={(ev) => setAmount(ev.target.value)}
        ></input>
        {selectedTokenData?.chainId && selectedTokenData?.chainId !== chainId ? (
          <small className="text-danger">
            Select chain {chainIdToName(selectedTokenData?.chainId)}
          </small>
        ) : (
          <small>
            {balance.loading ? (
              <span>&nbsp;</span>
            ) : (
              `Max: ${formatBalance(balance?.data, selectedTokenData?.decimals) ?? "0"}`
            )}
          </small>
        )}
      </div>
    </div>
  );
};
