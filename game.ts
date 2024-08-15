// const playerOnePositions = { 1: 0, 2: 0, 3: 0, 4: 0 };
// const playerTwoPositions = { 1: 0, 2: 0, 3: 0, 4: 0 };
// const playerThreePositions = { 1: 0, 2: 0, 3: 0, 4: 0 };
// const playerFourPositions = { 1: 0, 2: 0, 3: 0, 4: 0 };

import { addPlayer, createBoard, movePlayer } from "./src/board";
import { createPlayer } from "./src/player";
import { IBoard, IPlayer } from "./types";

// const players = [
//     playerOnePositions,
//     playerTwoPositions,
//     playerThreePositions,
//     playerFourPositions,
// ];

// const startingPlayer = Math.floor(Math.random() * 4);

const playerTurn = (player: IPlayer, board: IBoard) => {
    const diceRoll = player.rollDice();
    if (player.moveCount === 0 && diceRoll !== 6) {
        return false;
    }
    movePlayer(board, player, diceRoll);

    if (player.position === board.board.length - 1) {
        console.log(`${player.name} has reached the end of the board!`);
        return true;
    }
    return false;
};

const playGame = () => {
    const board = createBoard();
    const players = ["Red", "Green", "Red", "Blue"].map((name) =>
        createPlayer(name)
    );
    players.forEach((player) => addPlayer(board, player));

    let currentPlayerIndex = 0;
    let gameOver = false;

    while (!gameOver) {
        const currentPlayer = players[currentPlayerIndex];
        gameOver = playerTurn(currentPlayer, board);
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    }
};

playGame();

/* advanced tactics: 
    if some of player's pieces can eat another player's piece it it will
    if player can move some of their piece out of the reach of another player's piece it will
    if player can move some of their piece to the end of the board it will
    if another player's piece has passed the player's base, the player should move their piece onto the board (when rolling 6)
     

*/
