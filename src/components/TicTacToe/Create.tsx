import React from "react";
import { useSelectedToken, useTokenList } from "../../context/Token";
import { useBetAmount } from "../../context/Bet";

export const GameCreateForm = () => {
  const [token, setToken] = useSelectedToken();
  const [amount, setAmount] = useBetAmount();
  const [{ data }] = useTokenList();

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
          <option selected>Select token</option>
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
      </div>
    </div>
  );
};
