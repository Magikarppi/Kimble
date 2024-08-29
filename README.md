# Kimble

Classic Kimble (Trouble) - board game with 4 computer players. Running the default game results in 10000 game iterations, in which, if the winning player is also the starting player, the average dice pops for the winning player are saved and are logged to the console when all games are finished.

## Main technologies

-   TypeScript
-   Node.js
-   Jest

## Installation

1. Clone the repo to your computer.
2. To install dependencies run:

```bash
npm i
```

## Running the game

1. Build the project (.ts to .js files):

```bash
npm run build
```

2. To run a game run:

```bash
npm start
```

-> Average dice pops for the winner as the starting player are logged to the console.

3. To run more game iterations (hint: the game results do not really change because tactics don't), do step 1 and then run:

```bash
node ./build/kimble.js (amount of game iterations)
```

For example:

```bash
node ./build/kimble.js 1000000
```

## Making changes

1. Make changes to .ts -files
2. Run:

```bash
npm run build
```

3. Run the game again with:

```bash
npm start
```

## Running tests

1. Run:

```bash
npm test
```
