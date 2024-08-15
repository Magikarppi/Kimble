"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.movePlayer = exports.addPlayer = exports.createBoard = void 0;
const createBoard = () => {
    return {
        board: Array(40).fill(null),
        players: [],
    };
};
exports.createBoard = createBoard;
const addPlayer = (board, player) => {
    board.players.push(player);
    player.position = 0;
};
exports.addPlayer = addPlayer;
const movePlayer = (board, player, steps) => {
    player.position = (player.position + steps) % board.board.length;
    player.moveCount++;
};
exports.movePlayer = movePlayer;
