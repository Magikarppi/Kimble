"use strict";
const basePosition = -1;
const totalPositions = 28;
const numberOfPlayers = 4;
const sequenceStartIncrements = 7;
const piecesPerPlayer = 4;
// Generate dynamic movement sequences for each player
const generateMovementSequence = (startPosition) => {
    let sequence = [];
    for (let i = 0; i < totalPositions; i++) {
        sequence.push(((startPosition + i - 1) % totalPositions) + 1);
    }
    return sequence;
};
const rollDice = () => Math.floor(Math.random() * 6) + 1;
// Initialize players with their respective sequences and finish management
const players = Array.from({ length: numberOfPlayers }, (_, i) => ({
    positions: Array(piecesPerPlayer).fill(basePosition),
    sequence: generateMovementSequence(1 + i * sequenceStartIncrements),
    finishPositions: [],
    piecesDistanceMoved: Array(piecesPerPlayer).fill(0),
    piecesFinished: Array(piecesPerPlayer).fill(null),
    activePieceIndex: 0,
}));
// Set finish positions for each player as the first 4 of their sequence
players.forEach((player) => {
    player.finishPositions = player.sequence.slice(0, 4);
});
// Function to find which player and piece are at a given position, excluding finished pieces
const findPlayerAndPieceAtPosition = (position) => {
    for (let i = 0; i < numberOfPlayers; i++) {
        const player = players[i];
        for (let pieceIndex = 0; pieceIndex < piecesPerPlayer; pieceIndex++) {
            if (player.positions[pieceIndex] === position &&
                player.piecesFinished[pieceIndex] === null) {
                return { playerIndex: i, pieceIndex };
            }
        }
    }
    return { playerIndex: -1, pieceIndex: -1 };
};
let currentPlayerIndex = Math.floor(Math.random() * players.length); // Select a random starting player
console.log(`Player ${currentPlayerIndex + 1} starts the game!`);
let gameOver = false;
while (!gameOver) {
    const player = players[currentPlayerIndex];
    const activePieceIndex = player.activePieceIndex;
    const diceRoll = rollDice();
    if (player.positions[activePieceIndex] === basePosition) {
        if (diceRoll === 6) {
            player.positions[activePieceIndex] = 0; // Move from base to start of sequence
            player.piecesDistanceMoved[activePieceIndex]++;
        }
    }
    else {
        let nextPosition = (player.positions[activePieceIndex] + diceRoll) %
            player.sequence.length;
        const newPositionValue = player.sequence[nextPosition];
        const finishIndex = player.finishPositions.indexOf(newPositionValue);
        // Check if the new position is occupied by another player's piece
        const { playerIndex: occupiedPlayerIndex, pieceIndex: occupiedPieceIndex, } = findPlayerAndPieceAtPosition(newPositionValue);
        if (occupiedPlayerIndex !== -1) {
            // Move the occupied piece back to base
            const occupiedPlayer = players[occupiedPlayerIndex];
            occupiedPlayer.positions[occupiedPieceIndex] = basePosition;
            occupiedPlayer.piecesDistanceMoved[occupiedPieceIndex] = 0;
            console.log(`Player ${currentPlayerIndex + 1} sent Player ${occupiedPlayerIndex + 1}'s piece ${occupiedPieceIndex + 1} back to base.`);
        }
        if (finishIndex !== -1 &&
            player.piecesDistanceMoved[activePieceIndex] > 20 &&
            player.piecesFinished[finishIndex] === null) {
            player.positions[activePieceIndex] = nextPosition; // Move piece to finish position
            player.piecesFinished[finishIndex] = activePieceIndex + 1; // Mark the piece number in the finish spot
            player.piecesDistanceMoved[activePieceIndex]++;
            console.log(`Player ${currentPlayerIndex + 1} landed piece ${activePieceIndex + 1} on finish position ${newPositionValue}.`);
            if (player.piecesFinished.every((x) => x !== null)) {
                // Check if all finish positions are filled
                gameOver = true;
                console.log(`Game over! Player ${currentPlayerIndex + 1} wins by finishing all pieces.`);
            }
            else if (activePieceIndex < piecesPerPlayer - 1) {
                player.activePieceIndex++; // Activate the next piece
            }
        }
        else if (finishIndex !== -1 &&
            player.piecesFinished[finishIndex] !== null) {
            console.log(`Finish position ${newPositionValue} already occupied by piece ${player.piecesFinished[finishIndex]}.`);
        }
        else if (player.piecesDistanceMoved[activePieceIndex] > 20 &&
            player.sequence.slice(4, 6).includes(newPositionValue)) {
            console.log(`Player ${currentPlayerIndex + 1} cannot move piece ${activePieceIndex + 1} to position ${newPositionValue} because that would "go over the board".`);
        }
        else {
            player.positions[activePieceIndex] = nextPosition;
            player.piecesDistanceMoved[activePieceIndex]++;
        }
    }
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
}
if (gameOver) {
    console.log("Final positions of all pieces:");
    players.forEach((player, idx) => {
        console.log(`Player ${idx + 1}:`);
        player.positions.forEach((position, pieceIndex) => {
            const posLabel = position === basePosition
                ? "Base"
                : `Position ${player.sequence[position]}`;
            console.log(`  Piece ${pieceIndex + 1}: ${posLabel}`);
        });
    });
    console.log("Finish positions of all pieces:");
    players.forEach((player, idx) => {
        console.log(`Player ${idx + 1}:`);
        player.piecesFinished.forEach((position, pieceIndex) => {
            const posLabel = position === null
                ? "Not finished"
                : `Finished at position ${player.finishPositions[position - 1]}`;
            console.log(`  Piece ${pieceIndex + 1}: ${posLabel}`);
        });
    });
    console.log("Total distance moved by each piece:");
    players.forEach((player, idx) => {
        console.log(`Player ${idx + 1}:`);
        player.piecesDistanceMoved.forEach((distance, pieceIndex) => {
            console.log(`  Piece ${pieceIndex + 1}: ${distance}`);
        });
    });
}
