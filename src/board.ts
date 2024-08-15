import { IBoard, IPlayer } from "../types";

export const createBoard = () => {
    return {
        board: Array(40).fill(null),
        players: [],
    };
};

export const addPlayer = (board: IBoard, player: IPlayer) => {
    board.players.push(player);
    player.position = 0;
};

export const movePlayer = (board: IBoard, player: IPlayer, steps: number) => {
    player.position = (player.position + steps) % board.board.length;
    player.moveCount++;
};
