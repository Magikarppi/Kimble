import { IPlayer } from "../../types";
import { boardLength, createGameBoard, createPlayers } from "../gameHelpers";
import {
    addPieceToFinishedPieces,
    addPositionToReservedFinishPositions,
    getNewPosition,
    getPieceIndex,
    getPlayersPieceFurtherstOnGameBoardThatCanMove,
    getPlayersPieceOnTheFirstPositionThatShouldMove,
    getPlayersPiecesOnGameBoard,
    getPlayersPieceThatWouldReachFinishArea,
    removePositionFromFreeFinishPositions,
    setPosition,
    setPositionToNull,
    shouldMoveAPieceFromBase,
    updatePieceDistanceMoved,
} from "../movementHelpers";

describe("movementHelpers", () => {
    let players: IPlayer[] = createPlayers(["blue", "yellow", "green", "red"]);
    let gameBoard = createGameBoard();
    beforeEach(() => {
        players = createPlayers(["blue", "yellow", "green", "red"]);
        gameBoard = createGameBoard();
    });

    describe("getPieceIndex", () => {
        it("should return the index of the piece in the game board", () => {
            const piece = { name: "blue-1", distanceMoved: 10 };
            gameBoard[9] = piece;
            const pieceIndex = getPieceIndex(gameBoard, piece);
            expect(pieceIndex).toBe(9);
        });

        it("should return -1 if the piece is not in the game board", () => {
            const piece = { name: "blue-1", distanceMoved: 10 };
            const pieceIndex = getPieceIndex(gameBoard, piece);
            expect(pieceIndex).toBe(-1);
        });
    });

    describe("getNewPosition", () => {
        it("should return the new position of the piece", () => {
            const piece = { name: "blue-1", distanceMoved: 10 };
            gameBoard[9] = piece;
            const newPosition = getNewPosition(gameBoard, piece, 5);
            expect(newPosition).toBe(14);
        });

        it("should return the new position of the piece when it goes over the board length", () => {
            const piece = { name: "blue-1", distanceMoved: 10 };
            gameBoard[boardLength - 1] = piece;
            const newPosition = getNewPosition(gameBoard, piece, 2);
            expect(newPosition).toBe(1);
        });
    });

    describe("setPositionToNull", () => {
        it("should set the position of the piece to null", () => {
            const piece = { name: "blue-1", distanceMoved: 10 };
            gameBoard[9] = piece;
            expect(gameBoard[9]).toBe(piece);
            setPositionToNull(gameBoard, piece);
            expect(gameBoard[9]).toBe(null);
        });
    });

    describe("setPosition", () => {
        it("should set the position of the piece to the new position", () => {
            const piece = { name: "blue-1", distanceMoved: 0 };
            setPosition(gameBoard, 9, piece);
            expect(gameBoard[9]).toBe(piece);
        });
    });

    describe("updatePieceDistanceMoved", () => {
        it("should update the distance moved of the piece", () => {
            const piece = { name: "blue-1", distanceMoved: 0 };
            updatePieceDistanceMoved(piece, 5);
            expect(piece.distanceMoved).toBe(5);
        });
    });

    describe("addPositionToReservedFinishPositions", () => {
        it("should add the new position to the reserved finish positions", () => {
            const player = players[0];
            expect(player.resrvedFinishPositions).toEqual([]);
            addPositionToReservedFinishPositions(player, 5);
            expect(player.resrvedFinishPositions).toEqual([5]);
        });
    });

    describe("removePositionFromFreeFinishPositions", () => {
        it("should remove the position from the free finish positions", () => {
            const player = players[0];
            removePositionFromFreeFinishPositions(player, 0);
            expect(player.freeFinishPositions).toEqual([1, 2, 3]);
        });
    });

    describe("addPieceToFinishedPieces", () => {
        it("should add the piece to the finished pieces", () => {
            const player = players[0];
            const piece = { name: "blue-1", distanceMoved: 0 };
            expect(player.finishedPieces).toEqual([]);
            addPieceToFinishedPieces(player, piece);
            expect(player.finishedPieces).toEqual([piece]);
        });
    });

    describe("takeFirstPieceFromBase", () => {
        it("should remove the first piece from the base", () => {
            const player = players[0];
            const piece = player.piecesInBase[0];
            const removedPiece = player.piecesInBase.shift();
            expect(removedPiece).toEqual(piece);
        });
    });

    describe("getPlayersPiecesOnGameBoard", () => {
        it("should return the pieces of the player that are on the game board", () => {
            const player = players[0];
            const piece1 = player.piecesInBase[0];
            const piece2 = player.piecesInBase[1];
            gameBoard[4] = piece1;
            gameBoard[20] = piece2;
            const playersPiecesOnGameBoard = getPlayersPiecesOnGameBoard(
                gameBoard,
                player
            );
            expect(playersPiecesOnGameBoard).toEqual([piece1, piece2]);
        });
    });

    describe("shouldMoveAPieceFromBase", () => {
        it("should return true if the player rolled a 6 and has pieces in the base", () => {
            const player = players[0];
            const shouldMove = shouldMoveAPieceFromBase(gameBoard, player, 6);
            expect(shouldMove).toBe(true);
        });

        it("should return false if the player didn't roll a 6", () => {
            const player = players[0];
            const shouldMove = shouldMoveAPieceFromBase(gameBoard, player, 5);
            expect(shouldMove).toBe(false);
        });

        it("should return false if the player is colliding with its own piece in the first position", () => {
            const player = players[0];
            const pieceInTheWay = player.piecesInBase[0];
            gameBoard[0] = pieceInTheWay;
            const shouldMove = shouldMoveAPieceFromBase(gameBoard, player, 6);
            expect(shouldMove).toBe(false);
        });

        it("should return false if the player doesn't have any pieces in the base", () => {
            const player = players[0];
            player.piecesInBase = [];
            const shouldMove = shouldMoveAPieceFromBase(gameBoard, player, 6);
            expect(shouldMove).toBe(false);
        });
    });

    describe("getPlayersPieceThatWouldReachFinishArea", () => {
        it("should return the piece that would reach the finish area", () => {
            const player = players[0];
            const piece = player.piecesInBase[0];
            piece.distanceMoved = 28;
            gameBoard[boardLength - 1] = piece;
            const playersPiecesOnGameBoard = getPlayersPiecesOnGameBoard(
                gameBoard,
                player
            );

            const playersPieceThatWouldReachFinishArea =
                getPlayersPieceThatWouldReachFinishArea(
                    playersPiecesOnGameBoard,
                    player,
                    gameBoard,
                    1
                );
            expect(playersPieceThatWouldReachFinishArea).toBe(piece);
        });

        it("should return null if the piece wouldn't reach the finish area", () => {
            const player = players[0];
            const piece = player.piecesInBase[0];
            piece.distanceMoved = 22;
            gameBoard[boardLength - 6] = piece;
            const playersPiecesOnGameBoard = getPlayersPiecesOnGameBoard(
                gameBoard,
                player
            );

            const playersPieceThatWouldReachFinishArea =
                getPlayersPieceThatWouldReachFinishArea(
                    playersPiecesOnGameBoard,
                    player,
                    gameBoard,
                    2
                );
            expect(playersPieceThatWouldReachFinishArea).toBe(null);
        });

        describe("getPlayersPieceOnTheFirstPositionThatShouldMove", () => {
            it("should return the piece that is at the player's first position on the board if it is not colliding with own piece", () => {
                const player = players[0];
                const piece = player.piecesInBase[0];
                gameBoard[0] = piece;
                const playersPieceOnTheFirstPositionThatShouldMove =
                    getPlayersPieceOnTheFirstPositionThatShouldMove(
                        gameBoard,
                        player,
                        6
                    );
                expect(playersPieceOnTheFirstPositionThatShouldMove).toBe(
                    piece
                );
            });

            it("should return null if the piece is colliding with own piece", () => {
                const player = players[0];
                const pieceInTheWay = player.piecesInBase[0];
                gameBoard[1] = pieceInTheWay;
                const pieceToMove = player.piecesInBase[1];
                gameBoard[0] = pieceToMove;
                const playersPieceOnTheFirstPositionThatShouldMove =
                    getPlayersPieceOnTheFirstPositionThatShouldMove(
                        gameBoard,
                        player,
                        1
                    );
                expect(playersPieceOnTheFirstPositionThatShouldMove).toBe(null);
            });
        });

        describe("getPlayersPieceFurtherstOnGameBoardThatCanMove", () => {
            it("should return the piece that is furthest on the game board", () => {
                const player = players[0];
                const piece1 = player.piecesInBase[0];
                const piece2 = player.piecesInBase[1];
                const piece3 = player.piecesInBase[2];
                piece1.distanceMoved = 10;
                piece2.distanceMoved = 5;
                piece3.distanceMoved = 28;
                gameBoard[10] = piece1;
                gameBoard[5] = piece2;
                gameBoard[boardLength - 1] = piece3;
                const pieceFurtherst =
                    getPlayersPieceFurtherstOnGameBoardThatCanMove(
                        gameBoard,
                        player,
                        6
                    );
                expect(pieceFurtherst).toBe(piece1);
            });
        });
    });
});
