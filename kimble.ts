interface IPlayer {
    name: string;
    finishedPieces: IPiece[];
    piecesInBase: IPiece[];
    diceRollsCount: number;
    firstPositionOnBoard: number;
    freeFinishPositions: number[];
    overFinishAreaPositions: number[];
    resrvedFinishPositions: number[];
}

interface IPiece {
    name: string;
    distanceMoved: number;
}

type IGameBoard = (null | IPiece)[];

const players: IPlayer[] = [
    {
        name: "blue",
        finishedPieces: [],
        piecesInBase: [
            { name: "blue-1", distanceMoved: 0 },
            { name: "blue-2", distanceMoved: 0 },
            { name: "blue-3", distanceMoved: 0 },
            { name: "blue-4", distanceMoved: 0 },
        ],
        diceRollsCount: 0,
        firstPositionOnBoard: 0,
        freeFinishPositions: [0, 1, 2, 3],
        overFinishAreaPositions: [4, 5, 6],
        resrvedFinishPositions: [],
    },
    {
        name: "yellow",
        finishedPieces: [],
        piecesInBase: [
            { name: "yellow-1", distanceMoved: 0 },
            { name: "yellow-2", distanceMoved: 0 },
            { name: "yellow-3", distanceMoved: 0 },
            { name: "yellow-4", distanceMoved: 0 },
        ],
        diceRollsCount: 0,
        firstPositionOnBoard: 7,
        freeFinishPositions: [7, 8, 9, 10],
        overFinishAreaPositions: [11, 12, 13],
        resrvedFinishPositions: [],
    },
    {
        name: "green",
        finishedPieces: [],
        piecesInBase: [
            { name: "green-1", distanceMoved: 0 },
            { name: "green-2", distanceMoved: 0 },
            { name: "green-3", distanceMoved: 0 },
            { name: "green-4", distanceMoved: 0 },
        ],
        diceRollsCount: 0,
        firstPositionOnBoard: 14,
        freeFinishPositions: [14, 15, 16, 17],
        overFinishAreaPositions: [18, 19, 20],
        resrvedFinishPositions: [],
    },
    {
        name: "red",
        finishedPieces: [],
        piecesInBase: [
            { name: "red-1", distanceMoved: 0 },
            { name: "red-2", distanceMoved: 0 },
            { name: "red-3", distanceMoved: 0 },
            { name: "red-4", distanceMoved: 0 },
        ],
        diceRollsCount: 0,
        firstPositionOnBoard: 21,
        freeFinishPositions: [21, 22, 23, 24],
        overFinishAreaPositions: [25, 26, 27],
        resrvedFinishPositions: [],
    },
];

const play = () => {
    let gameOver = false;
    const boardLength = 28;
    const gameBoard: IGameBoard = Array.from(
        { length: boardLength },
        (_, i) => null
    );

    const startingPlayerIndex = Math.floor(Math.random() * players.length);
    const playerTurnsOrder = players
        .slice(startingPlayerIndex)
        .concat(players.slice(0, startingPlayerIndex));

    const movePiece = (player: IPlayer, diceRoll: number) => {
        const playersPiecesOnGameBoard = gameBoard.filter((v, i) => {
            return v && v.name.startsWith(player.name);
        });

        if (
            !playersPiecesOnGameBoard &&
            player.piecesInBase.length > 0 &&
            diceRoll !== 6
        ) {
            // No piece on the board and the player has pieces in the base but didn't roll a 6, so can't move any piece
            console.log(
                `Player ${player.name} has no pieces on the board and is trying to get a 6 to move a piece out of the base`
            );
            console.log("player.piecesInBase", player.piecesInBase);
            console.log("player.finishedPieces", player.finishedPieces);
            return;
        }

        const handleCollision = (newPosition: number) => {
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
                    console.log(
                        `Sending ${pieceAtNewPosition.name} back to base`
                    );
                    otherPlayer.piecesInBase.push(pieceAtNewPosition);
                    pieceAtNewPosition.distanceMoved = 0;
                    console.log(
                        "otherPlayer.piecesInBase",
                        otherPlayer.piecesInBase
                    );
                }
            }
        };

        const isCollidingWithOwnPiece = (newPosition: number) => {
            const pieceAtNewPosition = gameBoard[newPosition];
            return (
                pieceAtNewPosition &&
                pieceAtNewPosition.name.startsWith(player.name)
            );
        };

        const isPieceCloseToFinish = (piece: IPiece) =>
            piece.distanceMoved > 20;

        const isPieceGoingToFinishArea = (piece: IPiece, newPosition: number) =>
            isPieceCloseToFinish(piece) &&
            player.freeFinishPositions.includes(newPosition);

        const isPieceGoingOverFinishArea = (
            piece: IPiece,
            newPosition: number
        ) =>
            isPieceCloseToFinish(piece) &&
            !player.freeFinishPositions.includes(newPosition) &&
            player.overFinishAreaPositions.includes(newPosition);

        const isPieceGoingToReservedFinishPosition = (
            piece: IPiece,
            newPosition: number
        ) =>
            isPieceCloseToFinish(piece) &&
            player.resrvedFinishPositions.includes(newPosition);

        const getPieceIndex = (playersPieceToMove: IPiece) =>
            gameBoard.findIndex(
                (piece) => piece && piece.name === playersPieceToMove.name
            );

        const getNewPosition = (playersPieceIndex: number, diceRoll: number) =>
            (playersPieceIndex + diceRoll) % boardLength;

        const setPositionToNull = (pieceIndex: number) =>
            (gameBoard[pieceIndex] = null);

        const setPosition = (newPosition: number, piece: IPiece) =>
            (gameBoard[newPosition] = piece);

        const updatePieceDistanceMoved = (piece: IPiece, diceRoll: number) =>
            (piece.distanceMoved += diceRoll);

        const addPositionToReservedFinishPositions = (position: number) =>
            player.resrvedFinishPositions.push(position);

        const removePositionFromFreeFinishPositions = (newPosition: number) =>
            (player.freeFinishPositions = player.freeFinishPositions.filter(
                (pos) => pos !== newPosition
            ));

        const addPieceToFinishedPieces = (piece: IPiece) =>
            player.finishedPieces.push(piece);

        const takeFirstPieceFromBase = () => player.piecesInBase.shift();

        // Priority 1 - Piece that can reach the finish area
        const piecesThatWouldReachFinishArea = playersPiecesOnGameBoard.filter(
            (piece) => {
                console.log(
                    "newPosition",
                    piece && getNewPosition(getPieceIndex(piece), diceRoll)
                );
                return (
                    piece &&
                    isPieceGoingToFinishArea(
                        piece,
                        getNewPosition(getPieceIndex(piece), diceRoll)
                    )
                );
            }
        );
        console.log(
            "piecesThatWouldReachFinishArea",
            piecesThatWouldReachFinishArea
        );
        if (piecesThatWouldReachFinishArea.length > 0) {
            const pieceToMove = piecesThatWouldReachFinishArea[0];
            if (!pieceToMove) {
                console.log(
                    "No piece to move even though it should be able to reach the finish area"
                );
                return;
            }

            const newPosition = getNewPosition(
                getPieceIndex(pieceToMove),
                diceRoll
            );

            console.log(
                `Moving ${pieceToMove.name} to finish area to position ${newPosition}`
            );

            addPieceToFinishedPieces(pieceToMove);
            removePositionFromFreeFinishPositions(newPosition);
            addPositionToReservedFinishPositions(newPosition);

            updatePieceDistanceMoved(pieceToMove, diceRoll);
            setPositionToNull(getPieceIndex(pieceToMove));
            if (player.finishedPieces.length === 4) {
                gameOver = true;
                return;
            }
            return;
        }

        // Priority 2 - Piece that is at the player's first position on the board
        const pieceIndexOnPlayersFirstPosition = gameBoard.findIndex(
            (piece) =>
                piece &&
                piece.name.startsWith(player.name) &&
                piece.distanceMoved === 0
        );
        if (
            pieceIndexOnPlayersFirstPosition &&
            pieceIndexOnPlayersFirstPosition === player.firstPositionOnBoard &&
            !isCollidingWithOwnPiece(
                getNewPosition(pieceIndexOnPlayersFirstPosition, diceRoll)
            )
        ) {
            const pieceToMove = gameBoard[pieceIndexOnPlayersFirstPosition];
            if (!pieceToMove) {
                console.log(
                    "No piece to move even though it should be at the player's first position on the board"
                );
                return;
            }

            const newPosition = getNewPosition(
                pieceIndexOnPlayersFirstPosition,
                diceRoll
            );

            console.log(
                `Player is moving piece ${pieceToMove.name} from the first position on the board to ${newPosition}`
            );

            handleCollision(newPosition);

            setPositionToNull(pieceIndexOnPlayersFirstPosition);
            setPosition(newPosition, pieceToMove);
            updatePieceDistanceMoved(pieceToMove, diceRoll);
            return;
        }

        // Priority 3 - Piece that is in the base and the dice roll is 6
        if (
            diceRoll === 6 &&
            player.piecesInBase.length > 0 &&
            !isCollidingWithOwnPiece(player.firstPositionOnBoard)
        ) {
            console.log(
                `Player ${player.name} rolled a 6 and is moving a piece out of the base to ${player.firstPositionOnBoard}`
            );

            const pieceToMove = takeFirstPieceFromBase();
            if (!pieceToMove) {
                console.log(
                    `No piece to move even though the player has pieces in the base, 
                    rolled a 6 and doesn't have a piece on the first position on the board`
                );
                return;
            }

            handleCollision(player.firstPositionOnBoard);
            setPosition(player.firstPositionOnBoard, pieceToMove);
            return;
        }

        // Priority 4 - Piece that is furthest on the board

        const pieceFurthestOnTheBoard = playersPiecesOnGameBoard.reduce(
            (furthestPiece, currentPiece) => {
                if (!currentPiece) {
                    return furthestPiece;
                }

                if (
                    isPieceGoingToReservedFinishPosition(
                        currentPiece,
                        getNewPosition(getPieceIndex(currentPiece), diceRoll)
                    )
                ) {
                    console.log(
                        `${currentPiece.name} is going to a reserved finish position so me move the next furthest piece:`
                    );
                    console.log(
                        `${player.name} reserved finish positions: `,
                        player.resrvedFinishPositions
                    );
                    return furthestPiece;
                }

                if (
                    isPieceGoingOverFinishArea(
                        currentPiece,
                        getNewPosition(getPieceIndex(currentPiece), diceRoll)
                    )
                ) {
                    console.log(
                        `${currentPiece.name} is going over the finish area so me move the next furthest piece:`
                    );
                    return furthestPiece;
                }

                if (
                    isCollidingWithOwnPiece(
                        getNewPosition(getPieceIndex(currentPiece), diceRoll)
                    )
                ) {
                    console.log(
                        `${currentPiece.name} is colliding with own piece so me move the next furthest piece:`
                    );
                    return furthestPiece;
                }

                if (
                    !furthestPiece ||
                    furthestPiece.distanceMoved < currentPiece.distanceMoved
                ) {
                    return currentPiece;
                }

                return furthestPiece;
            },
            null
        );

        console.log("pieceFurthestOnTheBoard", pieceFurthestOnTheBoard);

        if (pieceFurthestOnTheBoard) {
            const newPosition = getNewPosition(
                getPieceIndex(pieceFurthestOnTheBoard),
                diceRoll
            );

            console.log(
                `Moving piece ${pieceFurthestOnTheBoard.name} to ${newPosition}`
            );

            handleCollision(newPosition);

            setPositionToNull(getPieceIndex(pieceFurthestOnTheBoard));
            setPosition(newPosition, pieceFurthestOnTheBoard);
            updatePieceDistanceMoved(pieceFurthestOnTheBoard, diceRoll);
            return;
        }
    };

    while (!gameOver) {
        for (const player of playerTurnsOrder) {
            const diceRoll = Math.floor(Math.random() * 6) + 1;

            console.log(`\n !!!!!${player.name} rolled ${diceRoll}!!!!!!!!`);
            player.diceRollsCount += 1;

            movePiece(player, diceRoll);

            console.log(
                `formatted gameBoard after ${player.name}'s turn`,
                gameBoard.map((e, i) => ({ i: i, e: e }))
            );
        }
    }
    console.log(players);
    console.log(
        players.map((p) => p.finishedPieces.map((fp) => fp.distanceMoved))
    );
};

play();
