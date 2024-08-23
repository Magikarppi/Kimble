"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("./consts");
const checkHelpers_1 = require("./helpers/checkHelpers");
const gameHelpers_1 = require("./helpers/gameHelpers");
const movementHelpers_1 = require("./helpers/movementHelpers");
const play = () => {
    let winningPlayer;
    let gameOver = false;
    const gameBoard = (0, gameHelpers_1.createGameBoard)();
    const playerTurnsOrder = (0, gameHelpers_1.getPlayersTurnsOrder)(consts_1.players);
    const movePiece = (player, diceRoll) => {
        const playersPiecesOnGameBoard = (0, movementHelpers_1.getPlayersPiecesOnGameBoard)(gameBoard, player);
        if ((0, checkHelpers_1.noPieceOnBoardAndNoSixRolled)(playersPiecesOnGameBoard, player, diceRoll)) {
            // No piece on the board and the player has pieces in the base but didn't roll a 6, so can't move any piece
            return;
        }
        // Priority 1 - Piece that can reach the finish area
        const playersPieceThatWouldReachFinishArea = (0, movementHelpers_1.getPlayersPieceThatWouldReachFinishArea)(playersPiecesOnGameBoard, player, gameBoard, diceRoll);
        if (playersPieceThatWouldReachFinishArea) {
            const newPosition = (0, movementHelpers_1.getNewPosition)(gameBoard, playersPieceThatWouldReachFinishArea, diceRoll);
            (0, movementHelpers_1.addPieceToFinishedPieces)(player, playersPieceThatWouldReachFinishArea);
            (0, movementHelpers_1.removePositionFromFreeFinishPositions)(player, newPosition);
            (0, movementHelpers_1.addPositionToReservedFinishPositions)(player, newPosition);
            (0, movementHelpers_1.updatePieceDistanceMoved)(playersPieceThatWouldReachFinishArea, diceRoll);
            (0, movementHelpers_1.setPositionToNull)(gameBoard, playersPieceThatWouldReachFinishArea);
            if ((0, checkHelpers_1.hasPlayerFinishedAllPieces)(player)) {
                gameOver = true;
                winningPlayer = player;
                return;
            }
            return;
        }
        // Priority 2 - Piece that is at the player's first position on the board
        const playersPieceOnTheFirstPositionThatShouldMove = (0, movementHelpers_1.getPlayersPieceOnTheFirstPositionThatShouldMove)(gameBoard, player, diceRoll);
        if (playersPieceOnTheFirstPositionThatShouldMove) {
            const newPosition = (0, movementHelpers_1.getNewPosition)(gameBoard, playersPieceOnTheFirstPositionThatShouldMove, diceRoll);
            (0, gameHelpers_1.handleCollision)(gameBoard, consts_1.players, newPosition);
            (0, movementHelpers_1.setPositionToNull)(gameBoard, playersPieceOnTheFirstPositionThatShouldMove);
            (0, movementHelpers_1.setPosition)(gameBoard, newPosition, playersPieceOnTheFirstPositionThatShouldMove);
            (0, movementHelpers_1.updatePieceDistanceMoved)(playersPieceOnTheFirstPositionThatShouldMove, diceRoll);
            return;
        }
        // Priority 3 - Piece that is in the base and the dice roll is 6
        if ((0, movementHelpers_1.shouldMoveAPieceFromBase)(gameBoard, player, diceRoll)) {
            const pieceToMove = (0, movementHelpers_1.takeFirstPieceFromBase)(player);
            if (!pieceToMove) {
                throw new Error("No piece to move from the base even though the check passed");
            }
            (0, gameHelpers_1.handleCollision)(gameBoard, consts_1.players, player.firstPositionOnBoard);
            (0, movementHelpers_1.setPosition)(gameBoard, player.firstPositionOnBoard, pieceToMove);
            return;
        }
        // Priority 4 - Piece that is furthest on the board
        const pieceFurthestOnTheBoardThatShouldMove = (0, movementHelpers_1.getPlayersPieceFurtherstOnGameBoard)(playersPiecesOnGameBoard, player, gameBoard, diceRoll);
        if (pieceFurthestOnTheBoardThatShouldMove) {
            const newPosition = (0, movementHelpers_1.getNewPosition)(gameBoard, pieceFurthestOnTheBoardThatShouldMove, diceRoll);
            (0, gameHelpers_1.handleCollision)(gameBoard, consts_1.players, newPosition);
            (0, movementHelpers_1.setPositionToNull)(gameBoard, pieceFurthestOnTheBoardThatShouldMove);
            (0, movementHelpers_1.setPosition)(gameBoard, newPosition, pieceFurthestOnTheBoardThatShouldMove);
            (0, movementHelpers_1.updatePieceDistanceMoved)(pieceFurthestOnTheBoardThatShouldMove, diceRoll);
            return;
        }
    };
    while (!gameOver) {
        for (const player of playerTurnsOrder) {
            const diceRoll = (0, gameHelpers_1.rollDice)();
            (0, gameHelpers_1.updatePlayersDiceRollCount)(player);
            movePiece(player, diceRoll);
        }
    }
    console.log("winningPlayer", winningPlayer);
};
play();
