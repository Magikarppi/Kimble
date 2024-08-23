"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayersPieceFurtherstOnGameBoard = exports.getPlayersPieceOnTheFirstPositionThatShouldMove = exports.getPlayersPieceThatWouldReachFinishArea = exports.shouldMoveAPieceFromBase = exports.getPlayersPiecesOnGameBoard = exports.takeFirstPieceFromBase = exports.addPieceToFinishedPieces = exports.removePositionFromFreeFinishPositions = exports.addPositionToReservedFinishPositions = exports.updatePieceDistanceMoved = exports.setPosition = exports.setPositionToNull = exports.getNewPosition = exports.getPieceIndex = exports.hasPlayerFinishedAllPieces = exports.isPieceGoingToReservedFinishPosition = exports.isPieceGoingOverFinishArea = exports.isPieceGoingToFinishArea = exports.isPieceCloseToFinish = exports.isCollidingWithOwnPiece = exports.noPieceOnBoardAndNoSixRolled = exports.handleCollision = exports.updatePlayersDiceRollCount = exports.getPlayersTurnsOrder = exports.rollDice = exports.createGameBoard = void 0;
const boardLength = 28;
const createGameBoard = () => Array.from({ length: boardLength }, (_, i) => null);
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
    console.log(`handleCollision(${newPosition}) pieceAtNewPosition`, pieceAtNewPosition);
    if (pieceAtNewPosition) {
        const otherPlayer = players.find((p) => pieceAtNewPosition.name.startsWith(p.name));
        if (otherPlayer) {
            console.log(`Sending ${pieceAtNewPosition.name} back to base`);
            otherPlayer.piecesInBase.push(pieceAtNewPosition);
            pieceAtNewPosition.distanceMoved = 0;
            console.log("otherPlayer.piecesInBase", otherPlayer.piecesInBase);
        }
    }
};
exports.handleCollision = handleCollision;
const noPieceOnBoardAndNoSixRolled = (playersPiecesOnGameBoard, player, diceRoll) => !playersPiecesOnGameBoard &&
    player.piecesInBase.length > 0 &&
    diceRoll !== 6;
exports.noPieceOnBoardAndNoSixRolled = noPieceOnBoardAndNoSixRolled;
const isCollidingWithOwnPiece = (gameBoard, player, newPosition) => {
    const pieceAtNewPosition = gameBoard[newPosition];
    return (pieceAtNewPosition && pieceAtNewPosition.name.startsWith(player.name));
};
exports.isCollidingWithOwnPiece = isCollidingWithOwnPiece;
const isPieceCloseToFinish = (piece) => piece.distanceMoved > 20;
exports.isPieceCloseToFinish = isPieceCloseToFinish;
const isPieceGoingToFinishArea = (piece, player, newPosition) => (0, exports.isPieceCloseToFinish)(piece) &&
    player.freeFinishPositions.includes(newPosition);
exports.isPieceGoingToFinishArea = isPieceGoingToFinishArea;
const isPieceGoingOverFinishArea = (piece, player, newPosition) => (0, exports.isPieceCloseToFinish)(piece) &&
    !player.freeFinishPositions.includes(newPosition) &&
    player.overFinishAreaPositions.includes(newPosition);
exports.isPieceGoingOverFinishArea = isPieceGoingOverFinishArea;
const isPieceGoingToReservedFinishPosition = (piece, player, newPosition) => (0, exports.isPieceCloseToFinish)(piece) &&
    player.resrvedFinishPositions.includes(newPosition);
exports.isPieceGoingToReservedFinishPosition = isPieceGoingToReservedFinishPosition;
const hasPlayerFinishedAllPieces = (player) => player.finishedPieces.length === 4;
exports.hasPlayerFinishedAllPieces = hasPlayerFinishedAllPieces;
const getPieceIndex = (gameBoard, playersPieceToMove) => gameBoard.findIndex((piece) => piece && piece.name === playersPieceToMove.name);
exports.getPieceIndex = getPieceIndex;
const getNewPosition = (gameBoard, piece, diceRoll) => {
    const pieceIndex = (0, exports.getPieceIndex)(gameBoard, piece);
    return (pieceIndex + diceRoll) % boardLength;
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
    !(0, exports.isCollidingWithOwnPiece)(gameBoard, player, player.firstPositionOnBoard);
exports.shouldMoveAPieceFromBase = shouldMoveAPieceFromBase;
const getPlayersPieceThatWouldReachFinishArea = (playersPiecesOnGameBoard, player, gameBoard, diceRoll) => {
    const piecesThatWouldReachFinishArea = playersPiecesOnGameBoard.filter((piece) => {
        console.log("newPosition", piece && (0, exports.getNewPosition)(gameBoard, piece, diceRoll));
        return (piece &&
            (0, exports.isPieceGoingToFinishArea)(piece, player, (0, exports.getNewPosition)(gameBoard, piece, diceRoll)));
    });
    if (piecesThatWouldReachFinishArea.length > 0) {
        const pieceToMove = piecesThatWouldReachFinishArea[0];
        if (!pieceToMove) {
            console.log("No piece to move even though it should be able to reach the finish area");
            return null;
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
        !(0, exports.isCollidingWithOwnPiece)(gameBoard, player, (0, exports.getNewPosition)(gameBoard, pieceOnPlayersFirstPosition, diceRoll))) {
        if (!pieceOnPlayersFirstPosition) {
            console.log("No piece to move even though it should be at the player's first position on the board");
            return;
        }
        return pieceOnPlayersFirstPosition;
    }
    return null;
};
exports.getPlayersPieceOnTheFirstPositionThatShouldMove = getPlayersPieceOnTheFirstPositionThatShouldMove;
const getPlayersPieceFurtherstOnGameBoard = (playersPiecesOnGameBoard, player, gameBoard, diceRoll) => playersPiecesOnGameBoard.reduce((furthestPiece, currentPiece) => {
    if (!currentPiece) {
        return furthestPiece;
    }
    if ((0, exports.isPieceGoingToReservedFinishPosition)(currentPiece, player, (0, exports.getNewPosition)(gameBoard, currentPiece, diceRoll))) {
        console.log(`${currentPiece.name} is going to a reserved finish position so me move the next furthest piece:`);
        console.log(`${player.name} reserved finish positions: `, player.resrvedFinishPositions);
        return furthestPiece;
    }
    if ((0, exports.isPieceGoingOverFinishArea)(currentPiece, player, (0, exports.getNewPosition)(gameBoard, currentPiece, diceRoll))) {
        console.log(`${currentPiece.name} is going over the finish area so me move the next furthest piece:`);
        return furthestPiece;
    }
    if ((0, exports.isCollidingWithOwnPiece)(gameBoard, player, (0, exports.getNewPosition)(gameBoard, currentPiece, diceRoll))) {
        console.log(`${currentPiece.name} is colliding with own piece so me move the next furthest piece:`);
        return furthestPiece;
    }
    if (!furthestPiece ||
        furthestPiece.distanceMoved < currentPiece.distanceMoved) {
        return currentPiece;
    }
    return furthestPiece;
}, null);
exports.getPlayersPieceFurtherstOnGameBoard = getPlayersPieceFurtherstOnGameBoard;
