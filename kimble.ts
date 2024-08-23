import { players } from "./consts";
import {
    addPieceToFinishedPieces,
    addPositionToReservedFinishPositions,
    createGameBoard,
    getNewPosition,
    getPieceIndex,
    getPlayersPieceFurtherstOnGameBoard,
    getPlayersPieceOnTheFirstPositionThatShouldMove,
    getPlayersPiecesOnGameBoard,
    getPlayersPieceThatWouldReachFinishArea,
    getPlayersTurnsOrder,
    handleCollision,
    hasPlayerFinishedAllPieces,
    noPieceOnBoardAndNoSixRolled,
    removePositionFromFreeFinishPositions,
    rollDice,
    setPosition,
    setPositionToNull,
    shouldMoveAPieceFromBase,
    takeFirstPieceFromBase,
    updatePieceDistanceMoved,
    updatePlayersDiceRollCount,
} from "./helpers";
import { IPlayer } from "./types";

const play = () => {
    let gameOver = false;
    const gameBoard = createGameBoard();

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
            console.log(
                `Player ${player.name} has no pieces on the board and is trying to get a 6 to move a piece out of the base`
            );
            console.log("player.piecesInBase", player.piecesInBase);
            console.log("player.finishedPieces", player.finishedPieces);
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

            console.log(
                `Moving ${playersPieceThatWouldReachFinishArea.name} to finish area to position ${newPosition}`
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

            console.log(
                `Player is moving piece ${playersPieceOnTheFirstPositionThatShouldMove.name} from the first position on the board to ${newPosition}`
            );

            handleCollision(gameBoard, players, newPosition);

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
            console.log(
                `Player ${player.name} rolled a 6 and is moving a piece out of the base to ${player.firstPositionOnBoard}`
            );

            const pieceToMove = takeFirstPieceFromBase(player);
            if (!pieceToMove) {
                console.log(
                    `No piece to move even though the player has pieces in the base, 
                    rolled a 6 and doesn't have a piece on the first position on the board`
                );
                return;
            }

            handleCollision(gameBoard, players, player.firstPositionOnBoard);
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
        console.log(
            "pieceFurthestOnTheBoard",
            pieceFurthestOnTheBoardThatShouldMove
        );

        if (pieceFurthestOnTheBoardThatShouldMove) {
            const newPosition = getNewPosition(
                gameBoard,
                pieceFurthestOnTheBoardThatShouldMove,
                diceRoll
            );

            console.log(
                `Moving piece ${pieceFurthestOnTheBoardThatShouldMove.name} to ${newPosition}`
            );

            handleCollision(gameBoard, players, newPosition);

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

            console.log(`\n !!!!!${player.name} rolled ${diceRoll}!!!!!!!!`);
            updatePlayersDiceRollCount(player);

            movePiece(player, diceRoll);

            console.log(
                `formatted gameBoard after ${player.name}'s turn`,
                gameBoard.map((e, i) => ({ i: i, e: e }))
            );
        }
    }
    console.log(players);
    console.log(
        players.map((p) => p.finishedPieces.map((fp) => fp.distanceMoved))
    );
};

play();
