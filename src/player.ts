export const createPlayer = (name: string) => {
    return {
        name,
        position: 0,
        rollDice: () => Math.floor(Math.random() * 6) + 1,
        moveCount: 0,
    };
};
