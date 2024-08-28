import { IPlayer } from "../../types";
import {
    boardLength,
    createGameBoard,
    createPlayers,
    getPlayersTurnsOrder,
    handleCollisionWithOtherPlayer,
    rollDice,
    updatePlayersDiceRollCount,
} from "../gameHelpers";

describe("gameHelpers", () => {
    let players: IPlayer[] = createPlayers(["blue", "yellow", "green", "red"]);

    beforeEach(() => {
        players = createPlayers(["blue", "yellow", "green", "red"]);
    });

    describe("createGameBoard", () => {
        it("should create a game board with the correct length", () => {
            const gameBoard = createGameBoard();
            expect(gameBoard.length).toBe(boardLength);
        });

        it("should create a game board with all null values", () => {
            const gameBoard = createGameBoard();
            expect(gameBoard.every((cell) => cell === null)).toBe(true);
        });
    });

    describe("rollDice", () => {
        it("should return a number between 1 and 6", () => {
            const diceRoll = rollDice();
            expect(diceRoll).toBeGreaterThanOrEqual(1);
            expect(diceRoll).toBeLessThanOrEqual(6);
        });
    });

    describe("getPlayersTurnsOrder", () => {
        it("should return an array with the same length as the players array", () => {
            const playerTurnsOrder = getPlayersTurnsOrder(players);
            expect(playerTurnsOrder.length).toBe(players.length);
        });

        it("should return an array with the same players as the input array", () => {
            const playerTurnsOrder = getPlayersTurnsOrder(players);
            expect(playerTurnsOrder).toEqual(expect.arrayContaining(players));
        });
    });

    describe("updatePlayersDiceRollCount", () => {
        it("should increment the diceRollsCount of the player", () => {
            const player = players[0];
            const initialDiceRollsCount = player.diceRollsCount;
            updatePlayersDiceRollCount(player);
            expect(player.diceRollsCount).toBe(initialDiceRollsCount + 1);
        });
    });

    describe("handleCollisionWithOtherPlayer", () => {
        it("should move the other player's piece to base if there is a collision", () => {
            const gameBoard = createGameBoard();
            const player1 = players[0];
            const piece = player1.piecesInBase.shift();
            piece!.distanceMoved++;
            expect(player1.piecesInBase).not.toContain(piece);
            gameBoard[10] = piece!;
            const newPosition = 10;
            handleCollisionWithOtherPlayer(gameBoard, players, newPosition);
            expect(player1.piecesInBase).toContain(piece);
            expect(piece!.distanceMoved).toBe(0);
        });
    });
});
