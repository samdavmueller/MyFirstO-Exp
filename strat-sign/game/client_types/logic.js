/**
 * # Logic type implementation of the game stages
 * Copyright(c) 2019 Samuel <sammuell@mail.uni-mannheim.de>
 * MIT Licensed
 *
 * http://www.nodegame.org
 * ---
 */

"use strict";

var ngc = require('nodegame-client');
var J = ngc.JSUS;

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    var node = gameRoom.node;
    var channel =  gameRoom.channel;

    // Must implement the stages here.

    stager.setOnInit(function() {
        // Initialize the client.
    });

    stager.extendStep('instructions', {
        cb: function() {
            console.log('Instructions.');
        }
    });

    stager.extendStep('signals', {


        cb: function() {
          var decision1, decision2, decision3, urncolor, noturncolor,
              plyrsignal1, plyrsignal2, plyrsignal3, sharesignals;

          // when the player is done all necessary information is send to the Logic
          // I don't think it is actually necessary to create these variables but I do it anyway
           node.on.data('done', function(msg) {

                decision1 = msg.data.decision1;
                decision2 = msg.data.decision2;
                decision3 = msg.data.decision3;
                urncolor = msg.data.urncolor;
                noturncolor = msg.data.noturncolor;
                plyrsignal1 = msg.data.plyrsignal1;
                plyrsignal2 = msg.data.plyrsignal2;
                plyrsignal3 = msg.data.plyrsignal3;
                sharesignals = msg.data.sharesignal1;



            });


        }
    });

    // next the voting step which is mainly done in the logic
    stager.extendStep('voting', {

      cb: function() {

        // all data is retrieved from memory by using the getPreviousStep command

        var playsig=node.game.memory.stage[node.game.getPreviousStep()].fetchArray('sharesignal1')[0][0];
        var urncolor=node.game.memory.stage[node.game.getPreviousStep()].fetchArray('urncolor')[0][0];
        var noturncolor=node.game.memory.stage[node.game.getPreviousStep()].fetchArray('noturncolor')[0][0];




        //now the bots are programmed
        var b1s1, b1s2, b1s3, b2s1, b2s2, b2s3, fdecision;

        // signals for bot1 are created the same way as they have been created for the participant.
        // I also create a string to display the signals that are shared by bot 1
        var b1sig='';
        if (Math.random()< node.game.settings.getsignal) {
          if (Math.random()< node.game.settings.correctsignal){
            b1s1=urncolor;
            b1sig= b1sig + ', ' + b1s1;
          }
          else{
            b1s1=noturncolor;
            b1sig= b1sig + ', ' + b1s1;
          }
        }
        else {
          b1s1= '';
          }

        if (Math.random()< node.game.settings.getsignal) {
          if (Math.random()< node.game.settings.correctsignal){
            b1s2=urncolor;
            b1sig= b1sig + ', ' + b1s2;
          }
          else{
            b1s2=noturncolor;
            b1sig= b1sig + ', ' + b1s2;
          }
        }
        else {
          b1s2= '';

        }

        if (Math.random()< node.game.settings.getsignal) {
          if (Math.random()< node.game.settings.correctsignal){
            b1s3=urncolor;
            b1sig= b1sig + ', ' + b1s3;

          }
          else{
            b1s3=noturncolor;
            b1sig= b1sig + ', ' + b1s3;
          }
        }
        else {
          b1s3= '';
          }
        b1sig = b1sig.slice(1);


        // signals for bot2 are created the same way as they have been created for the participant.
        // I also create a string to display the signals that are shared by bot 2
        var b2sig='';
        if (Math.random()< node.game.settings.getsignal) {
          if (Math.random()< node.game.settings.correctsignal){
            b2s1=urncolor;
            b2sig= b2sig + ', ' + b2s1;
          }
          else{
            b2s1=noturncolor;

            b2sig= b2sig + ', ' + b2s1;
          }
        }
        else {
          b2s1= '';
          }

        if (Math.random()< node.game.settings.getsignal) {
          if (Math.random()< node.game.settings.correctsignal){
            b2s2=urncolor;

            b2sig= b2sig + ', ' + b2s2;
          }
          else{
            b2s2=noturncolor;

            b2sig= b2sig + ', ' + b2s2;
          }
        }
        else {
          b2s2= '';

        }

        if (Math.random()< node.game.settings.getsignal) {
          if (Math.random()< node.game.settings.correctsignal){
            b2s3=urncolor;

            b2sig= b2sig + ', ' + b2s3;

          }
          else{
            b2s3=noturncolor;

            b2sig= b2sig + ', ' + b2s3;
          }
        }
        else {
          b2s3= '';
          }
        b2sig = b2sig.slice(1);

          // the shared signals are shown to the player
          var player = node.game.pl.each(function(player){
              node.say('SIG_P', player.id , playsig);
              node.say('SIG_B1', player.id , b1sig);
              node.say('SIG_B2', player.id , b2sig);
          });
// the shar_sig_array is used to caluclate the voting behavior of the bots
// since both bots always vote the same way, they determine the final decision
        var shar_sig_array=node.game.memory.stage[node.game.getPreviousStep()].fetchArray('sig_array')[0];
// I add the shared signals of the bots
        if (b1s1==="red"){
          shar_sig_array.push(1);
        }
        if (b1s1==="blue"){
          shar_sig_array.push(0);
        }
        if (b1s2==="red"){
          shar_sig_array.push(1);
        }
        if (b1s2==="blue"){
          shar_sig_array.push(0);
        }
        if (b1s3==="red"){
          shar_sig_array.push(1);
        }
        if (b1s3==="blue"){
          shar_sig_array.push(0);
        }
        if (b2s1==="red"){
          shar_sig_array.push(1);
        }
        if (b2s1==="blue"){
          shar_sig_array.push(0);
        }
        if (b2s2==="red"){
          shar_sig_array.push(1);
        }
        if (b2s2==="blue"){
          shar_sig_array.push(0);
        }
        if (b2s3==="red"){
          shar_sig_array.push(1);
        }
        if (b2s3==="blue"){
          shar_sig_array.push(0);
        }

        console.log(shar_sig_array.length);
        // now I calculate how many signals indicate that the urn is blue
        var blue_vot= shar_sig_array.length-shar_sig_array.reduce((a, b) => a+b, 0);
        // and how many indicate that the urn is red
        var red_vot= shar_sig_array.reduce((a, b) => a+b, 0);
        // the decision is made. It depends on the treatment.
        if (node.game.settings.bias*red_vot<node.game.settings.bias2*blue_vot){
          fdecision='blue';
        }
        else{
          fdecision='red';
        }

        // because I was unable to save the decision from the logic I send it to
        // the player to save it using 'done'
        var player = node.game.pl.each(function(player){
          node.say('FDECISION', player.id , fdecision);
      });


      }
    });


    // In the feedback stage, I just need to recall everything that was done before.
    stager.extendStep('feedback', {

      cb: function(){
        var correct, payed;
        // I get the urncolor form the signals step
        var urncolor=node.game.memory.stage[node.game.getPreviousStep(2)].fetchArray('urncolor')[0][0];
        // I get the decision from the previous step
        var fdecision=node.game.memory.stage[node.game.getPreviousStep(1)].fetchArray('fdecision')[0][0];

        // If the decision was correct the players are paid 2$. However they should also be added to their final account
        if (urncolor===fdecision){
          correct='correct';
          payed=2;
        }
        // Else they receive nothing
        else{
          correct='false';
          payed=0;
        }

        // The information is sent to the players.
        var player = node.game.pl.each(function(player){
            node.say('URNCOLOR', player.id , urncolor);
            node.say('FDECISION', player.id , fdecision);
            node.say('CORRECT', player.id , correct);
            node.say('PAYED', player.id , payed);
        });
      }

    });


    // in the last stage the data is saved.
    stager.extendStep('end', {
        cb: function() {
            node.game.memory.save('data.json');
        }
    });

    stager.setOnGameOver(function() {
        // Something to do.
    });
};
