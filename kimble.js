"use strict";
const boardLength = 28;
const finishLength = 4;
const boardPositions = Array.from({ length: boardLength }, (_, i) => i + 1);
const playerOffsets = {
    blue: 0,
    yellow: 7,
    green: 14,
    red: 21,
};
const finishPositions = {
    blue: Array.from({ length: finishLength }, (_, i) => boardLength + i + 1),
    yellow: Array.from({ length: finishLength }, (_, i) => boardLength + i + 1),
    green: Array.from({ length: finishLength }, (_, i) => boardLength + i + 1),
    red: Array.from({ length: finishLength }, (_, i) => boardLength + i + 1),
};
const isPositionOccupied = (position, players, currentPlayer) => {
    var _a, _b, _c, _d;
    for (const player of players) {
        if (player !== currentPlayer) {
            if (((_a = player.pieceOnePositions) === null || _a === void 0 ? void 0 : _a.includes(position)) ||
                ((_b = player.pieceTwoPositions) === null || _b === void 0 ? void 0 : _b.includes(position)) ||
                ((_c = player.pieceThreePositions) === null || _c === void 0 ? void 0 : _c.includes(position)) ||
                ((_d = player.pieceFourPositions) === null || _d === void 0 ? void 0 : _d.includes(position))) {
                return true;
            }
        }
    }
    return false;
};
const movePiece = (player, players) => {
    var _a;
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    if (diceRoll === 6 && player.pieceOnePositions === null) {
        // Move piece onto the board
        player.pieceOnePositions = [playerOffsets[player.color]];
    }
    else if (player.pieceOnePositions !== null) {
        const latestPosition = player.pieceOnePositions[player.pieceOnePositions.length - 1];
        let newPosition = latestPosition + diceRoll;
        // Wrap around the board
        if (newPosition > boardLength) {
            newPosition -= boardLength;
        }
        // Check if the new position is occupied by another player's piece
        if (isPositionOccupied(newPosition, players, player)) {
            // "Eat" the piece and send it back to base
            for (const otherPlayer of players) {
                if (otherPlayer !== player) {
                    if ((_a = otherPlayer.pieceOnePositions) === null || _a === void 0 ? void 0 : _a.includes(newPosition)) {
                        otherPlayer.pieceOnePositions = null;
                    }
                }
            }
        }
        // Move piece forward
        player.pieceOnePositions.push(newPosition);
        // Check if the piece has reached the finish area
        if (finishPositions[player.color].includes(newPosition)) {
            console.log(`${player.name} has reached the end of the board at ${player.pieceOnePositions}`);
            console.log(`${player.name} pieceOnePositions: ${player.pieceOnePositions}`);
            console.log(`${player.name} pieceOneMoveCount: ${player.pieceOnePositions.length}`);
            gameOver = true;
        }
    }
};
let gameOver = false;
const players = [
    {
        name: "Player 1",
        color: "blue",
        pieceOnePositions: null,
        pieceTwoPositions: null,
        pieceThreePositions: null,
        pieceFourPositions: null,
    },
    {
        name: "Player 2",
        color: "yellow",
        pieceOnePositions: null,
        pieceTwoPositions: null,
        pieceThreePositions: null,
        pieceFourPositions: null,
    },
    {
        name: "Player 3",
        color: "green",
        pieceOnePositions: null,
        pieceTwoPositions: null,
        pieceThreePositions: null,
        pieceFourPositions: null,
    },
    {
        name: "Player 4",
        color: "red",
        pieceOnePositions: null,
        pieceTwoPositions: null,
        pieceThreePositions: null,
        pieceFourPositions: null,
    },
];
while (!gameOver) {
    for (const player of players) {
        movePiece(player, players);
    }
}
