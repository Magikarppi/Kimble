import { IGameBoard, IPlayer } from "../types";

export const boardLength = 28;

const freeFinishPositionsLength = 4;
const overFinishAreaPositionsLength = 3;

const playerStartingPositions = [0, 7, 14, 21];

export const createGameBoard = (): IGameBoard =>
    Array.from({ length: boardLength }, (_, i) => null);

export const createPlayers = (playerNames: string[]): IPlayer[] => [
    {
        name: playerNames[0],
        finishedPieces: [],
        piecesInBase: [
            { name: `${playerNames[0]}-1`, distanceMoved: 0 },
            { name: `${playerNames[0]}-2`, distanceMoved: 0 },
            { name: `${playerNames[0]}-3`, distanceMoved: 0 },
            { name: `${playerNames[0]}-4`, distanceMoved: 0 },
        ],
        diceRollsCount: 0,
        firstPositionOnBoard: playerStartingPositions[0],
        freeFinishPositions: Array.from(
            { length: freeFinishPositionsLength },
            (_, i) => i
        ),
        overFinishAreaPositions: Array.from(
            { length: overFinishAreaPositionsLength },
            (_, i) => i + freeFinishPositionsLength
        ),
        resrvedFinishPositions: [],
    },
    {
        name: playerNames[1],
        finishedPieces: [],
        piecesInBase: [
            { name: `${playerNames[1]}-1`, distanceMoved: 0 },
            { name: `${playerNames[1]}-2`, distanceMoved: 0 },
            { name: `${playerNames[1]}-3`, distanceMoved: 0 },
            { name: `${playerNames[1]}-4`, distanceMoved: 0 },
        ],
        diceRollsCount: 0,
        firstPositionOnBoard: playerStartingPositions[1],
        freeFinishPositions: Array.from(
            { length: freeFinishPositionsLength },
            (_, i) => i + playerStartingPositions[1]
        ),
        overFinishAreaPositions: Array.from(
            { length: overFinishAreaPositionsLength },
            (_, i) => i + playerStartingPositions[1],
            +freeFinishPositionsLength
        ),
        resrvedFinishPositions: [],
    },
    {
        name: playerNames[2],
        finishedPieces: [],
        piecesInBase: [
            { name: `${playerNames[2]}-1`, distanceMoved: 0 },
            { name: `${playerNames[2]}-2`, distanceMoved: 0 },
            { name: `${playerNames[2]}-3`, distanceMoved: 0 },
            { name: `${playerNames[2]}-4`, distanceMoved: 0 },
        ],
        diceRollsCount: 0,
        firstPositionOnBoard: playerStartingPositions[2],
        freeFinishPositions: Array.from(
            { length: freeFinishPositionsLength },
            (_, i) => i + playerStartingPositions[2]
        ),
        overFinishAreaPositions: Array.from(
            { length: overFinishAreaPositionsLength },
            (_, i) => i + playerStartingPositions[2],
            +freeFinishPositionsLength
        ),
        resrvedFinishPositions: [],
    },
    {
        name: playerNames[3],
        finishedPieces: [],
        piecesInBase: [
            { name: `${playerNames[3]}-1`, distanceMoved: 0 },
            { name: `${playerNames[3]}-2`, distanceMoved: 0 },
            { name: `${playerNames[3]}-3`, distanceMoved: 0 },
            { name: `${playerNames[3]}-4`, distanceMoved: 0 },
        ],
        diceRollsCount: 0,
        firstPositionOnBoard: playerStartingPositions[3],
        freeFinishPositions: Array.from(
            { length: freeFinishPositionsLength },
            (_, i) => i + playerStartingPositions[3]
        ),
        overFinishAreaPositions: Array.from(
            { length: overFinishAreaPositionsLength },
            (_, i) => i + playerStartingPositions[3],
            +freeFinishPositionsLength
        ),
        resrvedFinishPositions: [],
    },
];

export const rollDice = () => Math.floor(Math.random() * 6) + 1;

export const getPlayersTurnsOrder = (players: IPlayer[]) => {
    const startingPlayerIndex = Math.floor(Math.random() * players.length);

    return players
        .slice(startingPlayerIndex)
        .concat(players.slice(0, startingPlayerIndex));
};
export const updatePlayersDiceRollCount = (player: IPlayer) =>
    player.diceRollsCount++;

export const handleCollisionWithOtherPlayer = (
    gameBoard: IGameBoard,
    players: IPlayer[],
    newPosition: number
) => {
    const pieceAtNewPosition = gameBoard[newPosition];

    if (pieceAtNewPosition) {
        const otherPlayer = players.find((p) =>
            pieceAtNewPosition.name.startsWith(p.name)
        );
        if (otherPlayer) {
            otherPlayer.piecesInBase.push(pieceAtNewPosition);
            pieceAtNewPosition.distanceMoved = 0;
        }
    }
};
