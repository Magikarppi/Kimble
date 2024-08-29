import {
    noPieceOnBoardAndNoSixRolled,
    hasPlayerFinishedAllPieces,
} from "./helpers/checkHelpers";
import {
    createGameBoard,
    createPlayers,
    getAverage,
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
    getPlayersPieceFurtherstOnGameBoardThatCanMove,
} from "./helpers/movementHelpers";
import { IGameBoard, IPlayer } from "./types";

const diceRollsWhenFirstPlayerIsTheWinner: number[] = [];
const gameIterations = process.argv[2] ? parseInt(process.argv[2]) : 10000;
const isTestEnvironment = process.env.NODE_ENV === "test";

export const play = (
    gameBoard: IGameBoard = createGameBoard(),
    players: IPlayer[] = createPlayers(["blue", "yellow", "green", "red"]),
    playerTurnsOrder: IPlayer[] = getPlayersTurnsOrder(players),
    diceRolls?: number[]
): { winningPlayer: IPlayer; startingPlayer: IPlayer } => {
    let winningPlayer;
    let startingPlayer = playerTurnsOrder[0];
    let gameOver = false;
    let diceRollIndex = 0;

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
            getPlayersPieceFurtherstOnGameBoardThatCanMove(
                gameBoard,
                player,
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
            const diceRoll = diceRolls
                ? diceRolls[diceRollIndex++]
                : rollDice();

            updatePlayersDiceRollCount(player);
            movePiece(player, diceRoll);

            if (hasPlayerFinishedAllPieces(player)) {
                winningPlayer = player;
                gameOver = true;
                break;
            }
        }
    }

    if (!winningPlayer) {
        throw new Error("No winning player found");
    }

    return { winningPlayer, startingPlayer };
};

if (isTestEnvironment) {
    const { winningPlayer } = play();
    console.log("Winner:", winningPlayer);
} else {
    for (let i = 0; i < gameIterations; i++) {
        const { winningPlayer, startingPlayer } = play();
        if (winningPlayer.name === startingPlayer.name) {
            diceRollsWhenFirstPlayerIsTheWinner.push(
                winningPlayer.diceRollsCount
            );
        }
    }

    console.log(
        `Average number of dice rolls when the first player is the winner in ${gameIterations} games:`,
        getAverage(diceRollsWhenFirstPlayerIsTheWinner)
    );
}
