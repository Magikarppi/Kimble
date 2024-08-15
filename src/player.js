"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPlayer = void 0;
const createPlayer = (name) => {
    return {
        name,
        position: 0,
        rollDice: () => Math.floor(Math.random() * 6) + 1,
        moveCount: 0,
    };
};
exports.createPlayer = createPlayer;
