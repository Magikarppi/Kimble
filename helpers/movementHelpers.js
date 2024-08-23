"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayersPieceFurtherstOnGameBoard = exports.getPlayersPieceOnTheFirstPositionThatShouldMove = exports.getPlayersPieceThatWouldReachFinishArea = exports.shouldMoveAPieceFromBase = exports.getPlayersPiecesOnGameBoard = exports.takeFirstPieceFromBase = exports.addPieceToFinishedPieces = exports.removePositionFromFreeFinishPositions = exports.addPositionToReservedFinishPositions = exports.updatePieceDistanceMoved = exports.setPosition = exports.setPositionToNull = exports.getNewPosition = exports.getPieceIndex = void 0;
const consts_1 = require("../consts");
const checkHelpers_1 = require("./checkHelpers");
const getPieceIndex = (gameBoard, playersPieceToMove) => gameBoard.findIndex((piece) => piece && piece.name === playersPieceToMove.name);
exports.getPieceIndex = getPieceIndex;
const getNewPosition = (gameBoard, piece, diceRoll) => {
    const pieceIndex = (0, exports.getPieceIndex)(gameBoard, piece);
    return (pieceIndex + diceRoll) % consts_1.boardLength;
};
exports.getNewPosition = getNewPosition;
const setPositionToNull = (gameBoard, piece) => {
    const pieceIndex = (0, exports.getPieceIndex)(gameBoard, piece);
    gameBoard[pieceIndex] = null;
};
exports.setPositionToNull = setPositionToNull;
const setPosition = (gameBoard, newPosition, piece) => (gameBoard[newPosition] = piece);
exports.setPosition = setPosition;
const updatePieceDistanceMoved = (piece, diceRoll) => (piece.distanceMoved += diceRoll);
exports.updatePieceDistanceMoved = updatePieceDistanceMoved;
const addPositionToReservedFinishPositions = (player, position) => player.resrvedFinishPositions.push(position);
exports.addPositionToReservedFinishPositions = addPositionToReservedFinishPositions;
const removePositionFromFreeFinishPositions = (player, newPosition) => (player.freeFinishPositions = player.freeFinishPositions.filter((pos) => pos !== newPosition));
exports.removePositionFromFreeFinishPositions = removePositionFromFreeFinishPositions;
const addPieceToFinishedPieces = (player, piece) => player.finishedPieces.push(piece);
exports.addPieceToFinishedPieces = addPieceToFinishedPieces;
const takeFirstPieceFromBase = (player) => player.piecesInBase.shift();
exports.takeFirstPieceFromBase = takeFirstPieceFromBase;
const getPlayersPiecesOnGameBoard = (gameBoard, player) => gameBoard.filter((piece) => piece && piece.name.startsWith(player.name));
exports.getPlayersPiecesOnGameBoard = getPlayersPiecesOnGameBoard;
const shouldMoveAPieceFromBase = (gameBoard, player, diceRoll) => diceRoll === 6 &&
    player.piecesInBase.length > 0 &&
    !(0, checkHelpers_1.isCollidingWithOwnPiece)(gameBoard, player, player.firstPositionOnBoard);
exports.shouldMoveAPieceFromBase = shouldMoveAPieceFromBase;
const getPlayersPieceThatWouldReachFinishArea = (playersPiecesOnGameBoard, player, gameBoard, diceRoll) => {
    const piecesThatWouldReachFinishArea = playersPiecesOnGameBoard.filter((piece) => {
        return (piece &&
            (0, checkHelpers_1.isPieceGoingToFinishArea)(piece, player, (0, exports.getNewPosition)(gameBoard, piece, diceRoll)));
    });
    if (piecesThatWouldReachFinishArea.length > 0) {
        const pieceToMove = piecesThatWouldReachFinishArea[0];
        if (!pieceToMove) {
            throw new Error("No piece to move even though the check passed");
        }
        return pieceToMove;
    }
    return null;
};
exports.getPlayersPieceThatWouldReachFinishArea = getPlayersPieceThatWouldReachFinishArea;
const getPlayersPieceOnTheFirstPositionThatShouldMove = (gameBoard, player, diceRoll) => {
    const pieceOnPlayersFirstPosition = gameBoard[player.firstPositionOnBoard];
    if (pieceOnPlayersFirstPosition &&
        pieceOnPlayersFirstPosition.name.startsWith(player.name) &&
        !(0, checkHelpers_1.isCollidingWithOwnPiece)(gameBoard, player, (0, exports.getNewPosition)(gameBoard, pieceOnPlayersFirstPosition, diceRoll))) {
        return pieceOnPlayersFirstPosition;
    }
    return null;
};
exports.getPlayersPieceOnTheFirstPositionThatShouldMove = getPlayersPieceOnTheFirstPositionThatShouldMove;
const getPlayersPieceFurtherstOnGameBoard = (playersPiecesOnGameBoard, player, gameBoard, diceRoll) => playersPiecesOnGameBoard.reduce((furthestPiece, currentPiece) => {
    if (!currentPiece) {
        return furthestPiece;
    }
    if ((0, checkHelpers_1.isPieceGoingToReservedFinishPosition)(currentPiece, player, (0, exports.getNewPosition)(gameBoard, currentPiece, diceRoll))) {
        return furthestPiece;
    }
    if ((0, checkHelpers_1.isPieceGoingOverFinishArea)(currentPiece, player, (0, exports.getNewPosition)(gameBoard, currentPiece, diceRoll))) {
        return furthestPiece;
    }
    if ((0, checkHelpers_1.isCollidingWithOwnPiece)(gameBoard, player, (0, exports.getNewPosition)(gameBoard, currentPiece, diceRoll))) {
        return furthestPiece;
    }
    if (!furthestPiece ||
        furthestPiece.distanceMoved < currentPiece.distanceMoved) {
        return currentPiece;
    }
    return furthestPiece;
}, null);
exports.getPlayersPieceFurtherstOnGameBoard = getPlayersPieceFurtherstOnGameBoard;
