"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasPlayerFinishedAllPieces = exports.isPieceGoingToReservedFinishPosition = exports.isPieceGoingOverFinishArea = exports.isPieceGoingToFinishArea = exports.isPieceCloseToFinish = exports.isCollidingWithOwnPiece = exports.noPieceOnBoardAndNoSixRolled = void 0;
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
