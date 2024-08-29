import { createPlayers } from "../helpers/gameHelpers";
import { play } from "../kimble";

describe("play function", () => {
    it("should run a game and return the first player blue as the winning player", () => {
        const players = createPlayers(["blue", "yellow", "green", "red"]);
        const playersTurnsOrder = [...players];

        let diceRolls: number[] = [];

        /* Turn round 1: All players roll a 6 and move a piece out of the base 
            to positions 0, 7, 14, 21 respectively.
        */
        diceRolls = [6, 6, 6, 6];

        // Turn round 2: First player rolls a 6 and moves the first piece. Other players crawl forward
        diceRolls = [...diceRolls, 6, 1, 1, 1];

        /*
                    Positions: 
                        First player blue has 1 piece on position 6. 
                        Second player yellow has 1 piece on position 8. 
                        Third player green has 1 piece on position 15. 
                        Fourth player red has 1 piece on position 22.
                    Turn round 3: 
                        First player rolls a 2 and moves the first piece to position 8 returning yellow's piece back to base.
                        green and red crawl forward.
                */
        diceRolls = [...diceRolls, 2, 1, 1, 1];

        /*
                    Positions: 
                        First player blue has 1 piece on position 8. 
                        Second player yellow has 0 pieces on the board. 
                        Third player green has 1 piece on position 16. 
                        Fourth player red has 1 piece on position 23.
                    Turn round 4: 
                        blue rolls a 5 and moves the first piece to position 13.
                        green and red crawl forward.
                */
        diceRolls = [...diceRolls, 5, 1, 1, 1];

        /*

        
/*         


                    Positions: 
                        First player blue has 1 piece on position 13. 
                        Second player yellow has 0 pieces on the board. 
                        Third player green has 1 piece on position 17. 
                        Fourth player red has 1 piece on position 24.
                    Turn round 5: 
                        blue rolls a 4 and moves the first piece to position 17.
                        green's piece is returned to base and red crawls forward.
                */

        diceRolls = [...diceRolls, 4, 1, 1, 1];

        /*
                    Positions: 
                        First player blue has 1 piece on position 17. 
                        Second player yellow has 0 pieces on the board. 
                        Third player green has 0 pieces on the board. 
                        Fourth player red has 1 piece on position 25.
                    Turn round 6: 
                        blue rolls a 5 and moves the first piece to position 22.
                        red crawls forward.
                */

        diceRolls = [...diceRolls, 5, 1, 1, 1];

        /*
                    Positions: 
                        First player blue has 1 piece on position 22. 
                        Second player yellow has 0 pieces on the board. 
                        Third player green has 0 pieces on the board. 
                        Fourth player red has 1 piece on position 26.
                    Turn round 7: 
                        blue rolls a 4 and moves the first piece to position 26.
                        red's piece is returned to base.
                */

        diceRolls = [...diceRolls, 4, 1, 1, 1];

        /*
                    Positions: 
                        First player blue has 1 piece on position 26. 
                        Second player yellow has 0 pieces on the board. 
                        Third player green has 0 pieces on the board. 
                        Fourth player red has 0 pieces on the board.
                    Turn round 8: 
                        blue rolls a 2 and moves the first piece the first finish position for blue (0).
                */

        diceRolls = [...diceRolls, 2, 1, 1, 1];

        /*
                    Positions: 
                        First player blue has 1 piece on the first finish position. 
                        Second player yellow has 0 pieces on the board. 
                        Third player green has 0 pieces on the board. 
                        Fourth player red has 0 pieces on the board.
                    Turn sequence 9: 
                        blue rolls a 6 and moves second piece out of base onto the board.
                        blue rolls fives until the second piece reaches the second finish position.
                        other players roll 1's and can't move out of base.

                */

        diceRolls = [...diceRolls, 6, 1, 1, 1];
        diceRolls = [...diceRolls, 5, 1, 1, 1];
        // Blue at position 5
        diceRolls = [...diceRolls, 5, 1, 1, 1];
        // Blue at position 10
        diceRolls = [...diceRolls, 5, 1, 1, 1];
        // Blue at position 15
        diceRolls = [...diceRolls, 5, 1, 1, 1];
        // Blue at position 20
        diceRolls = [...diceRolls, 5, 1, 1, 1];
        // Blue at position 25
        diceRolls = [...diceRolls, 4, 1, 1, 1];
        // Blue reaches the second finish position (1)

        /*
                    Positions: 
                        First player blue has 2 pieces on the first and second finish positions. 
                        Second player yellow has 0 pieces on the board. 
                        Third player green has 0 pieces on the board. 
                        Fourth player red has 0 pieces on the board.
                    Turn sequence 10: 
                        blue rolls a 6 and moves third piece out of base onto the board.
                        blue rolls fives until the third piece reaches the third finish position.
                        other players can't move out of base.
                */

        diceRolls = [...diceRolls, 6, 1, 1, 1];
        diceRolls = [...diceRolls, 5, 1, 1, 1];
        // Blue at position 5
        diceRolls = [...diceRolls, 5, 1, 1, 1];
        // Blue at position 10
        diceRolls = [...diceRolls, 5, 1, 1, 1];
        // Blue at position 15
        diceRolls = [...diceRolls, 5, 1, 1, 1];
        // Blue at position 20
        diceRolls = [...diceRolls, 5, 1, 1, 1];
        // Blue at position 25
        diceRolls = [...diceRolls, 5, 1, 1, 1];
        // Blue reaches the third finish position (2)

        /*
                    Positions: 
                        First player blue has 3 pieces on the first, second and third finish positions. 
                        Second player yellow has 0 pieces on the board. 
                        Third player green has 0 pieces on the board. 
                        Fourth player red has 0 pieces on the board.
                    Turn sequence 11: 
                        blue rolls 1's and can't get the fourth piece out of base.
                        All other players get a piece on the board and move to finish area.
                */

        diceRolls = [...diceRolls, 1, 6, 6, 6];
        // blue in base, yellow at position 7, green at position 14, red at position 21
        diceRolls = [...diceRolls, 1, 5, 5, 5];
        // blue in base, yellow at position 12, green at position 19, red at position 26
        diceRolls = [...diceRolls, 1, 5, 5, 5];
        // blue in base, yellow at position 17, green at position 24, red at position 3
        diceRolls = [...diceRolls, 1, 5, 5, 5];
        // blue in base, yellow at position 22, green at position 1, red at position 8
        diceRolls = [...diceRolls, 1, 5, 5, 5];
        // blue in base, yellow at position 27, green at position 6, red at position 13
        diceRolls = [...diceRolls, 1, 4, 4, 4];
        // blue in base, yellow at position 3, green at position 10, red at position 17
        diceRolls = [...diceRolls, 1, 4, 4, 4];
        // blue in base, yellow reaches first finish position (7), green reaches first finish position (14), red reaches first finish position (21)

        /*
                    Positions: 
                        First player blue has 3 pieces on the first, second and third finish positions. 
                        Second player yellow has 1 piece on the first finish position. 
                        Third player green has 1 piece on the first finish position. 
                        Fourth player red has 1 piece on the first finish position.
                    Turn sequence 12: 
                        Blue get's fourth piece out of base but get's knocked back by yellow.
                        Red and green stay in base.
                        Blue rolls big numbers, catches yellow, knocks yellow back to base and rolls to victory.
                */

        diceRolls = [...diceRolls, 6, 6, 1, 1];
        // blue at 0, yellow at 7, green in base, red in base
        diceRolls = [...diceRolls, 6, 2, 1, 1];
        // blue at 6, yellow at 9, green in base, red in base
        diceRolls = [...diceRolls, 6, 1, 1, 1];
        // blue at 12, yellow at 10, green in base, red in base
        diceRolls = [...diceRolls, 1, 3, 1, 1];
        // blue at 13, yellow at 13 knocking blue back, green in base, red in base
        diceRolls = [...diceRolls, 6, 1, 1, 1];
        // blue back to 0, yellow at 14, green in base, red in base
        diceRolls = [...diceRolls, 6, 1, 1, 1];
        // blue at 6, yellow at 15, green in base, red in base
        diceRolls = [...diceRolls, 6, 1, 1, 1];
        // blue at 12 with revenge in it's eyes, yellow at 16 sweating bullets, green in base, red in base
        diceRolls = [...diceRolls, 4, 1, 1, 1];
        // blue at 16, yellow back in the base, green in base, red in base
        diceRolls = [...diceRolls, 6, 1, 1, 1];
        // blue at 22, yellow in base, green in base, red in base
        diceRolls = [...diceRolls, 5, 1, 1, 1];
        // blue at 27, yellow in base, green in base, red in base
        diceRolls = [...diceRolls, 5, 1, 1, 1];
        // blue can't move over the finish areas, yellow in base, green in base, red in base
        diceRolls = [...diceRolls, 4, 1, 1, 1];
        // blue lands the fourth piece on the finish position (3) and wins the game!

        const winningPlayer = play(
            undefined,
            players,
            playersTurnsOrder,
            diceRolls
        );
        expect(winningPlayer).toBe(players[0]);
        expect(winningPlayer.name).toEqual("blue");
    });
});
