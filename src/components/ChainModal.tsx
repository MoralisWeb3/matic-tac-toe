import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useChainContext } from "../hooks/Moralis";
import { chainIdToName } from "../utils";

export const IncorrectChainModal = ({ chainId }) => {
  const [currentChainId] = useChainContext();
  const open = currentChainId !== chainId;
  const history = useHistory();
  useEffect(() => {
    if (open) {
      document.body.classList.add("modal-open");
    } else {
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
                Select the network <code>{chainIdToName(chainId)}</code> in Metamask to continue to game.
            </div>
            <div className="modal-footer">
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
      <div className={`modal-backdrop fade ${open ? "show" : ""}`}></div>
    </>
  );
};
