import {
    noPieceOnBoardAndNoSixRolled,
    hasPlayerFinishedAllPieces,
} from "./helpers/checkHelpers";
import {
    createGameBoard,
    createPlayers,
    getPlayersTurnsOrder,
    handleCollisionWithOtherPlayer,
    rollDice,
    updatePlayersDiceRollCount,
} from "./helpers/gameHelpers";
import {
    getPlayersPiecesOnGameBoard,
    getPlayersPieceThatWouldReachFinishArea,
    getNewPosition,
    addPieceToFinishedPieces,
    removePositionFromFreeFinishPositions,
    addPositionToReservedFinishPositions,
    updatePieceDistanceMoved,
    setPositionToNull,
    getPlayersPieceOnTheFirstPositionThatShouldMove,
    setPosition,
    shouldMoveAPieceFromBase,
    takeFirstPieceFromBase,
    getPlayersPieceFurtherstOnGameBoard,
} from "./helpers/movementHelpers";
import { IPlayer } from "./types";

const play = () => {
    let winningPlayer;
    let gameOver = false;
    const gameBoard = createGameBoard();
    const players = createPlayers(["blue", "yellow", "green", "red"]);

    const playerTurnsOrder = getPlayersTurnsOrder(players);

    const movePiece = (player: IPlayer, diceRoll: number) => {
        const playersPiecesOnGameBoard = getPlayersPiecesOnGameBoard(
            gameBoard,
            player
        );

        if (
            noPieceOnBoardAndNoSixRolled(
                playersPiecesOnGameBoard,
                player,
                diceRoll
            )
        ) {
            // No piece on the board and the player has pieces in the base but didn't roll a 6, so can't move any piece
            return;
        }

        // Priority 1 - Piece that can reach the finish area
        const playersPieceThatWouldReachFinishArea =
            getPlayersPieceThatWouldReachFinishArea(
                playersPiecesOnGameBoard,
                player,
                gameBoard,
                diceRoll
            );

        if (playersPieceThatWouldReachFinishArea) {
            const newPosition = getNewPosition(
                gameBoard,
                playersPieceThatWouldReachFinishArea,
                diceRoll
            );

            addPieceToFinishedPieces(
                player,
                playersPieceThatWouldReachFinishArea
            );
            removePositionFromFreeFinishPositions(player, newPosition);
            addPositionToReservedFinishPositions(player, newPosition);

            updatePieceDistanceMoved(
                playersPieceThatWouldReachFinishArea,
                diceRoll
            );
            setPositionToNull(gameBoard, playersPieceThatWouldReachFinishArea);

            if (hasPlayerFinishedAllPieces(player)) {
                gameOver = true;
                winningPlayer = player;
                return;
            }
            return;
        }

        // Priority 2 - Piece that is at the player's first position on the board
        const playersPieceOnTheFirstPositionThatShouldMove =
            getPlayersPieceOnTheFirstPositionThatShouldMove(
                gameBoard,
                player,
                diceRoll
            );

        if (playersPieceOnTheFirstPositionThatShouldMove) {
            const newPosition = getNewPosition(
                gameBoard,
                playersPieceOnTheFirstPositionThatShouldMove,
                diceRoll
            );

            handleCollisionWithOtherPlayer(gameBoard, players, newPosition);

            setPositionToNull(
                gameBoard,
                playersPieceOnTheFirstPositionThatShouldMove
            );
            setPosition(
                gameBoard,
                newPosition,
                playersPieceOnTheFirstPositionThatShouldMove
            );
            updatePieceDistanceMoved(
                playersPieceOnTheFirstPositionThatShouldMove,
                diceRoll
            );
            return;
        }

        // Priority 3 - Piece that is in the base and the dice roll is 6
        if (shouldMoveAPieceFromBase(gameBoard, player, diceRoll)) {
            const pieceToMove = takeFirstPieceFromBase(player);
            if (!pieceToMove) {
                throw new Error(
                    "No piece to move from the base even though the check passed"
                );
            }

            handleCollisionWithOtherPlayer(
                gameBoard,
                players,
                player.firstPositionOnBoard
            );
            setPosition(gameBoard, player.firstPositionOnBoard, pieceToMove);
            return;
        }

        // Priority 4 - Piece that is furthest on the board
        const pieceFurthestOnTheBoardThatShouldMove =
            getPlayersPieceFurtherstOnGameBoard(
                playersPiecesOnGameBoard,
                player,
                gameBoard,
                diceRoll
            );

        if (pieceFurthestOnTheBoardThatShouldMove) {
            const newPosition = getNewPosition(
                gameBoard,
                pieceFurthestOnTheBoardThatShouldMove,
                diceRoll
            );

            handleCollisionWithOtherPlayer(gameBoard, players, newPosition);

            setPositionToNull(gameBoard, pieceFurthestOnTheBoardThatShouldMove);
            setPosition(
                gameBoard,
                newPosition,
                pieceFurthestOnTheBoardThatShouldMove
            );
            updatePieceDistanceMoved(
                pieceFurthestOnTheBoardThatShouldMove,
                diceRoll
            );
            return;
        }
    };

    while (!gameOver) {
        for (const player of playerTurnsOrder) {
            const diceRoll = rollDice();
            updatePlayersDiceRollCount(player);
            movePiece(player, diceRoll);
        }
    }

    console.log("winningPlayer", winningPlayer);
};

play();
