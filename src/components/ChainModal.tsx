import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useChainContext, addEthereumChain, chainIdToName } from "../hooks/Moralis";

export const IncorrectChainModal = ({ chainId }) => {
  const [currentChainId] = useChainContext();
  const open = Boolean(chainId && currentChainId !== chainId);
  const history = useHistory();
  useEffect(() => {
    if (open) {
      document.body.classList.add("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
    }
  }, [open]);
  return (
    <>
      <div
        className={`modal fade ${open ? "show" : ""}`}
        style={{ display: open ? "block" : "none" }}
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                Wrong Network
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => history.push('/')}
              ></button>
            </div>
            <div className="modal-body">
              Switch the network to <code>{chainIdToName(chainId)}</code> in Metamask to continue to game.
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={() => addEthereumChain(chainId)}
              >
                Switch Network
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => history.push('/')}
              >
                Lobby
              </button>
            </div>
          </div>
        </div>
      </div>
      {open ? <div className={`modal-backdrop fade ${open ? "show" : ""}`}></div> : null}
    </>
  );
};
