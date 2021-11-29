/**
 * # Game stages definition file
 * Copyright(c) 2019 Samuel <sammuell@mail.uni-mannheim.de>
 * MIT Licensed
 *
 * Stages are defined using the stager API
 *
 * http://www.nodegame.org
 * ---
 */

module.exports = function(stager, settings) {

     stager
        .next('welcome')
        .next('instructions')
        .next('gameTUT')
        .next('START')
        .next('quiz')
        .repeat('game', settings.REPEAT)
        .next('belief')
        .next('bomb')
        .next('belief_feedback')
        .next('CRT')
        .next('Raven')
        .next('questionnaire')
        .next('preEnd')
        .next('end')
        .gameover();


        stager.extendStage('Raven', {
                steps: [
                    'Raven1',
                    'Raven2',
                    'Raven3',
                    'Raven4',
                    'Raven5',
                    'Raven6',
                    'Raven7',
                    'Raven8'
                ]
            });
        stager.extendStage('gameTUT', {
                steps: [
                    'signalsTUT',
                  //  'votingTUT',
                    'feedbackTUT'
                ]
            });
    stager.extendStage('game', {
            steps: [
                'signals',
                'voting',
                'feedback'
            ]
        });

    // Modify the stager to skip one stage.
      //stager.skip('welcome');

    //  stager.skip('instructions');
    //  stager.skip('quiz');
    //  stager.skip('gameTUT');
    //  stager.skip('game');
    //  stager.skip('belief');
    //  stager.skip('belief_feedback');
    //  stager.skip('bomb');
    //  stager.skip('CRT');
    //  stager.skip('questionnaire');
    // stager.skip('Raven');


};
