const basePosition = -1; // Represents the "base" position
const totalPositions = 28;
const numberOfPlayers = 4;
const sequenceStartIncrements = 7; // Increment starting position for each player by 7
const piecesPerPlayer = 4; // Each player has four pieces

// Generate dynamic movement sequences for each player
const generateMovementSequence = (startPosition: number) => {
    let sequence = [];
    for (let i = 0; i < totalPositions; i++) {
        sequence.push(((startPosition + i - 1) % totalPositions) + 1);
    }
    return sequence;
};

const rollDice = () => Math.floor(Math.random() * 6) + 1;

interface IPlayer {
    positions: number[];
    laps: number[];
    movements: number[];
    sequence: number[];
    finishPositions: number[];
    piecesFinished: (number | null)[];
    activePieceIndex: number;
}

// Initialize players with their respective sequences and finish management
const players: IPlayer[] = Array.from({ length: numberOfPlayers }, (_, i) => ({
    positions: Array(piecesPerPlayer).fill(basePosition),
    laps: Array(piecesPerPlayer).fill(0),
    movements: [],
    sequence: generateMovementSequence(1 + i * sequenceStartIncrements),
    finishPositions: [],
    piecesFinished: Array(4).fill(null), // Null indicates the spot is not occupied
    activePieceIndex: 0,
}));

// Set finish positions for each player as the first 4 of their sequence
players.forEach((player) => {
    player.finishPositions = player.sequence.slice(0, 4);
});

let currentPlayerIndex = Math.floor(Math.random() * players.length); // Select a random starting player
console.log(`Player ${currentPlayerIndex + 1} starts the game!`);

let gameOver = false;

while (!gameOver) {
    const player = players[currentPlayerIndex];
    const activePieceIndex = player.activePieceIndex; // Use the actively tracked piece index
    const diceRoll = rollDice();

    if (player.positions[activePieceIndex] === basePosition) {
        if (diceRoll === 6) {
            player.positions[activePieceIndex] = 0; // Move from base to start of sequence
        }
    } else {
        let nextPosition =
            (player.positions[activePieceIndex] + diceRoll) %
            player.sequence.length;

        if (nextPosition < player.positions[activePieceIndex]) {
            player.laps[activePieceIndex]++;
        }

        const newPositionValue = player.sequence[nextPosition];
        const finishIndex = player.finishPositions.indexOf(newPositionValue);

        if (
            finishIndex !== -1 &&
            player.laps[activePieceIndex] > 0 &&
            player.piecesFinished[finishIndex] === null
        ) {
            player.positions[activePieceIndex] = nextPosition; // Move piece to finish position
            player.piecesFinished[finishIndex] = activePieceIndex + 1; // Mark the piece number in the finish spot
            console.log(
                `Player ${currentPlayerIndex + 1} landed piece ${
                    activePieceIndex + 1
                } on finish position ${newPositionValue}.`
            );

            if (player.piecesFinished.every((x) => x !== null)) {
                // Check if all finish positions are filled
                gameOver = true;
                console.log(
                    `Game over! Player ${
                        currentPlayerIndex + 1
                    } wins by finishing all pieces.`
                );
            } else if (activePieceIndex < piecesPerPlayer - 1) {
                player.activePieceIndex++; // Activate the next piece
            }
        } else if (
            finishIndex !== -1 &&
            player.piecesFinished[finishIndex] !== null
        ) {
            console.log(
                `Finish position ${newPositionValue} already occupied by piece ${player.piecesFinished[finishIndex]}.`
            );
        } else {
            player.positions[activePieceIndex] = nextPosition;
        }
    }

    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
}

if (gameOver) {
    console.log("Final positions of all pieces:");
    players.forEach((player, idx) => {
        console.log(`Player ${idx + 1}:`);
        player.positions.forEach((position, pieceIndex) => {
            const posLabel =
                position === basePosition
                    ? "Base"
                    : `Position ${player.sequence[position]}`;
            console.log(`  Piece ${pieceIndex + 1}: ${posLabel}`);
        });
    });

    console.log("Finish positions of all pieces:");
    players.forEach((player, idx) => {
        console.log(`Player ${idx + 1}:`);
        player.piecesFinished.forEach((position, pieceIndex) => {
            const posLabel =
                position === null
                    ? "Not finished"
                    : `Finished at position ${
                          player.finishPositions[position - 1]
                      }`;
            console.log(`  Piece ${pieceIndex + 1}: ${posLabel}`);
        });
    });
}
