import { IPlayer } from "../../types";
import {
    boardLength,
    createGameBoard,
    createPlayers,
    getAverage,
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

    describe("createPlayers", () => {
        it("should create players with the correct length", () => {
            expect(players.length).toBe(4);
        });

        it("should create players with the correct properties", () => {
            const player = players[0];
            expect(player.name).toBe("blue");
            expect(player.finishedPieces.length).toBe(0);
            expect(player.piecesInBase.length).toBe(4);
            expect(player.diceRollsCount).toBe(0);
            expect(player.firstPositionOnBoard).toBe(0);
            expect(player.freeFinishPositions.length).toBe(4);
            expect(player.overFinishAreaPositions.length).toBe(3);
            expect(player.overFinishAreaPositions[0]).toBe(4);
            expect(player.overFinishAreaPositions[1]).toBe(5);
            expect(player.overFinishAreaPositions[2]).toBe(6);
            expect(player.resrvedFinishPositions.length).toBe(0);

            const player2 = players[1];
            expect(player2.name).toBe("yellow");
            expect(player2.finishedPieces.length).toBe(0);
            expect(player2.piecesInBase.length).toBe(4);
            expect(player2.diceRollsCount).toBe(0);
            expect(player2.firstPositionOnBoard).toBe(7);
            expect(player2.freeFinishPositions.length).toBe(4);
            expect(player2.freeFinishPositions[0]).toBe(7);
            expect(player2.freeFinishPositions[1]).toBe(8);
            expect(player2.freeFinishPositions[2]).toBe(9);
            expect(player2.freeFinishPositions[3]).toBe(10);
            expect(player2.overFinishAreaPositions.length).toBe(3);
            expect(player2.overFinishAreaPositions[0]).toBe(11);
            expect(player2.overFinishAreaPositions[1]).toBe(12);
            expect(player2.overFinishAreaPositions[2]).toBe(13);
            expect(player2.resrvedFinishPositions.length).toBe(0);

            const player3 = players[2];
            expect(player3.name).toBe("green");
            expect(player3.finishedPieces.length).toBe(0);
            expect(player3.piecesInBase.length).toBe(4);
            expect(player3.diceRollsCount).toBe(0);
            expect(player3.firstPositionOnBoard).toBe(14);
            expect(player3.freeFinishPositions.length).toBe(4);
            expect(player3.freeFinishPositions[0]).toBe(14);
            expect(player3.freeFinishPositions[1]).toBe(15);
            expect(player3.freeFinishPositions[2]).toBe(16);
            expect(player3.freeFinishPositions[3]).toBe(17);
            expect(player3.overFinishAreaPositions.length).toBe(3);
            expect(player3.overFinishAreaPositions[0]).toBe(18);
            expect(player3.overFinishAreaPositions[1]).toBe(19);
            expect(player3.overFinishAreaPositions[2]).toBe(20);
            expect(player3.resrvedFinishPositions.length).toBe(0);

            const player4 = players[3];
            expect(player4.name).toBe("red");
            expect(player4.finishedPieces.length).toBe(0);
            expect(player4.piecesInBase.length).toBe(4);
            expect(player4.diceRollsCount).toBe(0);
            expect(player4.firstPositionOnBoard).toBe(21);
            expect(player4.freeFinishPositions.length).toBe(4);
            expect(player4.freeFinishPositions[0]).toBe(21);
            expect(player4.freeFinishPositions[1]).toBe(22);
            expect(player4.freeFinishPositions[2]).toBe(23);
            expect(player4.freeFinishPositions[3]).toBe(24);
            expect(player4.overFinishAreaPositions.length).toBe(3);
            expect(player4.overFinishAreaPositions[0]).toBe(25);
            expect(player4.overFinishAreaPositions[1]).toBe(26);
            expect(player4.overFinishAreaPositions[2]).toBe(27);
            expect(player4.resrvedFinishPositions.length).toBe(0);
        });
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

    describe("getAverage", () => {
        it("should return the average of the numbers in the array", () => {
            const numbers = [1, 2, 3, 4, 5];
            const average = getAverage(numbers);
            expect(average).toBe(3);
        });
    });
});
