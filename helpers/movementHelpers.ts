import { boardLength } from "../consts";
import { IGameBoard, IPiece, IPlayer } from "../types";
import {
    isCollidingWithOwnPiece,
    isPieceGoingToFinishArea,
    isPieceGoingToReservedFinishPosition,
    isPieceGoingOverFinishArea,
} from "./checkHelpers";

export const getPieceIndex = (
    gameBoard: IGameBoard,
    playersPieceToMove: IPiece
) =>
    gameBoard.findIndex(
        (piece) => piece && piece.name === playersPieceToMove.name
    );

export const getNewPosition = (
    gameBoard: IGameBoard,
    piece: IPiece,
    diceRoll: number
) => {
    const pieceIndex = getPieceIndex(gameBoard, piece);
    return (pieceIndex + diceRoll) % boardLength;
};

export const setPositionToNull = (gameBoard: IGameBoard, piece: IPiece) => {
    const pieceIndex = getPieceIndex(gameBoard, piece);
    gameBoard[pieceIndex] = null;
};
export const setPosition = (
    gameBoard: IGameBoard,
    newPosition: number,
    piece: IPiece
) => (gameBoard[newPosition] = piece);

export const updatePieceDistanceMoved = (piece: IPiece, diceRoll: number) =>
    (piece.distanceMoved += diceRoll);

export const addPositionToReservedFinishPositions = (
    player: IPlayer,
    position: number
) => player.resrvedFinishPositions.push(position);

export const removePositionFromFreeFinishPositions = (
    player: IPlayer,
    newPosition: number
) =>
    (player.freeFinishPositions = player.freeFinishPositions.filter(
        (pos) => pos !== newPosition
    ));

export const addPieceToFinishedPieces = (player: IPlayer, piece: IPiece) =>
    player.finishedPieces.push(piece);

export const takeFirstPieceFromBase = (player: IPlayer) =>
    player.piecesInBase.shift();

export const getPlayersPiecesOnGameBoard = (
    gameBoard: IGameBoard,
    player: IPlayer
) => gameBoard.filter((piece) => piece && piece.name.startsWith(player.name));

export const shouldMoveAPieceFromBase = (
    gameBoard: IGameBoard,
    player: IPlayer,
    diceRoll: number
) =>
    diceRoll === 6 &&
    player.piecesInBase.length > 0 &&
    !isCollidingWithOwnPiece(gameBoard, player, player.firstPositionOnBoard);

export const getPlayersPieceThatWouldReachFinishArea = (
    playersPiecesOnGameBoard: IGameBoard,
    player: IPlayer,
    gameBoard: IGameBoard,
    diceRoll: number
) => {
    const piecesThatWouldReachFinishArea = playersPiecesOnGameBoard.filter(
        (piece) => {
            return (
                piece &&
                isPieceGoingToFinishArea(
                    piece,
                    player,
                    getNewPosition(gameBoard, piece, diceRoll)
                )
            );
        }
    );

    if (piecesThatWouldReachFinishArea.length > 0) {
        const pieceToMove = piecesThatWouldReachFinishArea[0];
        if (!pieceToMove) {
            throw new Error("No piece to move even though the check passed");
        }
        return pieceToMove;
    }
    return null;
};

export const getPlayersPieceOnTheFirstPositionThatShouldMove = (
    gameBoard: IGameBoard,
    player: IPlayer,
    diceRoll: number
) => {
    const pieceOnPlayersFirstPosition = gameBoard[player.firstPositionOnBoard];

    if (
        pieceOnPlayersFirstPosition &&
        pieceOnPlayersFirstPosition.name.startsWith(player.name) &&
        !isCollidingWithOwnPiece(
            gameBoard,
            player,
            getNewPosition(gameBoard, pieceOnPlayersFirstPosition, diceRoll)
        )
    ) {
        return pieceOnPlayersFirstPosition;
    }

    return null;
};

export const getPlayersPieceFurtherstOnGameBoard = (
    playersPiecesOnGameBoard: IGameBoard,
    player: IPlayer,
    gameBoard: IGameBoard,
    diceRoll: number
) =>
    playersPiecesOnGameBoard.reduce((furthestPiece, currentPiece) => {
        if (!currentPiece) {
            return furthestPiece;
        }

        if (
            isPieceGoingToReservedFinishPosition(
                currentPiece,
                player,
                getNewPosition(gameBoard, currentPiece, diceRoll)
            )
        ) {
            return furthestPiece;
        }

        if (
            isPieceGoingOverFinishArea(
                currentPiece,
                player,
                getNewPosition(gameBoard, currentPiece, diceRoll)
            )
        ) {
            return furthestPiece;
        }

        if (
            isCollidingWithOwnPiece(
                gameBoard,
                player,
                getNewPosition(gameBoard, currentPiece, diceRoll)
            )
        ) {
            return furthestPiece;
        }

        if (
            !furthestPiece ||
            furthestPiece.distanceMoved < currentPiece.distanceMoved
        ) {
            return currentPiece;
        }

        return furthestPiece;
    }, null);
