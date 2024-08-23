"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.players = exports.boardLength = void 0;
exports.boardLength = 28;
const freeFinishPositionsLength = 4;
const overFinishAreaPositionsLength = 3;
const playerStartingPositions = {
    blue: 0,
    yellow: 7,
    green: 14,
    red: 21,
};
exports.players = [
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
        freeFinishPositions: Array.from({ length: freeFinishPositionsLength }, (_, i) => i),
        overFinishAreaPositions: Array.from({ length: overFinishAreaPositionsLength }, (_, i) => i + freeFinishPositionsLength),
        resrvedFinishPositions: [],
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
        firstPositionOnBoard: playerStartingPositions.yellow,
        freeFinishPositions: Array.from({ length: freeFinishPositionsLength }, (_, i) => i + playerStartingPositions.yellow),
        overFinishAreaPositions: Array.from({ length: overFinishAreaPositionsLength }, (_, i) => i + playerStartingPositions.yellow + freeFinishPositionsLength),
        resrvedFinishPositions: [],
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
        firstPositionOnBoard: playerStartingPositions.green,
        freeFinishPositions: Array.from({ length: freeFinishPositionsLength }, (_, i) => i + playerStartingPositions.green),
        overFinishAreaPositions: Array.from({ length: overFinishAreaPositionsLength }, (_, i) => i + playerStartingPositions.green + freeFinishPositionsLength),
        resrvedFinishPositions: [],
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
        firstPositionOnBoard: playerStartingPositions.red,
        freeFinishPositions: Array.from({ length: freeFinishPositionsLength }, (_, i) => i + playerStartingPositions.red),
        overFinishAreaPositions: Array.from({ length: overFinishAreaPositionsLength }, (_, i) => i + playerStartingPositions.red + freeFinishPositionsLength),
        resrvedFinishPositions: [],
    },
];
