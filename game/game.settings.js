/**
 * # Game settings definition file
 * Copyright(c) 2019 Samuel <sammuell@mail.uni-mannheim.de>
 * MIT Licensed
 *
 * The variables in this file will be sent to each client and saved under:
 *
 *   `node.game.settings`
 *
 * The name of the chosen treatment will be added as:
 *
 *    `node.game.settings.treatmentName`
 *
 * http://www.nodegame.org
 * ---
 */
module.exports = {

    // Variables shared by all treatments.
    // Divider ECU / DOLLARS *
    EXCHANGE_RATE: (1/40),

    EXCHANGE_RATE_INSTRUCTIONS: 0.25,
    // #nodeGame properties:

    /**
     * ### TIMER (object) [nodegame-property]
     *
     * Maps the names of the steps of the game to timer durations
     *
     * If a step name is found here, then the value of the property is
     * used to initialize the game timer for the step.
     */
     // Since players play alone, I don't think I need any timer at all.
    //TIMER: {
        //instructions: 60000
    //},

    // # Game specific properties
    // Variables shared by all treatments.

    // Number of game rounds repetitions.
    REPEAT: 3,

    // # Treatments definition.

    // They can contain any number of properties, and also overwrite
    // those defined above.

    // If the `treatments` object is missing a treatment named _standard_
    // will be created automatically, and will contain all variables.

    treatments: {

        control: {
            description: "The bots are not biased at all",
            //bidTime: 30000,
            getsignal: 0.7,
            correctsignal: 0.6,
            bias: 1,
            bias2: 1,
            right_decision: '<span style="color: blue">BLUE</span>',
            wrong_decision: '<span style="color: red">RED</span>'
        },

        weak: {
            description: "The bots are barely biased and hiding is usually not rational.",
            //bidTime: 30000,
            getsignal: 0.7,
            correctsignal: 0.6,
            bias: 1.3,
            bias2: 1,
            right_decision: '<span style="color: blue">BLUE</span>',
            wrong_decision: '<span style="color: red">RED</span>'
        },

        strong: {
            description: "The bots are very biased and hiding is usually rational.",
            //bidTime: 30000,
            getsignal: 0.7,
            correctsignal: 0.6,
            bias: 1.7,
            bias2: 1,
            right_decision: '<span style="color: red">RED</span>',
            wrong_decision: '<span style="color: blue">BLUE</span>'
        }

    }
};
