import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  function showValue(value) {
    if (value !== 0) return value;
  }

  return (
    <button className="square" onClick={props.onClick}>
      {showValue(props.value)}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
          {this.renderSquare(3)}
        </div>
        <div className="board-row">
          {this.renderSquare(4)}
          {this.renderSquare(5)}
          {this.renderSquare(6)}
          {this.renderSquare(7)}
        </div>
        <div className="board-row">
          {this.renderSquare(8)}
          {this.renderSquare(9)}
          {this.renderSquare(10)}
          {this.renderSquare(11)}
        </div>
        <div className="board-row">
          {this.renderSquare(12)}
          {this.renderSquare(13)}
          {this.renderSquare(14)}
          {this.renderSquare(15)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: getRandomSquares(),
        },
      ],
      stepNumber: 0,
      emptyIndex: 15,
    };
  }

  handleClick(i) {
    if (i === this.state.emptyIndex) return;

    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (this.isHorizontalMove(i)) {
      this.shiftNumbers(squares, i, current, 1);
    } else if (this.isVerticalMove(i)) {
      this.shiftNumbers(squares, i, current, 4);
    } else {
      return;
    }

    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      emptyIndex: i,
    });
  }

  shiftNumbers(squares, i, current, step) {
    squares[i] = 0;
    if (i < this.state.emptyIndex) {
      for (let j = i + step; j <= this.state.emptyIndex; j += step)
        squares[j] = current.squares[j - step];
    } else {
      for (let j = this.state.emptyIndex; j < i; j += step)
        squares[j] = current.squares[j + step];
    }
  }

  isVerticalMove(i) {
    return i % 4 === this.state.emptyIndex % 4;
  }

  isHorizontalMove(i) {
    return (
      Math.abs(i - this.state.emptyIndex) < 4 &&
      Math.floor(i / 4) === Math.floor(this.state.emptyIndex / 4)
    );
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const isFinished = calculateEndGame(current.squares);

    let status;
    if (isFinished) {
      status = "Congratulations! You win the game!";
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateEndGame(squares) {
  const lines = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];

  let isFinished = true;
  for (let i = 0; i < lines.length; i++) {
    if (squares[i] !== lines[i]) {
      isFinished = false;
      break;
    }
  }
  return isFinished;
}

function getRandomSquares() {
  let squares;

  do {
    let index = 0;
    let numbers = new Set();
    squares = Array(16).fill(null);

    while (numbers.size < 15) {
      const candidateNumber = getRandomInt(1, 15);

      if (!numbers.has(candidateNumber)) {
        numbers.add(candidateNumber);
        squares[index] = candidateNumber;
        index++;
      }
    }
  } while (impossibleToWin(squares) || calculateEndGame(squares));

  squares[15] = 0;
  return squares;
}

function impossibleToWin(squares) {
  let number = 0;

  for (let i = 0; i < 15; i++) {
    if (squares[i] !== i + 1) number++;
  }

  return number % 2 === 1;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
