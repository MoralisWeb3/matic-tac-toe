import React from "react";
import * as utils from "./utils";
import "./index.css";

// Create Box component
export const Box = (props) => {
  return (
    <button className="board__box" onClick={props.onClick} style={{ opacity: props.pendingValue && props.value !== props.pendingValue ? 0.4 : 1 }}>
      {props.value || props.pendingValue}
    </button>
  );
};

export const TicTacToeBoard = ({ boxes, pendingBoxes, onBoxClick }) => {
//   const winner = utils.findWinner(boxes);s

  // Are all boxes checked?
  //   const isFilled = utils.areAllBoxesClicked(boxes);

  return (
    <>
      {/* The game board */}
      <div className="board-wrapper">
        <div className="board">
          {/* <h2 className="board-heading">{status}</h2> */}

          <div className="board-row">
            <Box value={boxes[0]} pendingValue={pendingBoxes[0]} onClick={() => onBoxClick(0)} />

            <Box value={boxes[1]} pendingValue={pendingBoxes[1]} onClick={() => onBoxClick(1)} />

            <Box value={boxes[2]} pendingValue={pendingBoxes[2]} onClick={() => onBoxClick(2)} />
          </div>

          <div className="board-row">
            <Box value={boxes[3]} pendingValue={pendingBoxes[3]} onClick={() => onBoxClick(3)} />

            <Box value={boxes[4]} pendingValue={pendingBoxes[4]} onClick={() => onBoxClick(4)} />

            <Box value={boxes[5]} pendingValue={pendingBoxes[5]} onClick={() => onBoxClick(5)} />
          </div>

          <div className="board-row">
            <Box value={boxes[6]} pendingValue={pendingBoxes[6]} onClick={() => onBoxClick(6)} />

            <Box value={boxes[7]} pendingValue={pendingBoxes[7]} onClick={() => onBoxClick(7)} />

            <Box value={boxes[8]} pendingValue={pendingBoxes[8]} onClick={() => onBoxClick(8)} />
          </div>
        </div>
      </div>
    </>
  );
};

const GameHistory = ({ history }) => {
  return (
    <div className="board-history">
      <h2 className="board-heading">Moves history:</h2>

      {/* List with history of moves */}
      <ul className="board-historyList">
        {history.length === 0 && <span>No moves to show.</span>}

        {history.length !== 0 &&
          history.map((move, index) => {
            return (
              <li key={index}>
                Move {index + 1}: <strong>{move}</strong>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

// Create Board component
export class TicTacToeBoardLegacy extends React.Component {
  state = {
    boxes: Array(9).fill(null),
    history: [] as string[],
    xIsNext: true,
  };

  // Handle click on boxes on the board.
  handleBoxClick(index) {
    // get current state of boxes
    const boxes = this.state.boxes.slice();

    // Get current state of history
    let history = this.state.history;

    // Stop the game if board contains winning combination
    if (utils.findWinner(boxes) || boxes[index]) {
      return;
    }

    // Stop the game if all boxes are clicked (filled)
    if (utils.areAllBoxesClicked(boxes) === true) {
      return;
    }

    // Mark the box either as 'x' or 'o'
    boxes[index] = this.state.xIsNext ? "x" : "o";

    // Add move to game history
    history.push(this.state.xIsNext ? "x" : "o");

    // Update component state with new data
    this.setState({
      boxes: boxes,
      history: history,
      xIsNext: !this.state.xIsNext,
    });
  }

  // Handle board restart - set component state to initial state
  handleBoardRestart = () => {
    this.setState({
      boxes: Array(9).fill(null),
      history: [],
      xIsNext: true,
    });
  };

  render() {
    // Get winner (if there is any)
    return null;
  }
}
