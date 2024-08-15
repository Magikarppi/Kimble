"use strict";
// const playerOnePositions = { 1: 0, 2: 0, 3: 0, 4: 0 };
// const playerTwoPositions = { 1: 0, 2: 0, 3: 0, 4: 0 };
// const playerThreePositions = { 1: 0, 2: 0, 3: 0, 4: 0 };
// const playerFourPositions = { 1: 0, 2: 0, 3: 0, 4: 0 };
Object.defineProperty(exports, "__esModule", { value: true });
const board_1 = require("./src/board");
const player_1 = require("./src/player");
// const players = [
//     playerOnePositions,
//     playerTwoPositions,
//     playerThreePositions,
//     playerFourPositions,
// ];
// const startingPlayer = Math.floor(Math.random() * 4);
const playerTurn = (player, board) => {
    const diceRoll = player.rollDice();
    if (player.moveCount === 0 && diceRoll !== 6) {
        return false;
    }
    (0, board_1.movePlayer)(board, player, diceRoll);
    if (player.position === board.board.length - 1) {
        console.log(`${player.name} has reached the end of the board!`);
        return true;
    }
    return false;
};
const playGame = () => {
    const board = (0, board_1.createBoard)();
    const players = ["Red", "Green", "Red", "Blue"].map((name) => (0, player_1.createPlayer)(name));
    players.forEach((player) => (0, board_1.addPlayer)(board, player));
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
