import { IGameBoard, IPlayer, IPiece } from "../types";

export const noPieceOnBoardAndNoSixRolled = (
    playersPiecesOnGameBoard: IGameBoard,
    player: IPlayer,
    diceRoll: number
) =>
    !playersPiecesOnGameBoard &&
    player.piecesInBase.length > 0 &&
    diceRoll !== 6;

export const isCollidingWithOwnPiece = (
    gameBoard: IGameBoard,
    player: IPlayer,
    newPosition: number
) => {
    const pieceAtNewPosition = gameBoard[newPosition];
    return (
        pieceAtNewPosition && pieceAtNewPosition.name.startsWith(player.name)
    );
};

export const isPieceCloseToFinish = (piece: IPiece) => piece.distanceMoved > 20;

export const isPieceGoingToFinishArea = (
    piece: IPiece,
    player: IPlayer,
    newPosition: number
) =>
    isPieceCloseToFinish(piece) &&
    player.freeFinishPositions.includes(newPosition);

export const isPieceGoingOverFinishArea = (
    piece: IPiece,
    player: IPlayer,
    newPosition: number
) =>
    isPieceCloseToFinish(piece) &&
    !player.freeFinishPositions.includes(newPosition) &&
    player.overFinishAreaPositions.includes(newPosition);

export const isPieceGoingToReservedFinishPosition = (
    piece: IPiece,
    player: IPlayer,
    newPosition: number
) =>
    isPieceCloseToFinish(piece) &&
    player.resrvedFinishPositions.includes(newPosition);

export const hasPlayerFinishedAllPieces = (player: IPlayer) =>
    player.finishedPieces.length === 4;
