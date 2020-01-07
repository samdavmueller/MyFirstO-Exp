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
        .next('instructions')
        .next('quiz')
        .repeat('game', settings.REPEAT)
        .next('risk')
        .next('CRT')
        .next('questionnaire')
        .next('end')
        .gameover();

    stager.extendStage('game', {
            steps: [
                'signals',
                'voting',
                'feedback'
            ]
        });
    // Modify the stager to skip one stage.
     // stager.skip('instructions');
     // stager.skip('quiz');
     // stager.skip('game');
     // stager.skip('risk');
     // stager.skip('CRT');
     // stager.skip('questionnaire');
};
