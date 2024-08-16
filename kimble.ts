interface Player {
    color: string;
    pieceOnePositions: (number | null)[];
    pieceTwoPositions: (number | null)[];
    pieceThreePositions: (number | null)[];
    pieceFourPositions: (number | null)[];
}

const boardLength = 28;
const finishLength = 4;
const boardPositions = Array.from({ length: boardLength }, (_, i) => i + 1);

const playerOffsets: { [key: string]: number } = {
    blue: 0,
    yellow: 7,
    green: 14,
    red: 21,
};

const finishPositions: { [key: string]: number[] } = {
    blue: Array.from({ length: finishLength }, (_, i) => boardLength + i + 1),
    yellow: Array.from({ length: finishLength }, (_, i) => boardLength + i + 1),
    green: Array.from({ length: finishLength }, (_, i) => boardLength + i + 1),
    red: Array.from({ length: finishLength }, (_, i) => boardLength + i + 1),
};

const players: Player[] = [
    {
        color: "blue",
        pieceOnePositions: [null],
        pieceTwoPositions: [null],
        pieceThreePositions: [null],
        pieceFourPositions: [null],
    },
    {
        color: "yellow",
        pieceOnePositions: [null],
        pieceTwoPositions: [null],
        pieceThreePositions: [null],
        pieceFourPositions: [null],
    },
    {
        color: "green",
        pieceOnePositions: [null],
        pieceTwoPositions: [null],
        pieceThreePositions: [null],
        pieceFourPositions: [null],
    },
    {
        color: "red",
        pieceOnePositions: [null],
        pieceTwoPositions: [null],
        pieceThreePositions: [null],
        pieceFourPositions: [null],
    },
];

const getLatestPosition = (piecePositions: (number | null)[]) =>
    piecePositions[piecePositions.length - 1];

const handleReturnOpponentToBaseIfPositionOccupied = (
    position: number,
    players: Player[],
    currentPlayer: Player
) => {
    for (const player of players) {
        if (player !== currentPlayer) {
            if (getLatestPosition(player.pieceOnePositions) === position) {
                player.pieceOnePositions.push(null);
            }

            if (getLatestPosition(player.pieceTwoPositions) === position) {
                player.pieceTwoPositions.push(null);
            }

            if (getLatestPosition(player.pieceThreePositions) === position) {
                player.pieceThreePositions.push(null);
            }

            if (getLatestPosition(player.pieceFourPositions) === position) {
                player.pieceFourPositions.push(null);
            }
            return;
        }
    }
};

const movePiece = (player: Player, players: Player[]) => {
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    const isPlayersOwnPieceOccupyingPosition = (position: number) => {
        return (
            getLatestPosition(player.pieceOnePositions) === position ||
            getLatestPosition(player.pieceTwoPositions) === position ||
            getLatestPosition(player.pieceThreePositions) === position ||
            getLatestPosition(player.pieceFourPositions) === position
        );
    };

    const playersRandomPiece = Math.floor(Math.random() * 4) + 1;

    if (
        diceRoll === 6 &&
        !isPlayersOwnPieceOccupyingPosition(playerOffsets[player.color] + 1)
    ) {
        console.log(
            "You rolled a 6 and you have no piece in the first position. You get to move a piece onto the board."
        );
        if (getLatestPosition(player.pieceOnePositions) === null) {
            player.pieceOnePositions.push(playerOffsets[player.color] + 1);
            return;
        } else if (getLatestPosition(player.pieceTwoPositions) === null) {
            player.pieceTwoPositions.push(playerOffsets[player.color] + 1);
            return;
        } else if (getLatestPosition(player.pieceThreePositions) === null) {
            player.pieceThreePositions.push(playerOffsets[player.color] + 1);
            return;
        } else if (getLatestPosition(player.pieceFourPositions) === null) {
            player.pieceFourPositions.push(playerOffsets[player.color] + 1);
            return;
        }
    } else if (
        diceRoll === 6 &&
        isPlayersOwnPieceOccupyingPosition(playerOffsets[player.color] + 1)
    ) {
        console.log(
            "You rolled a 6 but you already have a piece in the first position. Some other piece."
        );
        if (
            playersRandomPiece === 1 &&
            getLatestPosition(player.pieceOnePositions) !== null
        ) {
            player.pieceOnePositions.push(
                playerOffsets[player.color] + diceRoll
            );
            return;
        } else if (
            playersRandomPiece === 2 &&
            getLatestPosition(player.pieceTwoPositions) !== null
        ) {
            player.pieceTwoPositions.push(
                playerOffsets[player.color] + diceRoll
            );
            return;
        } else if (
            playersRandomPiece === 3 &&
            getLatestPosition(player.pieceThreePositions) !== null
        ) {
            player.pieceThreePositions.push(
                playerOffsets[player.color] + diceRoll
            );
            return;
        } else if (
            playersRandomPiece === 4 &&
            getLatestPosition(player.pieceFourPositions) !== null
        ) {
            player.pieceFourPositions.push(
                playerOffsets[player.color] + diceRoll
            );
            return;
        }
    } else {
        if (playersRandomPiece === 1) {
            const latestPosition = getLatestPosition(player.pieceOnePositions);
            if (latestPosition !== null) {
                player.pieceOnePositions.push(latestPosition + diceRoll);
            }
        } else if (playersRandomPiece === 2) {
            const latestPosition = getLatestPosition(player.pieceTwoPositions);
            if (latestPosition !== null) {
                player.pieceTwoPositions.push(latestPosition + diceRoll);
            }
        } else if (playersRandomPiece === 3) {
            const latestPosition = getLatestPosition(
                player.pieceThreePositions
            );
            if (latestPosition !== null) {
                player.pieceThreePositions.push(latestPosition + diceRoll);
            }
        } else if (playersRandomPiece === 4) {
            const latestPosition = getLatestPosition(player.pieceFourPositions);
            if (latestPosition !== null) {
                player.pieceFourPositions.push(latestPosition + diceRoll);
            }
        }
    }
};

let gameOver = false;

while (!gameOver) {
    for (const player of players) {
        console.log(`${player.color}'s turn`);
        movePiece(player, players);
    }
}
