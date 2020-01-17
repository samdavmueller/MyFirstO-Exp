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
    // Setting the SOLO rule: game steps each time node.done() is called,
    // ignoring the state of other clients.
    // The logic will never call node.done() explicitely, and instead will
    // wait for a stage update from the client and move to the same step.
    const ngc = require('nodegame-client');
    stager.setDefaultStepRule(ngc.stepRules.SOLO);

    stager.setOnInit(function() {
        // Keep the logic in sync with the player manually.
        node.on('in.say.PLAYER_UPDATE', function(msg) {
          if (msg.text === 'stage') {
            setTimeout(function() {
              node.game.gotoStep(msg.data.stage);
            });
          }
        });
    });

    stager.extendStep('instructions', {
        cb: function() {
            console.log('Instructions.');
        }
    });

    stager.extendStep('quiz', {
        cb: function() {
            console.log('Quiz');
        }
    });
    stager.extendStep('signals', {


        cb: function() {
          var decision1, decision2, decision3, urncolor, noturncolor,
              plyrsignal1, plyrsignal2, plyrsignal3, sharesignals;
              console.log('SIGNALS');
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


        //console.log(playsig);
        //console.log(urncolor);
        //now the bots are programmed
        var b1s1, b1s2, b1s3, b2s1, b2s2, b2s3, fdecision;

        // signals for bot1 are created the same way as they have been created for the participant.
        // I also create a string to display the signals that are shared by bot 1
        var b1sig='';
        if (Math.random()< node.game.settings.getsignal) {
          if (Math.random()< node.game.settings.correctsignal){
            b1s1=urncolor;
            b1sig= b1sig + ', <span style="color:'  + b1s1+'">' + b1s1+'</span>';
          }
          else{
            b1s1=noturncolor;
            b1sig= b1sig + ', <span style="color:'  + b1s1+'">' + b1s1+'</span>';
          }
        }
        else {
          b1s1= '';
          }

        if (Math.random()< node.game.settings.getsignal) {
          if (Math.random()< node.game.settings.correctsignal){
            b1s2=urncolor;
            b1sig= b1sig + ', <span style="color:'  + b1s2+'">' + b1s2+'</span>';
          }
          else{
            b1s2=noturncolor;
            b1sig= b1sig + ', <span style="color:'  + b1s2+'">' + b1s2+'</span>';
          }
        }
        else {
          b1s2= '';

        }

        if (Math.random()< node.game.settings.getsignal) {
          if (Math.random()< node.game.settings.correctsignal){
            b1s3=urncolor;
            b1sig= b1sig + ', <span style="color:'  + b1s3+'">' + b1s3+'</span>';

          }
          else{
            b1s3=noturncolor;
            b1sig= b1sig + ', <span style="color:'  + b1s3+'">' + b1s3+'</span>';
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
            b2sig= b2sig + ', <span style="color:'  + b2s1+'">' + b2s1+'</span>';
          }
          else{
            b2s1=noturncolor;

            b2sig= b2sig + ', <span style="color:'  + b2s1+'">' + b2s1+'</span>';
          }
        }
        else {
          b2s1= '';
          }

        if (Math.random()< node.game.settings.getsignal) {
          if (Math.random()< node.game.settings.correctsignal){
            b2s2=urncolor;

            b2sig= b2sig + ', <span style="color:'  + b2s2+'">' + b2s2+'</span>';
          }
          else{
            b2s2=noturncolor;

            b2sig= b2sig + ', <span style="color:'  + b2s2+'">' + b2s2+'</span>';
          }
        }
        else {
          b2s2= '';

        }

        if (Math.random()< node.game.settings.getsignal) {
          if (Math.random()< node.game.settings.correctsignal){
            b2s3=urncolor;

            b2sig= b2sig + ', <span style="color:'  + b2s3+'">' + b2s3+'</span>';

          }
          else{
            b2s3=noturncolor;

            b2sig= b2sig + ', <span style="color:'  + b2s3+'">' + b2s3+'</span>';
          }
        }
        else {
          b2s3= '';
          }
        b2sig = b2sig.slice(1);

        var d={
                "playsig": playsig,
                "b1sig":b1sig,
                "b2sig":b2sig
              };
          // the shared signals are shown to the player
          var player = node.game.pl.each(function(player){
              node.say('DATA', player.id , d);
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

        //console.log(shar_sig_array.length);
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
        var v_correct,correct, paid;

        // console.log(node.game.memory.stage[node.game.getPreviousStep(1)].fetch());
        // console.log(node.game.memory.stage[node.game.getPreviousStep(2)].fetch());
        // I get the signals from the signal step and put them in one String
        var signals="";
        if(node.game.memory.stage[node.game.getPreviousStep(2)].fetchArray('plyrsignal1')[0][0]!==""){
            var c=node.game.memory.stage[node.game.getPreviousStep(2)].fetchArray('plyrsignal1')[0][0];
            signals='<span style="color:'+c+'">'+ c+'</span>';
        }
        if(signals===""){
            var c=node.game.memory.stage[node.game.getPreviousStep(2)].fetchArray('plyrsignal2')[0][0];
            signals='<span style="color:'+c+'">'+ c+'</span>';
        }
        else if(node.game.memory.stage[node.game.getPreviousStep(2)].fetchArray('plyrsignal2')[0][0]!==""){
          var c=node.game.memory.stage[node.game.getPreviousStep(2)].fetchArray('plyrsignal2')[0][0];
          signals= signals + ", " +'<span style="color:'+c+'">'+ c+'</span>';
        }
        if(signals===""){
            var c=node.game.memory.stage[node.game.getPreviousStep(2)].fetchArray('plyrsignal3')[0][0];
            signals='<span style="color:'+c+'">'+ c+'</span>';
        }
        else if(node.game.memory.stage[node.game.getPreviousStep(2)].fetchArray('plyrsignal3')[0][0]!==""){
            var c=node.game.memory.stage[node.game.getPreviousStep(2)].fetchArray('plyrsignal3')[0][0];
          signals= signals + ", " +'<span style="color:'+c+'">'+ c+'</span>';
        }

        // sharedsignals
        var sharesignal1=node.game.memory.stage[node.game.getPreviousStep(2)].fetchArray('sharesignal1')[0][0];

        var sharesignal2=node.game.memory.stage[node.game.getPreviousStep(1)].fetchArray('b1signals')[0][0];
        var sharesignal3=node.game.memory.stage[node.game.getPreviousStep(1)].fetchArray('b2signals')[0][0];
        // vote
        var vote=node.game.memory.stage[node.game.getPreviousStep(1)].fetchArray('vote')[0][0];
            vote='<span style="color:'+vote+'">'+ vote+'</span>';
        // I get the urncolor form the signals step
        var urncolor=node.game.memory.stage[node.game.getPreviousStep(2)].fetchArray('urncolor')[0][0];
            urncolor='<span style="color:'+urncolor+'">'+urncolor+'</span>';
        // I get the decision from the previous step
        var fdecision=node.game.memory.stage[node.game.getPreviousStep(1)].fetchArray('fdecision')[0][0];
            fdecision='<span style="color:'+fdecision+'">'+fdecision+'</span>';
        // If the decision was correct the players are paid 1.5$.
        if (urncolor===fdecision){
          correct='correct';
          paid=1.5;
        }
        // Else they receive nothing
        else{
          correct='false';
          paid=0;
        }

        // if the own vote was correct the players are paid additional 0.5$.
        if (urncolor===vote){
          v_correct='correct';
          paid=paid+0.5;
        }
        // Else they receive nothing
        else{
          v_correct='false';
          paid=paid+0;
        }
          // Temporary (we just need the id).
          var playerId = node.game.pl.first();
          playerId = playerId.id;

          // Permanent.
          // Contains all the data about the player.
          var client = channel.registry.getClient(playerId);

          //console.log(client);

          // Ternary Assignment.
          client.win = client.win ? (client.win + paid) : paid;
          // Same as:
//          if (client.win) {
//              client.win = client.win + paid;
//          }
//          else {
//              client.win = paid;
//          }

          //console.log(client);

          // The information is sent to the players.
          var d={
                  "signals": signals,
                  "sharesignal1": sharesignal1,
                  "sharesignal2": sharesignal2,
                  "sharesignal3": sharesignal3,
                  "vote": vote,
                  "v_correct": v_correct,
                  "correct": correct,
                  "urncolor": urncolor,
                  "paid": paid,
                  "fdecision": fdecision

          }


                    //console.log(d);

          node.say('DATA', playerId, d);
      }

    });

    stager.extendStep('risk_feedback',{
      cb: function(){
        var cell=Math.ceil(Math.random() * 10);
        var item=node.game.memory.stage[node.game.getPreviousStep(1)].fetchArray('items')[0][cell-1];

        var choice=item.choice;
        var lottery=String(item.value);
            lottery=lottery.replace("and", " and ")
        var dice=Math.ceil(Math.random() * 10);
        var win=0;
        if(choice==0){
          if(dice<=cell){
            win=1;
          }
          if(dice>cell){
            win=0.8;
          }
        }
        if(choice==1){
          if(dice<=cell){
            win=1.93;
          }
          if(dice>cell){
            win=0.05;
          }
        }

        var d={
          "cell": cell,
          "lottery": lottery,
          "dice": dice,
          "win": win
        }



        var playerId = node.game.pl.first();
        playerId = playerId.id;


        var client = channel.registry.getClient(playerId);

        // Ternary Assignment.
        client.win = client.win ? (client.win + win) : win;


        //console.log(typeof lottery);
        //console.log(playerId);
        node.say('RISK', playerId, d);
      }


    });

    // in the last stage the data is saved.
    stager.extendStep('end', {
        cb: function() {
          var playerId = node.game.pl.first();
          playerId = playerId.id;


          var client = channel.registry.getClient(playerId);

          // Ternary Assignment.
          client.win = client.win ? (client.win + 1) : 1;

            gameRoom.computeBonus({
                say: true,   // default false
                dump: true,  // default false
                print: true  // default false
                // Optional. Pre-process the results of each player.
                // cb: function(info, player) {
                // // The sum of partial results is diplayed before the total.
                //         info.partials = [ 10, -1, 7];
                // }
            });

            node.game.memory.save('data.json');
        }
    });

    stager.setOnGameOver(function() {
        // Something to do.
    });
};
