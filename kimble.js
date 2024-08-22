"use strict";
let turns = [];
const players = [
    {
        name: "blue",
        finishedPieces: [],
        piecesInBase: [
            { name: "blue-1", distanceMoved: 0 },
            { name: "blue-2", distanceMoved: 0 },
            { name: "blue-3", distanceMoved: 0 },
            { name: "blue-4", distanceMoved: 0 },
        ],
        diceRollsCount: 0,
        firstPositionOnBoard: 0,
        finishPositions: [0, 1, 2, 3],
        overFinishAreaPositions: [4, 5, 6],
    },
    {
        name: "yellow",
        finishedPieces: [],
        piecesInBase: [
            { name: "yellow-1", distanceMoved: 0 },
            { name: "yellow-2", distanceMoved: 0 },
            { name: "yellow-3", distanceMoved: 0 },
            { name: "yellow-4", distanceMoved: 0 },
        ],
        diceRollsCount: 0,
        firstPositionOnBoard: 7,
        finishPositions: [7, 8, 9, 10],
        overFinishAreaPositions: [11, 12, 13],
    },
    {
        name: "green",
        finishedPieces: [],
        piecesInBase: [
            { name: "green-1", distanceMoved: 0 },
            { name: "green-2", distanceMoved: 0 },
            { name: "green-3", distanceMoved: 0 },
            { name: "green-4", distanceMoved: 0 },
        ],
        diceRollsCount: 0,
        firstPositionOnBoard: 14,
        finishPositions: [14, 15, 16, 17],
        overFinishAreaPositions: [18, 19, 20],
    },
    {
        name: "red",
        finishedPieces: [],
        piecesInBase: [
            { name: "red-1", distanceMoved: 0 },
            { name: "red-2", distanceMoved: 0 },
            { name: "red-3", distanceMoved: 0 },
            { name: "red-4", distanceMoved: 0 },
        ],
        diceRollsCount: 0,
        firstPositionOnBoard: 21,
        finishPositions: [21, 22, 23, 24],
        overFinishAreaPositions: [25, 26, 27],
    },
];
const play = () => {
    let gameOver = false;
    const boardLength = 28;
    const gameBoard = Array.from({ length: boardLength }, (_, i) => null);
    const startingPlayerIndex = Math.floor(Math.random() * players.length);
    const playerTurnsOrder = players
        .slice(startingPlayerIndex)
        .concat(players.slice(0, startingPlayerIndex));
    const handleCollision = (newPosition) => {
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
    const movePiece = (player, diceRoll) => {
        const playersPiecesOnGameBoard = gameBoard.filter((v, i) => {
            return v && v.name.startsWith(player.name);
        });
        if (!playersPiecesOnGameBoard &&
            player.piecesInBase.length > 0 &&
            diceRoll !== 6) {
            // No piece on the board and the player has pieces in the base but didn't roll a 6, so can't move any piece
            console.log(`Player ${player.name} has no pieces on the board and is trying to get a 6 to move a piece out of the base`);
            console.log("player.piecesInBase", player.piecesInBase);
            console.log("player.finishedPieces", player.finishedPieces);
            return;
        }
        const isPieceCloseToFinish = (playersPieceOnGameBoard) => playersPieceOnGameBoard.distanceMoved > 20;
        const isPieceGoingToFinishArea = (playersPieceOnGameBoard, newPosition) => isPieceCloseToFinish(playersPieceOnGameBoard) &&
            player.finishPositions.includes(newPosition);
        const isPieceGoingOverFinishArea = (playersPieceOnGameBoard, newPosition) => isPieceCloseToFinish(playersPieceOnGameBoard) &&
            !player.finishPositions.includes(newPosition) &&
            player.overFinishAreaPositions.includes(newPosition);
        const getPieceIndex = (playersPieceToMove) => gameBoard.findIndex((piece) => piece && piece.name === playersPieceToMove.name);
        const getNewPosition = (playersPieceIndex, diceRoll) => (playersPieceIndex + diceRoll) % boardLength;
        const playersOwnPieceIsOnFirstPosition = (player) => gameBoard[player.firstPositionOnBoard] &&
            gameBoard[player.firstPositionOnBoard].name.startsWith(player.name);
        // Priority 1 - Piece that can reach the finish area
        const piecesThatWouldReachFinishArea = playersPiecesOnGameBoard.filter((piece, i) => {
            console.log("newPosition", piece && getNewPosition(getPieceIndex(piece), diceRoll));
            return (piece &&
                isPieceGoingToFinishArea(piece, getNewPosition(getPieceIndex(piece), diceRoll)));
        });
        console.log("piecesThatWouldReachFinishArea", piecesThatWouldReachFinishArea);
        if (piecesThatWouldReachFinishArea.length > 0) {
            const pieceToMove = piecesThatWouldReachFinishArea[0];
            if (!pieceToMove) {
                console.log("No piece to move even though it should be able to reach the finish area");
                return;
            }
            console.log(`Moving ${pieceToMove.name} to finish area`);
            gameBoard[getPieceIndex(pieceToMove)] = null;
            player.finishedPieces.push(pieceToMove);
            pieceToMove.distanceMoved += diceRoll;
            if (player.finishedPieces.length === 4) {
                gameOver = true;
                return;
            }
            return;
        }
        // Priority 2 - Piece that is at the player's first position on the board
        const pieceIndexOnPlayersFirstPosition = gameBoard.findIndex((piece) => piece &&
            piece.name.startsWith(player.name) &&
            piece.distanceMoved === 0);
        if (pieceIndexOnPlayersFirstPosition &&
            pieceIndexOnPlayersFirstPosition === player.firstPositionOnBoard) {
            const pieceToMove = gameBoard[pieceIndexOnPlayersFirstPosition];
            if (!pieceToMove) {
                console.log("No piece to move even though it should be at the player's first position on the board");
                return;
            }
            const newPosition = getNewPosition(pieceIndexOnPlayersFirstPosition, diceRoll);
            console.log(`Player is moving piece ${pieceToMove.name} from the first position on the board to ${newPosition}`);
            handleCollision(newPosition);
            gameBoard[pieceIndexOnPlayersFirstPosition] = null;
            gameBoard[newPosition] = pieceToMove;
            pieceToMove.distanceMoved += diceRoll;
            return;
        }
        // Priority 3 - Piece that is in the base and the dice roll is 6
        if (diceRoll === 6 &&
            player.piecesInBase.length > 0 &&
            !playersOwnPieceIsOnFirstPosition(player)) {
            console.log(`Player ${player.name} rolled a 6 and is moving a piece out of the base to ${player.firstPositionOnBoard}`);
            const pieceToMove = player.piecesInBase.shift();
            if (!pieceToMove) {
                console.log(`No piece to move even though the player has pieces in the base, 
                    rolled a 6 and doesn't have a piece on the first position on the board`);
                return;
            }
            handleCollision(player.firstPositionOnBoard);
            gameBoard[player.firstPositionOnBoard] = pieceToMove;
            return;
        }
        // Priority 4 - Piece that is furthest on the board
        const pieceFurthestOnTheBoard = playersPiecesOnGameBoard.reduce((acc, curr, i) => {
            if (!curr) {
                return acc;
            }
            if (!acc) {
                return curr;
            }
            if (curr.distanceMoved >= 22 && curr.distanceMoved < 35) {
                console.log(`acc ${acc} curr ${curr}`);
                console.log("player.finishPositions", player.finishPositions);
                console.log("player.overFinishAreaPositions", player.overFinishAreaPositions);
                console.log("getNewPosition(getPieceIndex(curr!), diceRoll)", getNewPosition(getPieceIndex(curr), diceRoll));
                console.log("isPieceGoingOverFinishArea(curr!, getNewPosition(getPieceIndex(curr!), diceRoll))", isPieceGoingOverFinishArea(curr, getNewPosition(getPieceIndex(curr), diceRoll)));
            }
            if (isPieceGoingOverFinishArea(curr, getNewPosition(getPieceIndex(curr), diceRoll))) {
                console.log(`${curr.name} is going over the finish area so me move the next furthest piece:`);
                return acc;
            }
            return acc.distanceMoved > curr.distanceMoved ? acc : curr;
        }, null);
        console.log("pieceFurthestOnTheBoard", pieceFurthestOnTheBoard);
        if (pieceFurthestOnTheBoard) {
            const newPosition = getNewPosition(getPieceIndex(pieceFurthestOnTheBoard), diceRoll);
            console.log(`Moving piece ${pieceFurthestOnTheBoard.name} to ${newPosition}`);
            handleCollision(newPosition);
            gameBoard[getPieceIndex(pieceFurthestOnTheBoard)] = null;
            gameBoard[newPosition] = pieceFurthestOnTheBoard;
            pieceFurthestOnTheBoard.distanceMoved += diceRoll;
            return;
        }
    };
    while (!gameOver) {
        for (const player of playerTurnsOrder) {
            const diceRoll = Math.floor(Math.random() * 6) + 1;
            turns.push(player.name);
            console.log(`\n !!!!!${player.name} rolled ${diceRoll}!!!!!!!!`);
            player.diceRollsCount += 1;
            movePiece(player, diceRoll);
            console.log(`formatted gameBoard after ${player.name}'s turn`, gameBoard.map((e, i) => ({ i: i, e: e })));
        }
    }
    console.log(players);
    console.log(turns);
};
play();
