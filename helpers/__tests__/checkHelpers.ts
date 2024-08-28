import { IGameBoard, IPlayer } from "../../types";
import {
    hasPlayerFinishedAllPieces,
    isCollidingWithOwnPiece,
    isPieceCloseToFinish,
    isPieceGoingOverFinishArea,
    isPieceGoingToReservedFinishPosition,
    noPieceOnBoardAndNoSixRolled,
} from "../checkHelpers";
import { createPlayers } from "../gameHelpers";

describe("checkHelpers", () => {
    let players: IPlayer[] = createPlayers(["blue", "yellow", "green", "red"]);

    beforeEach(() => {
        players = createPlayers(["blue", "yellow", "green", "red"]);
    });

    describe("noPieceOnBoardAndNoSixRolled", () => {
        it("should return true if player has pieces in base but not on board and player didn't roll a 6", () => {
            const playersPiecesOnGameBoard: IGameBoard = [];
            const player: IPlayer = players[0];
            const diceRoll = 5;
            expect(
                noPieceOnBoardAndNoSixRolled(
                    playersPiecesOnGameBoard,
                    player,
                    diceRoll
                )
            ).toEqual(true);
        });

        it("should return false if player has pieces in base and on board and player didn't roll a 6", () => {
            const playersPiecesOnGameBoard: IGameBoard = [
                players[0].piecesInBase[0],
            ];
            const player: IPlayer = players[0];
            const diceRoll = 5;
            expect(
                noPieceOnBoardAndNoSixRolled(
                    playersPiecesOnGameBoard,
                    player,
                    diceRoll
                )
            ).toEqual(false);
        });

        it("should return false if player has pieces in base but not on board and player rolled a 6", () => {
            const playersPiecesOnGameBoard: IGameBoard = [];
            const player: IPlayer = players[0];
            const diceRoll = 6;
            expect(
                noPieceOnBoardAndNoSixRolled(
                    playersPiecesOnGameBoard,
                    player,
                    diceRoll
                )
            ).toEqual(false);
        });

        it("should return false if player has pieces in base and on board and player rolled a 6", () => {
            const playersPiecesOnGameBoard: IGameBoard = [
                players[0].piecesInBase[0],
            ];
            const player: IPlayer = players[0];
            const diceRoll = 6;
            expect(
                noPieceOnBoardAndNoSixRolled(
                    playersPiecesOnGameBoard,
                    player,
                    diceRoll
                )
            ).toEqual(false);
        });

        it("should return false if player has no pieces in base", () => {
            const playersPiecesOnGameBoard: IGameBoard = [
                players[0].piecesInBase[0],
            ];
            const player: IPlayer = players[0];
            player.piecesInBase = [];
            const diceRoll = 5;
            expect(
                noPieceOnBoardAndNoSixRolled(
                    playersPiecesOnGameBoard,
                    player,
                    diceRoll
                )
            ).toEqual(false);
        });

        it("should return false if player has pieces on board", () => {
            const playersPiecesOnGameBoard: IGameBoard = [
                players[0].piecesInBase[0],
            ];
            const player: IPlayer = players[0];
            const diceRoll = 5;
            expect(
                noPieceOnBoardAndNoSixRolled(
                    playersPiecesOnGameBoard,
                    player,
                    diceRoll
                )
            ).toEqual(false);
        });

        it("should return false if player rolled 6", () => {
            const playersPiecesOnGameBoard: IGameBoard = [];
            const player: IPlayer = players[0];
            const diceRoll = 6;
            expect(
                noPieceOnBoardAndNoSixRolled(
                    playersPiecesOnGameBoard,
                    player,
                    diceRoll
                )
            ).toEqual(false);
        });
    });

    describe("isCollidingWithOwnPiece", () => {
        beforeEach(() => {
            players[0].piecesInBase = [
                { name: "blue-1", distanceMoved: 0 },
                { name: "blue-2", distanceMoved: 0 },
                { name: "blue-3", distanceMoved: 0 },
                { name: "blue-4", distanceMoved: 0 },
            ];
        });

        it("should return false if there is no piece at the new position", () => {
            const gameBoard: IGameBoard = [null, null, null, null];
            const player: IPlayer = players[0];
            const newPosition = 3;
            expect(
                isCollidingWithOwnPiece(gameBoard, player, newPosition)
            ).toEqual(false);
        });

        it("should return true if there is a piece at the new position and it belongs to the player", () => {
            const gameBoard: IGameBoard = [
                null,
                null,
                null,
                players[0].piecesInBase[0],
            ];
            const player: IPlayer = players[0];
            const newPosition = 3;

            expect(
                isCollidingWithOwnPiece(gameBoard, player, newPosition)
            ).toEqual(true);
        });

        it("should return false if there is a piece at the new position but it doesn't belong to the player", () => {
            const gameBoard: IGameBoard = [
                null,
                null,
                null,
                players[1].piecesInBase[0],
            ];
            const player: IPlayer = players[0];
            const newPosition = 3;
            expect(
                isCollidingWithOwnPiece(gameBoard, player, newPosition)
            ).toEqual(false);
        });
    });

    describe("isPieceCloseToFinish", () => {
        it("should return true if piece is close to finish", () => {
            const piece = { name: "blue-1", distanceMoved: 21 };
            expect(isPieceCloseToFinish(piece)).toEqual(true);
        });

        it("should return false if piece is not close to finish", () => {
            const piece = { name: "blue-1", distanceMoved: 20 };
            expect(isPieceCloseToFinish(piece)).toEqual(false);
        });
    });

    describe("isPieceGoingToFinishArea", () => {
        it("should return true if piece is close to finish and going to finish area", () => {
            const piece = { name: "blue-1", distanceMoved: 21 };
            const player = players[0];
            const newPosition = player.freeFinishPositions[0];
            expect(
                isPieceCloseToFinish(piece) &&
                    player.freeFinishPositions.includes(newPosition)
            ).toEqual(true);
        });

        it("should return false if piece is not close to finish", () => {
            const piece = { name: "blue-1", distanceMoved: 20 };
            const player = players[0];
            const newPosition = player.freeFinishPositions[0];
            expect(
                isPieceCloseToFinish(piece) &&
                    player.freeFinishPositions.includes(newPosition)
            ).toEqual(false);
        });

        it("should return false if piece is close to finish but not going to finish area", () => {
            const piece = { name: "blue-1", distanceMoved: 21 };
            const player = players[0];
            const newPosition = player.overFinishAreaPositions[0];
            expect(
                isPieceCloseToFinish(piece) &&
                    player.freeFinishPositions.includes(newPosition)
            ).toEqual(false);
        });
    });

    describe("isPieceGoingOverFinishArea", () => {
        it("should return true if piece is close to finish and going over finish area", () => {
            const piece = { name: "blue-1", distanceMoved: 21 };
            const player = players[0];
            const newPosition = player.overFinishAreaPositions[0];
            expect(
                isPieceGoingOverFinishArea(piece, player, newPosition)
            ).toEqual(true);
        });

        it("should return false if piece is not close to finish", () => {
            const piece = { name: "blue-1", distanceMoved: 1 };
            const player = players[0];
            const newPosition = player.overFinishAreaPositions[0];
            expect(
                isPieceGoingOverFinishArea(piece, player, newPosition)
            ).toEqual(false);
        });

        it("should return false if piece is close to finish but not going over finish area", () => {
            const piece = { name: "blue-1", distanceMoved: 21 };
            const player = players[0];
            const newPosition = player.freeFinishPositions[0];
            expect(
                isPieceGoingOverFinishArea(piece, player, newPosition)
            ).toEqual(false);
        });

        it("should return false if piece is close to finish but not going to finish area", () => {
            const piece = { name: "blue-1", distanceMoved: 21 };
            const player = players[0];
            const newPosition = 25;
            expect(
                isPieceGoingOverFinishArea(piece, player, newPosition)
            ).toEqual(false);
        });
    });

    describe("isPieceGoingToReservedFinishPosition", () => {
        beforeEach(() => {
            players[0].freeFinishPositions = [2, 3];
            players[0].resrvedFinishPositions = [0, 1];
        });

        it("should return true if piece is close to finish and going to reserved finish position", () => {
            const piece = { name: "blue-1", distanceMoved: 21 };
            const player = players[0];
            const newPosition = player.resrvedFinishPositions[0];
            expect(
                isPieceGoingToReservedFinishPosition(piece, player, newPosition)
            ).toEqual(true);
        });

        it("should return false if piece is not close to finish", () => {
            const piece = { name: "blue-1", distanceMoved: 1 };
            const player = players[0];
            const newPosition = player.freeFinishPositions[0];
            expect(
                isPieceGoingToReservedFinishPosition(piece, player, newPosition)
            ).toEqual(false);
        });

        it("should return false if piece is close to finish but not going to reserved finish position", () => {
            const piece = { name: "blue-1", distanceMoved: 21 };
            const player = players[0];
            const newPosition = player.freeFinishPositions[0];
            expect(
                isPieceGoingToReservedFinishPosition(piece, player, newPosition)
            ).toEqual(false);
        });

        it("should return false if piece is close to finish but not going to finish area", () => {
            const piece = { name: "blue-1", distanceMoved: 21 };
            const player = players[0];
            const newPosition = 25;
            expect(
                isPieceGoingToReservedFinishPosition(piece, player, newPosition)
            ).toEqual(false);
        });
    });

    describe("hasPlayerFinishedAllPieces", () => {
        it("should return true if player has finished all pieces", () => {
            const player = {
                ...players[0],
                finishedPieces: [
                    { name: "blue-1", distanceMoved: 30 },
                    { name: "blue-2", distanceMoved: 30 },
                    { name: "blue-3", distanceMoved: 31 },
                    { name: "blue-4", distanceMoved: 29 },
                ],
            };
            expect(hasPlayerFinishedAllPieces(player)).toEqual(true);
        });

        it("should return false if player has not finished all pieces", () => {
            const player = {
                ...players[0],
                finishedPieces: [
                    { name: "blue-2", distanceMoved: 30 },
                    { name: "blue-3", distanceMoved: 31 },
                    { name: "blue-4", distanceMoved: 29 },
                ],
            };
            expect(hasPlayerFinishedAllPieces(player)).toEqual(false);
        });
    });
});
