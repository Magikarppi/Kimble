export interface IPlayer {
    name: string;
    finishedPieces: IPiece[];
    piecesInBase: IPiece[];
    diceRollsCount: number;
    firstPositionOnBoard: number;
    freeFinishPositions: number[];
    overFinishAreaPositions: number[];
    resrvedFinishPositions: number[];
}

export interface IPiece {
    name: string;
    distanceMoved: number;
}

export type IGameBoard = (null | IPiece)[];
