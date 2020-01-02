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
        .next('game')
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
};
