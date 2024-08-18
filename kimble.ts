export interface IPlayer {
    color: string;
    pieceOnePositions: (number | null)[];
    positionSequence: number[];
    startingPosition: number;
    finishPositions: number[];
    pieceOneTimesMovedAfterLeavingBase: number;
}

const boardLength = 28;
const boardPositions = Array.from({ length: boardLength }, (_, i) => i + 1);
console.log("boardPositions: ", boardPositions);

const getLatestPosition = (player: IPlayer) => {
    return player.pieceOnePositions[player.pieceOnePositions.length - 1];
};

const createPlayer = (color: string, startingPosition: number): IPlayer => {
    return {
        color,
        pieceOnePositions: [null],
        startingPosition,
        finishPositions: [
            startingPosition,
            startingPosition + 1,
            startingPosition + 2,
            startingPosition + 3,
        ],
        positionSequence: Array.from(
            { length: boardLength },
            (_, i) => (i + startingPosition) % (boardLength + 1)
        ),
        pieceOneTimesMovedAfterLeavingBase: 0,
    };
};

let gameOver = false;
const movePiece = (player: IPlayer, players: IPlayer[]) => {
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    const latestPosition = getLatestPosition(player);

    console.log(`\n${player.color} rolls a ${diceRoll}!`);
    console.log(
        `${player.color} pieceOnePositions before: ${player.pieceOnePositions}`
    );

    if (latestPosition === null && diceRoll !== 6) {
        player.pieceOnePositions.push(null);
    }

    if (diceRoll === 6 && latestPosition === null) {
        // Move piece onto the board
        player.pieceOnePositions.push(player.startingPosition);
        player.pieceOneTimesMovedAfterLeavingBase += 1;
    } else if (latestPosition !== null) {
        let newPosition = (latestPosition + diceRoll) % 28;
        console.log(`${player.color} newPosition: ${newPosition}`);

        console.log(
            `${player.color} pieceOneTimesMovedAfterLeavingBase: ${player.pieceOneTimesMovedAfterLeavingBase}`
        );

        if (
            player.pieceOneTimesMovedAfterLeavingBase > 4 &&
            player.finishPositions.includes(newPosition)
        ) {
            /* TODO: Also Check if the position is occupied by player's other piece (which have not yet been implemented) 
            and if so, do not move the piece */

            let isOccupied = false;
            if (!isOccupied) {
                player.pieceOnePositions.push(newPosition);
                player.pieceOneTimesMovedAfterLeavingBase += 1;
                console.log(
                    `!!!!${player.color} has reached the end of the board at ${newPosition}!!!!!`
                );
                console.log(
                    `${player.color} finishpositions: ${player.finishPositions}`
                );
                console.log(
                    `${player.color} startingPosition: ${player.startingPosition}`
                );
                console.log(
                    `${player.color} pieceOnePositions: ${player.pieceOnePositions}`
                );
                console.log(
                    `${player.color} pieceOneMoveCount: ${player.pieceOnePositions.length}`
                );
                gameOver = true;
            }
        } else if (
            player.pieceOneTimesMovedAfterLeavingBase > 4 &&
            newPosition > Math.max(...player.finishPositions)
        ) {
            const exactRollNeeded = player.finishPositions.find(
                (pos) => pos === newPosition
            );
            if (exactRollNeeded !== undefined) {
                player.pieceOnePositions.push(newPosition);
                player.pieceOneTimesMovedAfterLeavingBase += 1;
                console.log(
                    `${player.color} newPosition: ${player.pieceOnePositions}`
                );
            } else {
                console.log(
                    `${player.color} needs an exact roll to reach the end of the board!`
                );
            }
        } else {
            player.pieceOnePositions.push(newPosition);
            player.pieceOneTimesMovedAfterLeavingBase += 1;

            // Check if the new position is occupied by another player's piece
            for (const otherPlayer of players) {
                if (otherPlayer !== player) {
                    if (getLatestPosition(otherPlayer) === newPosition) {
                        // "Eat" the piece and send it back to base
                        console.log(
                            `${otherPlayer.color} pieceOnePositions before: ${otherPlayer.pieceOnePositions}`
                        );
                        console.log(
                            `${otherPlayer.color} has piece in position ${newPosition} eaten by ${player.color}!`
                        );
                        otherPlayer.pieceOnePositions.push(null);
                        otherPlayer.pieceOneTimesMovedAfterLeavingBase = 0;
                        console.log(
                            `${otherPlayer.color} pieceOnePositions after: ${otherPlayer.pieceOnePositions}`
                        );
                    }
                }
            }
            console.log(`${player.color} newPosition: ${newPosition}`);
        }
    }

    console.log(
        `${player.color} pieceOnePositions after: ${player.pieceOnePositions}`
    );
};

const playGame = () => {
    const players = [
        { color: "blue", startingPosition: 1 },
        { color: "yellow", startingPosition: 8 },
        { color: "green", startingPosition: 15 },
        { color: "red", startingPosition: 22 },
    ].map((player) => createPlayer(player.color, player.startingPosition));
    console.log("players: ", players);

    let currentPlayerIndex = Math.floor(Math.random() * players.length); // number between 0 and 3

    const playerTurnSequence = [];

    for (let i = 0; i < players.length; i++) {
        playerTurnSequence.push(
            players[(currentPlayerIndex + i) % players.length].color
        );
    }

    console.log("playerTurnSequence: ", playerTurnSequence);

    const playerTurns = [];
    while (!gameOver) {
        const currentPlayer = players[currentPlayerIndex];
        playerTurns.push(currentPlayer.color);
        movePiece(currentPlayer, players);
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    }

    console.log("Game Over!");
    console.log("yellow pieceOnePositions: ", players[1].pieceOnePositions);
    console.log(
        "yellow pieceOnePositions length: ",
        players[1].pieceOnePositions.length
    );
    console.log("green pieceOnePositions: ", players[2].pieceOnePositions);
    console.log(
        "green pieceOnePositions length: ",
        players[2].pieceOnePositions.length
    );
    console.log("red pieceOnePositions: ", players[3].pieceOnePositions);
    console.log(
        "red pieceOnePositions length: ",
        players[3].pieceOnePositions.length
    );
    console.log("blue pieceOnePositions: ", players[0].pieceOnePositions);
    console.log(
        "blue pieceOnePositions length: ",
        players[0].pieceOnePositions.length
    );
    console.log("playerTurns: ", playerTurns);
};

playGame();
