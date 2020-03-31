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
    REPEAT: 6,

    // # Treatments definition.

    // They can contain any number of properties, and also overwrite
    // those defined above.

    // If the `treatments` object is missing a treatment named _standard_
    // will be created automatically, and will contain all variables.

    treatments: {

        control: {
            description: "The bots are not biased at all",
            //bidTime: 30000,
            getsignal: 0.9,
            correctsignal: 0.6,
            bias: 10,
            bias2: 10,
            first_decision: '<span style="color: red">red</span>',
            second_decision: '<span style="color: blue">blue</span>',
            third_decision: '<span style="color: red">red</span>',
            fourth_decision: '<span style="color: red">red</span>',
            fifth_decision: '<span style="color: blue">blue</span>'
        },

        under: {
            description: "The bots are heavily biased and it is rational to hide blue signals.",
            //bidTime: 30000,
            getsignal: 0.9,
            correctsignal: 0.6,
            bias: 3,
            bias2: 10,
            first_decision: '<span style="color: blue">blue</span>',
            second_decision: '<span style="color: blue">blue</span>',
            third_decision: '<span style="color: red">red</span>',
            fourth_decision: '<span style="color: blue">blue</span>',
            fifth_decision: '<span style="color: blue">blue</span>'
        },

        over: {
            description: "The bots are heavily biased and it is rational to hide red signals.",
            //bidTime: 30000,
            getsignal: 0.9,
            correctsignal: 0.6,
            bias: 18,
            bias2: 10,
            first_decision: '<span style="color: red">red</span>',
            second_decision: '<span style="color: red">red</span>',
            third_decision: '<span style="color: red">red</span>',
            fourth_decision: '<span style="color: red">red</span>',
            fifth_decision: '<span style="color: blue">blue</span>'
        }
      }
};
