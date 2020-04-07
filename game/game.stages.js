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
        .next('quiz')
        .repeat('gameTUT', 3)
        .next('START')
        .repeat('game', settings.REPEAT)
        .next('belief')
        .next('bomb')
        .next('belief_feedback')
        .next('CRT')
        .next('questionnaire')
        .next('preEnd')
        .next('end')
        .gameover();



        stager.extendStage('gameTUT', {
                steps: [
                    'signalsTUT',
                    'votingTUT',
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

    /*  stager.skip('instructions');
      stager.skip('quiz');
      stager.skip('gameTUT');
      stager.skip('game');
      stager.skip('belief');
      stager.skip('belief_feedback');
      stager.skip('bomb');
      stager.skip('CRT');
      stager.skip('questionnaire');*/
    

};
