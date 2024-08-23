"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCollision = exports.updatePlayersDiceRollCount = exports.getPlayersTurnsOrder = exports.rollDice = exports.createGameBoard = void 0;
const consts_1 = require("../consts");
const createGameBoard = () => Array.from({ length: consts_1.boardLength }, (_, i) => null);
exports.createGameBoard = createGameBoard;
const rollDice = () => Math.floor(Math.random() * 6) + 1;
exports.rollDice = rollDice;
const getPlayersTurnsOrder = (players) => {
    const startingPlayerIndex = Math.floor(Math.random() * players.length);
    return players
        .slice(startingPlayerIndex)
        .concat(players.slice(0, startingPlayerIndex));
};
exports.getPlayersTurnsOrder = getPlayersTurnsOrder;
const updatePlayersDiceRollCount = (player) => player.diceRollsCount++;
exports.updatePlayersDiceRollCount = updatePlayersDiceRollCount;
const handleCollision = (gameBoard, players, newPosition) => {
    const pieceAtNewPosition = gameBoard[newPosition];
    if (pieceAtNewPosition) {
        const otherPlayer = players.find((p) => pieceAtNewPosition.name.startsWith(p.name));
        if (otherPlayer) {
            otherPlayer.piecesInBase.push(pieceAtNewPosition);
            pieceAtNewPosition.distanceMoved = 0;
        }
    }
};
exports.handleCollision = handleCollision;
