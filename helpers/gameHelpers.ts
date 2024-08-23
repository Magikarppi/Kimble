import { boardLength } from "../consts";
import { IGameBoard, IPlayer } from "../types";

export const createGameBoard = (): IGameBoard =>
    Array.from({ length: boardLength }, (_, i) => null);

export const rollDice = () => Math.floor(Math.random() * 6) + 1;

export const getPlayersTurnsOrder = (players: IPlayer[]) => {
    const startingPlayerIndex = Math.floor(Math.random() * players.length);

    return players
        .slice(startingPlayerIndex)
        .concat(players.slice(0, startingPlayerIndex));
};
export const updatePlayersDiceRollCount = (player: IPlayer) =>
    player.diceRollsCount++;

export const handleCollision = (
    gameBoard: IGameBoard,
    players: IPlayer[],
    newPosition: number
) => {
    const pieceAtNewPosition = gameBoard[newPosition];
    console.log(
        `handleCollision(${newPosition}) pieceAtNewPosition`,
        pieceAtNewPosition
    );

    if (pieceAtNewPosition) {
        const otherPlayer = players.find((p) =>
            pieceAtNewPosition.name.startsWith(p.name)
        );
        if (otherPlayer) {
            console.log(`Sending ${pieceAtNewPosition.name} back to base`);
            otherPlayer.piecesInBase.push(pieceAtNewPosition);
            pieceAtNewPosition.distanceMoved = 0;
            console.log("otherPlayer.piecesInBase", otherPlayer.piecesInBase);
        }
    }
};
