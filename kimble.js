"use strict";
const createPlayer = (name, playerPositionsSequence, isAdvanced) => ({
    name,
    pieceOnePositions: null,
    pieceTwoPositions: null,
    pieceThreePositions: null,
    pieceFourPositions: null,
    isAdvanced,
});
const boardLength = 28;
const boardPositions = Array.from({ length: boardLength }, (_, i) => i);
const offset = 7;
const playerBluePositionsSequence = boardPositions;
const playerRedPositionsSequence = boardPositions.map((position) => (position + offset) % boardLength);
const playerYellowPositionsSequence = boardPositions.map((position) => (position + offset * 2) % boardLength);
const playerGreenPositionsSequence = boardPositions.map((position) => (position + offset * 3) % boardLength);
let gameOver = false;
const movePiece = (player, positionsSequence) => {
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    const finishPosition = positionsSequence[positionsSequence.length - 1];
    if (diceRoll === 6 && player.pieceOnePositions === null) {
        // Move piece onto the board
        player.pieceOnePositions = [positionsSequence[0]];
    }
    else if (player.pieceOnePositions !== null) {
        const latestPosition = player.pieceOnePositions[player.pieceOnePositions.length - 1];
        // Move piece forward
        player.pieceOnePositions.push(latestPosition + diceRoll);
        if (latestPosition + diceRoll > finishPosition) {
            console.log(`${player.name} has reached the end of the board at ${player.pieceOnePositions}`);
            console.log(`${player.name} positionSequence: ${positionsSequence}`);
            console.log(`${player.name} pieceOnePositions: ${player.pieceOnePositions}`);
            gameOver = true;
        }
    }
};
const playerBlue = createPlayer("Blue", playerBluePositionsSequence, false);
const playerRed = createPlayer("Red", playerRedPositionsSequence, false);
const playerYellow = createPlayer("Yellow", playerYellowPositionsSequence, false);
const playerGreen = createPlayer("Green", playerGreenPositionsSequence, false);
while (!gameOver) {
    movePiece(playerBlue, playerBluePositionsSequence);
    movePiece(playerRed, playerRedPositionsSequence);
    movePiece(playerYellow, playerYellowPositionsSequence);
    movePiece(playerGreen, playerGreenPositionsSequence);
}
