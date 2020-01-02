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
/*      matcher: {
            roles: [ 'HUMAN', 'COMP'],
            match: 'roundrobin', // or 'random_pairs'
            cycle: 'repeat_invert', // or 'repeat', 'mirror', 'mirror_invert'
            // skipBye: false,
            // setPartner: true,
        },
*/   /*   cb: function() {
          if ( Math.random()>0.5){
            urncolor= 'red';
            noturncolor= 'blue';
          }
          else{
            urncolor='blue';
            noturncolor= 'red';
          }
          var player = channel.registry.getClient();

          node.say('URNCOLOR', player.id , urncolor);
          node.say('NOTURNCOLOR', player.id , noturncolor);
        },*/

        cb: function() {
          var decision1, decision2, decision3, urncolor, noturncolor,
              plyrsignal1, plyrsignal2, plyrsignal3, sharesignals;
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

              /*  var sharesignals=[];
                // Validate incoming offer.
               if (decision1 == 1) {
                    sharesignals.push(plyrsignal1)
                  }
               if (decision2 == 1) {
                    sharesignals.push(plyrsignal2)
                  }
              if (decision3 == 1) {
                   sharesignals.push(plyrsignal3)
                 }
              // var player = channel.registry.getClient(msg.from);

                node.set({sharesignal1: sharesignals});*/

                // console.log(plyrsignal1);
                // console.log(player);
                // Send the decision to the other player.
                // node.say('SIGNALS', player.id , plyrsignal1);

            });

          //  console.log('Game round: ' + node.player.stage.round);
        }
    });

    stager.extendStep('voting', {

      cb: function() {
        var playsig=node.game.memory.select('sharesignal1').fetchArray('sharesignal1')[0][0];

        var urncolor=node.game.memory.select('sharesignal1').fetchArray('urncolor')[0][0];
        var noturncolor=node.game.memory.select('sharesignal1').fetchArray('noturncolor')[0][0];


        console.log(urncolor);
        console.log(noturncolor);

        // the shar_sig_array is used to caluclate the voting behavior of the bots
        //now the bots are programmed
        var b1s1, b1s2, b1s3, b2s1, b2s2, b2s3, fdecision;

        //for bot1
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


        // now for  bot2

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
          //console.log(player);
              node.say('SIG_P', player.id , playsig);
              node.say('SIG_B1', player.id , b1sig);
              node.say('SIG_B2', player.id , b2sig);
          });
// the shar_sig_array is used to caluclate the voting behavior of the bots
// since both bots always vote the same way, they determine the final decision
        var shar_sig_array=node.game.memory.select('sharesignal1').fetchArray('sig_array')[0];
// I add the shared signals of the bootstrap
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
        console.log(shar_sig_array);

        var blue_vot= 1+shar_sig_array.length-shar_sig_array.reduce((a, b) => a+b, 0);
        var red_vot= shar_sig_array.reduce((a, b) => a+b, 0);
        if (node.game.settings.bias*red_vot>blue_vot){
          fdecision='red';
        }
        else{
          fdecision='blue';
        }


        console.log(fdecision);

        var player = node.game.pl.each(function(player){
          node.say('FDECISION', player.id , fdecision);
      });


      }
    });

    stager.extendStep('feedback', {

      cb: function(){
        var correct, payed;
        var urncolor=node.game.memory.select('sharesignal1').fetchArray('urncolor')[0][0];
        console.log(node.game.memory.select().fetch());

        var fdecision=node.game.memory.select('fdecision').fetchArray('fdecision')[0][0];

        if (urncolor===fdecision){
          correct='correct';
          payed=2;
        }
        else{
          correct='false';
          payed=0;
        }

        var player = node.game.pl.each(function(player){
        //console.log(player);
            node.say('URNCOLOR', player.id , urncolor);
            node.say('FDECISION', player.id , fdecision);
            node.say('CORRECT', player.id , correct);
            node.say('PAYED', player.id , payed);
        });
      }

    });



    stager.extendStep('end', {
        cb: function() {
            node.game.memory.save('data.json');
        }
    });

    stager.setOnGameOver(function() {
        // Something to do.
    });
};
