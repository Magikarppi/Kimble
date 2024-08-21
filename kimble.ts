const basePosition = -1;
const totalPositions = 28;
const numberOfPlayers = 4;
const sequenceStartIncrements = 7;
const piecesPerPlayer = 4;

// Generate dynamic movement sequences for each player
const generateMovementSequence = (startPosition: number) => {
    let sequence = [];
    for (let i = 0; i < totalPositions; i++) {
        sequence.push((startPosition + i) % totalPositions);
    }
    return sequence;
};

const rollDice = () => Math.floor(Math.random() * 6) + 1;

interface IPlayer {
    positions: number[];
    sequence: number[];
    finishPositions: number[];
    piecesFinished: (number | null)[];
    piecesDistanceMoved: number[];
    activePieceIndex: number;
}

// Initialize a new game
const initializePlayers = (): IPlayer[] => {
    return Array.from({ length: numberOfPlayers }, (_, i) => ({
        positions: Array(piecesPerPlayer).fill(basePosition),
        sequence: generateMovementSequence(i * sequenceStartIncrements),
        finishPositions: [],
        piecesDistanceMoved: Array(piecesPerPlayer).fill(0),
        piecesFinished: Array(piecesPerPlayer).fill(null),
        activePieceIndex: 0,
    }));
};

// Function to find which player and piece are at a given position, excluding finished pieces
const findPlayerAndPieceAtPosition = (position: number, players: IPlayer[]) => {
    console.log("Finding player and piece at position: ", position);
    for (let i = 0; i < numberOfPlayers; i++) {
        const player = players[i];
        console.log("Player: ", player);
        for (let pieceIndex = 0; pieceIndex < piecesPerPlayer; pieceIndex++) {
            // console.log("Piece index: ", pieceIndex);
            // console.log(
            //     "player.positions[pieceIndex]: ",
            //     player.positions[pieceIndex]
            // );
            // console.log(
            //     "player.piecesFinished[pieceIndex]: ",
            //     player.piecesFinished[pieceIndex]
            // );
            if (
                player.positions[pieceIndex] === position &&
                player.piecesFinished[pieceIndex] === null
            ) {
                console.log("Returning player and piece: ", i, pieceIndex);
                return { playerIndex: i, pieceIndex };
            }
        }
    }
    return { playerIndex: -1, pieceIndex: -1 };
};

// Function to simulate a single game
const simulateGame = (): number => {
    const players = initializePlayers();
    players.forEach((player) => {
        player.finishPositions = player.sequence.slice(0, 4);
    });

    console.log("Game started with players: ", players);

    let currentPlayerIndex = Math.floor(Math.random() * players.length);
    let gameOver = false;

    while (!gameOver) {
        const player = players[currentPlayerIndex];
        const activePieceIndex = player.activePieceIndex;
        const diceRoll = rollDice();
        console.log(`Player ${currentPlayerIndex + 1}'s turn!!!!!!!!!!!!!!1`);
        console.log(
            `Player ${currentPlayerIndex + 1} positions before ${
                player.positions
            }.`
        );
        console.log(
            `Player ${currentPlayerIndex + 1} piece distance moved: ${
                player.piecesDistanceMoved[activePieceIndex]
            }.`
        );
        console.log(`Player ${currentPlayerIndex + 1} rolled a ${diceRoll}.`);

        if (player.positions[activePieceIndex] === basePosition) {
            console.log("Player's activePiece is in base position.");
            if (diceRoll === 6) {
                console.log(
                    "Player rolled a 6, moving piece out of base to: ",
                    player.sequence[0]
                );
                player.positions[activePieceIndex] = player.sequence[0];
                player.piecesDistanceMoved[activePieceIndex] = 0;
            }
        } else {
            let nextPosition =
                (player.positions[activePieceIndex] + diceRoll) %
                totalPositions;

            console.log(
                `% Player ${
                    currentPlayerIndex + 1
                } nextPosition: ${nextPosition}.`
            );

            const finishIndex = player.finishPositions.indexOf(nextPosition);
            console.log(
                `Player ${currentPlayerIndex + 1} finishIndex: ${finishIndex}.`
            );

            // Check if the new position is occupied by another player's piece
            const {
                playerIndex: occupiedPlayerIndex,
                pieceIndex: occupiedPieceIndex,
            } = findPlayerAndPieceAtPosition(nextPosition, players);

            if (
                occupiedPlayerIndex !== -1 &&
                occupiedPlayerIndex !== currentPlayerIndex
            ) {
                if (
                    players[occupiedPlayerIndex].piecesFinished[
                        occupiedPieceIndex
                    ] === null
                ) {
                    // Move the occupied piece back to base if it's another player's piece
                    const occupiedPlayer = players[occupiedPlayerIndex];

                    console.log(
                        `Occupied player's positions before: ${occupiedPlayer.positions}.`
                    );
                    occupiedPlayer.positions[occupiedPieceIndex] = basePosition;
                    occupiedPlayer.piecesDistanceMoved[occupiedPieceIndex] = 0;
                    console.log(
                        `Player ${currentPlayerIndex + 1} sent Player ${
                            occupiedPlayerIndex + 1
                        }'s piece ${occupiedPieceIndex + 1} back to base.`
                    );
                    console.log(
                        `Occupied player's positions after: ${occupiedPlayer.positions}.`
                    );
                }
            }

            console.log(
                `Player ${currentPlayerIndex + 1} piece distance moved: ${
                    player.piecesDistanceMoved[activePieceIndex]
                }.`
            );
            console.log(
                `Player ${
                    currentPlayerIndex + 1
                }.piecesFinished[finishIndex]: ${
                    player.piecesFinished[finishIndex]
                }.`
            );

            if (
                finishIndex !== -1 &&
                player.piecesDistanceMoved[activePieceIndex] > 20 &&
                player.piecesFinished[finishIndex] === null
            ) {
                player.positions[activePieceIndex] = nextPosition; // Move piece to finish position
                player.piecesFinished[finishIndex] = activePieceIndex; // Mark the piece number in the finish spot
                player.piecesDistanceMoved[activePieceIndex] += diceRoll;
                console.log(
                    `Player ${currentPlayerIndex + 1} landed piece ${
                        activePieceIndex + 1
                    } on finish position ${nextPosition}.`
                );

                console.log(
                    `Player ${currentPlayerIndex + 1} piecesFinished after: ${
                        player.piecesFinished
                    }.`
                );

                if (player.piecesFinished.every((x) => x !== null)) {
                    gameOver = true;
                    return currentPlayerIndex; // Return the winner's index
                } else if (activePieceIndex < piecesPerPlayer - 1) {
                    player.activePieceIndex++; // Activate the next piece
                }
            } else if (
                finishIndex !== -1 &&
                player.piecesFinished[finishIndex] !== null
            ) {
                console.log(
                    `Finish position ${nextPosition} already occupied by piece ${player.piecesFinished[finishIndex]}.`
                );
            } else if (
                player.piecesDistanceMoved[activePieceIndex] > 20 &&
                player.sequence.slice(4, 6).includes(nextPosition)
            ) {
                console.log(
                    `Player ${currentPlayerIndex + 1} cannot move piece ${
                        activePieceIndex + 1
                    } to position ${nextPosition} because that would "go over the board".`
                );
            } else {
                console.log(
                    `Player ${currentPlayerIndex + 1} moving piece ${
                        activePieceIndex + 1
                    } to position ${nextPosition}.`
                );
                player.positions[activePieceIndex] = nextPosition;
                player.piecesDistanceMoved[activePieceIndex] += diceRoll;
            }
        }

        console.log(
            `Player ${currentPlayerIndex + 1} positions after ${
                player.positions
            }.`
        );

        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    }

    // If game is over, return the index of the winning player
    return currentPlayerIndex;
};

// Track wins for each player
const trackWins = (numberOfGames: number) => {
    const winCounts = Array(numberOfPlayers).fill(0);

    for (let i = 0; i < numberOfGames; i++) {
        const winnerIndex = simulateGame();
        winCounts[winnerIndex]++;
    }

    console.log(
        "Win counts for each player after " + numberOfGames + " games:"
    );
    winCounts.forEach((wins, idx) => {
        console.log(`Player ${idx + 1}: ${wins} wins`);
    });
};

trackWins(process.argv[2] ? parseInt(process.argv[2]) : 1);
