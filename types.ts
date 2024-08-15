export interface IPlayer {
    name: string;
    position: number;
    rollDice: () => number;
    moveCount: number;
}

export interface IBoard {
    board: Array<null>;
    players: IPlayer[];
}
