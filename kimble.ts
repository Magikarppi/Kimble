interface IPlayer {
    name: string;
    finishedPieces: IPiece[];
    piecesInBase: IPiece[];
    diceRollsCount: number;
    firstPositionOnBoard: number;
    finishPositions: number[];
    overFinishAreaPositions: number[];
}

interface IPiece {
    name: string;
    distanceMoved: number;
}

let gameOver = false;
const boardLength = 28;
const gameBoard: (null | IPiece)[] = Array.from(
    { length: boardLength },
    (_, i) => null
);

const players: IPlayer[] = [
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

// let turnsCompleted = 0;

while (!gameOver) {
    const startingPlayerIndex = Math.floor(Math.random() * players.length);
    const playerTurnsOrder = players
        .slice(startingPlayerIndex)
        .concat(players.slice(0, startingPlayerIndex));

    for (const player of playerTurnsOrder) {
        const diceRoll = Math.floor(Math.random() * 6) + 1;

        console.log(`${player.name} rolled ${diceRoll}`);
        player.diceRollsCount += 1;

        console.log(
            "gameBoard",
            gameBoard.map((e, i) => ({ i: i, e: e }))
        );
        const playersPieceOnGameBoard = gameBoard.find((v, i) => {
            return v && v.name.startsWith(player.name);
        });

        if (!playersPieceOnGameBoard && player.piecesInBase.length === 1) {
            console.log(
                `Player ${player.name} has no pieces on the board and is trying to get a 6 to move the last piece out of the base`
            );
            console.log("player.piecesInBase", player.piecesInBase);
            console.log("player.finishedPieces", player.finishedPieces);
        }

        if (!playersPieceOnGameBoard) {
            if (diceRoll === 6) {
                const pieceToMove = player.piecesInBase.shift();
                if (pieceToMove) {
                    pieceToMove.distanceMoved = 0;
                    gameBoard[player.firstPositionOnBoard] = pieceToMove;
                }
            }
        } else {
            // get the index of the piece on the game board
            const playersPieceIndex = gameBoard.findIndex(
                (piece) => piece && piece.name === playersPieceOnGameBoard.name
            );

            console.log("playersPieceIndex", playersPieceIndex);

            const newPosition = (playersPieceIndex + diceRoll) % boardLength;

            const playersNextSixPositions: number[] = [];

            for (let i = 1; i <= 6; i++) {
                playersNextSixPositions.push(
                    (playersPieceIndex + i) % boardLength
                );
            }

            console.log("playersNextSixPositions", playersNextSixPositions);
            console.log(
                "!player.finishPositions.includes(newPosition)",
                !player.finishPositions.includes(newPosition)
            );
            console.log(
                "playersNextSixPositions.includes(newPosition)",
                playersNextSixPositions.includes(newPosition)
            );

            // const isPieceGoingOverFinishArea =
            //     playersPieceOnGameBoard.distanceMoved > 20 &&
            //     !player.finishPositions.includes(newPosition) &&
            //     player.finishPositions.every((p) =>
            //         playersNextSixPositions.includes(p)
            //     ) &&
            //     playersNextSixPositions.includes(newPosition);

            const isPieceGoingOverFinishArea =
                playersPieceOnGameBoard.distanceMoved > 20 &&
                !player.finishPositions.includes(newPosition) &&
                player.overFinishAreaPositions.includes(newPosition);

            console.log(
                "isPieceGoingOverFinishArea",
                isPieceGoingOverFinishArea
            );
            if (
                playersPieceOnGameBoard.distanceMoved > 20 &&
                player.finishPositions.includes(newPosition)
            ) {
                console.log(
                    `Moving ${playersPieceOnGameBoard.name} to finish area`
                );
                console.log("player.finishPositions", player.finishPositions);
                console.log("newPosition", newPosition);

                // set the current position of the piece to null
                gameBoard[playersPieceIndex] = null;
                playersPieceOnGameBoard.distanceMoved += diceRoll;
                // move the piece to the finish area
                player.finishedPieces.push(playersPieceOnGameBoard);

                console.log("player.finishedPieces", player.finishedPieces);
                if (player.finishedPieces.length === 4) {
                    gameOver = true;
                    break;
                }
            } else if (isPieceGoingOverFinishArea) {
                console.log(
                    `Cannot move ${playersPieceOnGameBoard.name} to position ${newPosition} because it would go over the finish area. MaxPos: ${player.finishPositions[3]}`
                );
            } else {
                // check if the new position is occupied by another player's piece
                const pieceAtNewPosition = gameBoard[newPosition];

                if (pieceAtNewPosition) {
                    const otherPlayer = players.find((p) =>
                        pieceAtNewPosition.name.startsWith(p.name)
                    );
                    if (otherPlayer) {
                        console.log(
                            `Sending ${pieceAtNewPosition.name} back to base`
                        );
                        // send the other player's piece back to base
                        otherPlayer.piecesInBase.push(pieceAtNewPosition);
                        pieceAtNewPosition.distanceMoved = 0;
                        console.log(
                            "otherPlayer.piecesInBase",
                            otherPlayer.piecesInBase
                        );
                    }
                }

                // set the current position of the piece to null
                gameBoard[playersPieceIndex] = null;
                // set the new position of the piece on the game board
                gameBoard[newPosition] = playersPieceOnGameBoard;
                // update the distance moved by the piece
                playersPieceOnGameBoard.distanceMoved += diceRoll;
            }
        }
        // turnsCompleted += 1;
    }
}
console.log(players);
