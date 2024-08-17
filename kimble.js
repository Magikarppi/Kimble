"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const boardLength = 28;
const finishLength = 4;
const boardPositions = Array.from({ length: boardLength }, (_, i) => i + 1);
console.log("boardPositions: ", boardPositions);
const createPlayer = (color, startingPosition) => {
    return {
        color,
        pieceOnePositions: [null],
        hasPassedTheBeginning: false,
        startingPosition,
        finishPositions: [
            startingPosition,
            startingPosition + 1,
            startingPosition + 2,
            startingPosition + 3,
        ],
        rollDice: () => Math.floor(Math.random() * 6) + 1,
    };
};
// const boardPositions = Array.from({ length: boardLength }, (_, i) => i + 1);
// const playerOffsets: { [key: string]: number } = {
//     blue: 0,
//     yellow: 7,
//     green: 14,
//     red: 21,
// };
// const finishPositions: { [key: string]: number[] } = {
//     blue: [29, 30, 31, 32],
//     yellow: [],
//     green: Array.from(
//         { length: finishLength },
//         (_, i) => boardLength + i + 1 - playerOffsets.green
//     ),
//     red: Array.from(
//         { length: finishLength },
//         (_, i) => boardLength + i + 1 - playerOffsets.red
//     ),
// };
let gameOver = false;
const movePiece = (player, players) => {
    var _a;
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    const latestPosition = player.pieceOnePositions[player.pieceOnePositions.length - 1];
    console.log(`\n${player.color} rolls a ${diceRoll}!`);
    console.log(`${player.color} pieceOnePositions before: ${player.pieceOnePositions}`);
    if (diceRoll === 6 && latestPosition === null) {
        // Move piece onto the board
        player.pieceOnePositions.push(player.startingPosition);
    }
    else if (latestPosition !== null) {
        let newPosition = (latestPosition + diceRoll) % 28;
        // Wrap around the board
        // if (newPosition > boardLength) {
        //     newPosition -= boardLength;
        // }
        // Check if the new position is occupied by another player's piece
        for (const otherPlayer of players) {
            if (otherPlayer !== player) {
                if ((_a = otherPlayer.pieceOnePositions) === null || _a === void 0 ? void 0 : _a.includes(newPosition)) {
                    // "Eat" the piece and send it back to base
                    otherPlayer.pieceOnePositions.push(null);
                    otherPlayer.hasPassedTheBeginning = false;
                    console.log(`${player.color} eats ${otherPlayer.color}'s piece!`);
                    console.log("otherPlayer.pieceOnePositions: ", otherPlayer.pieceOnePositions);
                }
            }
        }
        if (newPosition > player.startingPosition + 6) {
            player.hasPassedTheBeginning = true;
            console.log(`${player.color} has passed the beginning!`);
        }
        if (player.hasPassedTheBeginning &&
            player.finishPositions.includes(newPosition)) {
            /* TODO: Also Check if the position is occupied by player's other piece (which have not yet been implemented)
            and if so, do not move the piece */
            let isOccupied = false;
            if (!isOccupied) {
                player.pieceOnePositions.push(newPosition);
                console.log(`!!!!${player.color} has reached the end of the board at ${player.pieceOnePositions}!!!!!`);
                console.log(`${player.color} pieceOnePositions: ${player.pieceOnePositions}`);
                console.log(`${player.color} pieceOneMoveCount: ${player.pieceOnePositions.length}`);
                gameOver = true;
            }
        }
        else {
            player.pieceOnePositions.push(newPosition);
            console.log(`${player.color} newPosition: ${player.pieceOnePositions}`);
        }
    }
    console.log(`${player.color} pieceOnePositions after: ${player.pieceOnePositions}`);
};
const playGame = () => {
    const players = [
        { color: "blue", startingPosition: 1 },
        { color: "yellow", startingPosition: 8 },
        { color: "green", startingPosition: 15 },
        { color: "red", startingPosition: 22 },
    ].map((player) => createPlayer(player.color, player.startingPosition));
    console.log("players: ", players);
    let currentPlayerIndex = Math.floor(Math.random() * players.length); // number between 0 and 3
    const playerTurnSequence = [];
    for (let i = 0; i < players.length; i++) {
        playerTurnSequence.push(players[(currentPlayerIndex + i) % players.length].color);
    }
    console.log("playerTurnSequence: ", playerTurnSequence);
    const playerTurns = [];
    while (!gameOver) {
        const currentPlayer = players[currentPlayerIndex];
        playerTurns.push(currentPlayer.color);
        movePiece(currentPlayer, players);
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    }
    console.log("Game Over!");
    console.log("yellow pieceOnePositions: ", players[1].pieceOnePositions);
    console.log("green pieceOnePositions: ", players[2].pieceOnePositions);
    console.log("red pieceOnePositions: ", players[3].pieceOnePositions);
    console.log("blue pieceOnePositions: ", players[0].pieceOnePositions);
    console.log("playerTurns: ", playerTurns);
};
playGame();
