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

    const ngc = require('nodegame-client');
    stager.setDefaultStepRule(ngc.stepRules.SOLO);

    // Disabling step syncing for other clients: the logic does not
    // push step updates to other clients when it changes step.
    stager.setDefaultProperty('syncStepping', false);

    // In the init function, we set an event lister to manually follow
    // the clients to the same step.
    stager.setOnInit(function() {
      // The logic aits for a stage update from the client and then
      // it moves to the same step.
      node.on('in.say.PLAYER_UPDATE', function(msg) {
          if (msg.text === 'stage') {
              setTimeout(function() {
                  node.game.gotoStep(msg.data.stage);
                });
              }
            });

      // Last instruction in the init function.
      // Game on clients must be started manually
      // (because syncStepping is disabled).
      setTimeout(function() {
        node.remoteCommand('start', node.game.pl.first().id);
      });
    });

    /*stager.extendStep('instructions', {
        cb: function() {
            console.log('Instructions.');
        }
    });*/

    stager.extendStep('quiz', {

      cb: function() {
          //console.log('Quiz.cb');
          var playerId = node.game.pl.first();
          playerId = playerId.id;

          var client = channel.registry.getClient(playerId);

          client.win = client.win ? (client.win) : 21;

          var check=client.win-1;
          //console.log(check);
          node.say("WIN", playerId, check);
          /*var Pstep1=node.game.getPreviousStep();
          var Pstep1_s= Pstep1.stage + '.' + Pstep1.step + '.' + Pstep1.round;
          var understand_task=node.game.memory.stage[Pstep1_s].fetch();
          console.log(understand_task);
          var i=1;
          var wait=20;
          node.on.data('done', function(msg){

            i=i+1;
          });*/
      }
    });



    stager.extendStep('signalsTUT', {


        cb: function() {
          //console.log(node.game.getPreviousStep());
          var Pstep1=node.game.getPreviousStep();

          var Pstep1_s= Pstep1.stage + '.' + Pstep1.step + '.' + Pstep1.round;
          if(Pstep1_s==="3.1.1"){
            var test=node.game.memory.stage[Pstep1_s].fetch();
            var x=test.length-1;
            var understand_task=node.game.memory.stage[Pstep1_s].fetchArray('forms')[x][0];
            var possible_action=node.game.memory.stage[Pstep1_s].fetchArray('forms')[x][1];
            var automated_players=node.game.memory.stage[Pstep1_s].fetchArray('forms')[x][2];
            var treatment=node.game.memory.stage[Pstep1_s].fetchArray('forms')[x][3];
            /*console.log(x);
            console.log(understand_task);
            console.log(possible_action);
            console.log(automated_players);
            console.log(treatment);*/

            var i=1;

            var playerId = node.game.pl.first();
            playerId = playerId.id;

            var client = channel.registry.getClient(playerId);

            //console.log(client);

            // Ternary Assignment.


            //client.win = client.win ? (client.win - 5) : paid;
            if(understand_task.choice==='0' & possible_action.choice==='0' &
            automated_players.choice==='3' & treatment.choice===node.game.settings.correct_decision){
              i=0;
              client.win = client.win - 1;
            }
            else{
              if(client.win>0){
                client.win = client.win - 5;
                //client.win = (client.win>0) ? (client.win) : 1;
              }

            }


            //console.log(i);



            node.say("FAIL", playerId, i);
          }


          var decision1, decision2, urncolor, noturncolor,
              plyrsignal1, plyrsignal2, sharesignals;
              //console.log('SIGNALSTUT');
          // when the player is done all necessary information is send to the Logic
          // I don't think it is actually necessary to create these variables but I do it anyway
           node.on.data('done', function(msg) {

                decision1 = msg.data.decision1;
                decision2 = msg.data.decision2;
                urncolor = msg.data.urncolor;
                noturncolor = msg.data.noturncolor;
                plyrsignal1 = msg.data.plyrsignal1;
                plyrsignal2 = msg.data.plyrsignal2;
                sharesignals = msg.data.sharesignal1;



            });


        }
    });

    // next the voting step which is mainly done in the logic
    stager.extendStep('votingTUT', {

      cb: function() {

        // all data is retrieved from memory by using the getPreviousStep command
        var Pstep1=node.game.getPreviousStep(1);
        var Pstep1_s= Pstep1.stage + '.' + Pstep1.step + '.' + Pstep1.round;


        var playsig=node.game.memory.stage[Pstep1_s].fetchArray('sharesignal1')[0][0];
        var urncolor=node.game.memory.stage[Pstep1_s].fetchArray('urncolor')[0][0];
        var noturncolor=node.game.memory.stage[Pstep1_s].fetchArray('noturncolor')[0][0];


        //console.log(playsig);
        //console.log(urncolor);
        //now the bots are programmed
        var b1s1, b1s2, b2s1, b2s2, fdecision;

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
        var shar_sig_array=node.game.memory.stage[Pstep1_s].fetchArray('sig_array')[0];
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


        var x=shar_sig_array.length;
        var y=shar_sig_array.reduce((a, b) => a+b, 0);
        // now I calculate how many signals indicate that the urn is blue
        var blue_vot= (x-y)*node.game.settings.bias2;
        // and how many indicate that the urn is red
        var red_vot= y*node.game.settings.bias;
        //console.log(shar_sig_array);
    //    console.log(x);
    //    console.log(y);

      //  console.log(blue_vot);

      //  console.log(red_vot);
      //  console.log(fdecision);
        if (red_vot<blue_vot){
          fdecision='blue';
        }
        else if(red_vot>blue_vot){
          fdecision='red';
        }
        if(red_vot==blue_vot){
          if(Math.random()<0.75){
            fdecision='voter';
          }
          else{
            fdecision='notvoter';
          }
        }
      //  console.log(fdecision);

        var player = node.game.pl.each(function(player){
          node.say('FDECISION', player.id , fdecision);
      });


      }
    });


    // In the feedback stage, I just need to recall everything that was done before.
    stager.extendStep('feedbackTUT', {

      cb: function(){
        var v_correct,correct, paid;

        var Pstep1=node.game.getPreviousStep(1);
        var Pstep1_s= Pstep1.stage + '.' + Pstep1.step + '.' + Pstep1.round;

        var Pstep2=node.game.getPreviousStep(2);
        var Pstep2_s= Pstep2.stage + '.' + Pstep2.step + '.' + Pstep2.round;

        // I get the signals from the signal step and put them in one String
        var signals="";
        if(node.game.memory.stage[Pstep2_s].fetchArray('plyrsignal1')[0][0]!==""){
            var c=node.game.memory.stage[Pstep2_s].fetchArray('plyrsignal1')[0][0];
            signals='<span style="color:'+c+'">'+ c+'</span>';
        }
        if(signals===""){
            var c=node.game.memory.stage[Pstep2_s].fetchArray('plyrsignal2')[0][0];
            signals='<span style="color:'+c+'">'+ c+'</span>';
        }
        else if(node.game.memory.stage[Pstep2_s].fetchArray('plyrsignal2')[0][0]!==""){
          var c=node.game.memory.stage[Pstep2_s].fetchArray('plyrsignal2')[0][0];
          signals= signals + ", " +'<span style="color:'+c+'">'+ c+'</span>';
        }


        // sharedsignals
        var sharesignal1=node.game.memory.stage[Pstep2_s].fetchArray('sharesignal1')[0][0];

        var sharesignal2=node.game.memory.stage[Pstep1_s].fetchArray('b1signals')[0][0];
        var sharesignal3=node.game.memory.stage[Pstep1_s].fetchArray('b2signals')[0][0];
        // vote
        var vote=node.game.memory.stage[Pstep1_s].fetchArray('vote')[0][0];

        // I get the urncolor form the signals step
        var urncolor=node.game.memory.stage[Pstep2_s].fetchArray('urncolor')[0][0];

        // I get the decision from the previous step
        var fdecision=node.game.memory.stage[Pstep1_s].fetchArray('fdecision')[0][0];

        if(fdecision==='voter'){
          fdecision=vote;
        }
        if(fdecision==='notvoter'){
          if(vote==='red'){
              fdecision='blue';
          }
          if(vote==='blue'){
              fdecision='red';
          }
        }



        // If the decision was correct the players are paid 1.5$.
        if (urncolor===fdecision){
          correct='correct';
          paid=30;
        }
        // Else they receive nothing
        else{
          correct='incorrect';
          paid=0;
        }

        // if the own vote was correct the players are paid additional 0.5$.
        if (urncolor===vote){
          v_correct='correct';
          paid=paid+10;
        }
        // Else they receive nothing
        else{
          v_correct='incorrect';
          paid=paid+0;
        }


        fdecision='<span style="color:'+fdecision+'">'+fdecision+'</span>';
        urncolor='<span style="color:'+urncolor+'">'+urncolor+'</span>';
        vote='<span style="color:'+vote+'">'+ vote+'</span>';

          // Temporary (we just need the id).
          var playerId = node.game.pl.first();
          playerId = playerId.id;



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



          node.say('DATA', playerId, d);
      }

    });












    stager.extendStep('signals', {


        cb: function() {
          var decision1, decision2, urncolor, noturncolor,
              plyrsignal1, plyrsignal2, sharesignals;
              //console.log('SIGNALS');
          // when the player is done all necessary information is send to the Logic
          // I don't think it is actually necessary to create these variables but I do it anyway
           node.on.data('done', function(msg) {

                decision1 = msg.data.decision1;
                decision2 = msg.data.decision2;
                urncolor = msg.data.urncolor;
                noturncolor = msg.data.noturncolor;
                plyrsignal1 = msg.data.plyrsignal1;
                plyrsignal2 = msg.data.plyrsignal2;
                sharesignals = msg.data.sharesignal1;



            });


        }
    });

    // next the voting step which is mainly done in the logic
    stager.extendStep('voting', {

      cb: function() {

        // all data is retrieved from memory by using the getPreviousStep command
        var Pstep1=node.game.getPreviousStep(1);
        var Pstep1_s= Pstep1.stage + '.' + Pstep1.step + '.' + Pstep1.round;


        var playsig=node.game.memory.stage[Pstep1_s].fetchArray('sharesignal1')[0][0];
        var urncolor=node.game.memory.stage[Pstep1_s].fetchArray('urncolor')[0][0];
        var noturncolor=node.game.memory.stage[Pstep1_s].fetchArray('noturncolor')[0][0];


        //console.log(playsig);
        //console.log(urncolor);
        //now the bots are programmed
        var b1s1, b1s2, b2s1, b2s2, fdecision;

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
        var shar_sig_array=node.game.memory.stage[Pstep1_s].fetchArray('sig_array')[0];
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


        var x=shar_sig_array.length;
        var y=shar_sig_array.reduce((a, b) => a+b, 0);
        // now I calculate how many signals indicate that the urn is blue
        var blue_vot= (x-y)*node.game.settings.bias2;
        // and how many indicate that the urn is red
        var red_vot= y*node.game.settings.bias;

        // the decision is made. It depends on the treatment.
        if (red_vot<blue_vot){
          fdecision='blue';
        }
        else if(red_vot>blue_vot){
          fdecision='red';
        }
        if (red_vot==blue_vot){
          if(Math.random()<0.75){
            fdecision='voter';
          }
          else{
            fdecision='notvoter';
          }
        }
      //    console.log(fdecision);


        var player = node.game.pl.each(function(player){
          node.say('FDECISION', player.id , fdecision);
      });


      }
    });


    // In the feedback stage, I just need to recall everything that was done before.
    stager.extendStep('feedback', {

      cb: function(){
        var v_correct,correct, paid;

        var Pstep1=node.game.getPreviousStep(1);
        var Pstep1_s= Pstep1.stage + '.' + Pstep1.step + '.' + Pstep1.round;

        var Pstep2=node.game.getPreviousStep(2);
        var Pstep2_s= Pstep2.stage + '.' + Pstep2.step + '.' + Pstep2.round;

        // I get the signals from the signal step and put them in one String
        var signals="";
        if(node.game.memory.stage[Pstep2_s].fetchArray('plyrsignal1')[0][0]!==""){
            var c=node.game.memory.stage[Pstep2_s].fetchArray('plyrsignal1')[0][0];
            signals='<span style="color:'+c+'">'+ c+'</span>';
        }
        if(signals===""){
            var c=node.game.memory.stage[Pstep2_s].fetchArray('plyrsignal2')[0][0];
            signals='<span style="color:'+c+'">'+ c+'</span>';
        }
        else if(node.game.memory.stage[Pstep2_s].fetchArray('plyrsignal2')[0][0]!==""){
          var c=node.game.memory.stage[Pstep2_s].fetchArray('plyrsignal2')[0][0];
          signals= signals + ", " +'<span style="color:'+c+'">'+ c+'</span>';
        }


        // sharedsignals
        var sharesignal1=node.game.memory.stage[Pstep2_s].fetchArray('sharesignal1')[0][0];

        var sharesignal2=node.game.memory.stage[Pstep1_s].fetchArray('b1signals')[0][0];
        var sharesignal3=node.game.memory.stage[Pstep1_s].fetchArray('b2signals')[0][0];
        // vote
        var vote=node.game.memory.stage[Pstep1_s].fetchArray('vote')[0][0];

        // I get the urncolor form the signals step
        var urncolor=node.game.memory.stage[Pstep2_s].fetchArray('urncolor')[0][0];

        // I get the decision from the previous step
        var fdecision=node.game.memory.stage[Pstep1_s].fetchArray('fdecision')[0][0];

        if(fdecision==='voter'){
          fdecision=vote;
        }
        if(fdecision==='notvoter'){
          if(vote==='red'){
              fdecision='blue';
          }
          if(vote==='blue'){
              fdecision='red';
          }
        }


        // If the decision was correct the players are paid 1.5$.
        if (urncolor===fdecision){
          correct='correct';
          paid=30;
        }
        // Else they receive nothing
        else{
          correct='incorrect';
          paid=0;
        }

        // if the own vote was correct the players are paid additional 0.5$.
        if (urncolor===vote){
          v_correct='correct';
          paid=paid+10;
        }
        // Else they receive nothing
        else{
          v_correct='incorrect';
          paid=paid+0;
        }





        // variables are changed for being displayed correctly
        urncolor='<span style="color:'+urncolor+'">'+urncolor+'</span>';
        vote='<span style="color:'+vote+'">'+ vote+'</span>';
        fdecision='<span style="color:'+fdecision+'">'+fdecision+'</span>';

          // Temporary (we just need the id).
          var playerId = node.game.pl.first();
          playerId = playerId.id;



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



          node.say('DATA', playerId, d);
      }

    });

    stager.extendStep('belief', {

    cb: function(){

      function cut_comma(s){
        if (s.charAt(0)===","){
          s=s.substring(2, (s.length+2));
        }
        if (s.charAt(s.length)===","){
          s=s.substring(0, s.length);
        }
        return s;
      }

      //This is the anchor, the feedback of the last round.
      // From this step, we can retrace all previous steps we need
      var Pstep1=node.game.getPreviousStep(1);
      //console.log(Pstep1);

      //TUT 1
     var TUT1_feedback= (Pstep1.stage-2) + '.' + (Pstep1.step) + '.' + (Pstep1.round-5);
     var TUT1_voting= (Pstep1.stage-2) + '.' + (Pstep1.step-1) + '.' + (Pstep1.round-5);
     var TUT1_signaling= (Pstep1.stage-2) + '.' + (Pstep1.step-2) + '.' + (Pstep1.round-5);

     var TUT1_decision=node.game.memory.stage[TUT1_feedback].fetchArray('fdecision')[0][0];
     var TUT1_signals= node.game.memory.stage[TUT1_signaling].fetchArray('sharesignal1')[0][0]+", "+
                       node.game.memory.stage[TUT1_voting].fetchArray('b1signals')[0][0]+", "+
                       node.game.memory.stage[TUT1_voting].fetchArray('b2signals')[0][0];

    TUT1_signals=cut_comma(TUT1_signals);


     //TUT 2
     var TUT2_feedback= (Pstep1.stage-2) + '.' + (Pstep1.step) + '.' + (Pstep1.round-4);
     var TUT2_voting= (Pstep1.stage-2) + '.' + (Pstep1.step-1) + '.' + (Pstep1.round-4);
     var TUT2_signaling= (Pstep1.stage-2) + '.' + (Pstep1.step-2) + '.' + (Pstep1.round-4);

     var TUT2_decision=node.game.memory.stage[TUT2_feedback].fetchArray('fdecision')[0][0];
     var TUT2_signals= node.game.memory.stage[TUT2_signaling].fetchArray('sharesignal1')[0][0]+", "+
                       node.game.memory.stage[TUT2_voting].fetchArray('b1signals')[0][0]+", "+
                       node.game.memory.stage[TUT2_voting].fetchArray('b2signals')[0][0];

     TUT2_signals=cut_comma(TUT2_signals);
     //TUT 3
     var TUT3_feedback= (Pstep1.stage-2) + '.' + (Pstep1.step) + '.' + (Pstep1.round-3);
     var TUT3_voting= (Pstep1.stage-2) + '.' + (Pstep1.step-1) + '.' + (Pstep1.round-3);
     var TUT3_signaling= (Pstep1.stage-2) + '.' + (Pstep1.step-2) + '.' + (Pstep1.round-3);

     var TUT3_decision=node.game.memory.stage[TUT3_feedback].fetchArray('fdecision')[0][0];
     var TUT3_signals= node.game.memory.stage[TUT3_signaling].fetchArray('sharesignal1')[0][0]+", "+
                       node.game.memory.stage[TUT3_voting].fetchArray('b1signals')[0][0]+", "+
                       node.game.memory.stage[TUT3_voting].fetchArray('b2signals')[0][0];

     TUT3_signals=cut_comma(TUT3_signals);

      //GAME 1
      var GAME1_feedback= (Pstep1.stage) + '.' + (Pstep1.step) + '.' + (Pstep1.round-5);
      var GAME1_voting= (Pstep1.stage) + '.' + (Pstep1.step-1) + '.' + (Pstep1.round-5);
      var GAME1_signaling= (Pstep1.stage) + '.' + (Pstep1.step-2) + '.' + (Pstep1.round-5);
      //console.log(node.game.memory.stage[GAME1_feedback].fetch());
      var GAME1_decision=node.game.memory.stage[GAME1_feedback].fetchArray('fdecision')[0][0];
      var GAME1_signals= node.game.memory.stage[GAME1_signaling].fetchArray('sharesignal1')[0][0]+", "+
                        node.game.memory.stage[GAME1_voting].fetchArray('b1signals')[0][0]+", "+
                        node.game.memory.stage[GAME1_voting].fetchArray('b2signals')[0][0];
      var GAME1_paid=node.game.memory.stage[GAME1_feedback].fetchArray('payoff')[0][0];
      GAME1_signals=cut_comma(GAME1_signals);

      //GAME 2
      var GAME2_feedback= (Pstep1.stage) + '.' + (Pstep1.step) + '.' + (Pstep1.round-4);
      var GAME2_voting= (Pstep1.stage) + '.' + (Pstep1.step-1) + '.' + (Pstep1.round-4);
      var GAME2_signaling= (Pstep1.stage) + '.' + (Pstep1.step-2) + '.' + (Pstep1.round-4);

      var GAME2_decision=node.game.memory.stage[GAME2_feedback].fetchArray('fdecision')[0][0];
      var GAME2_signals= node.game.memory.stage[GAME2_signaling].fetchArray('sharesignal1')[0][0]+", "+
                        node.game.memory.stage[GAME2_voting].fetchArray('b1signals')[0][0]+", "+
                        node.game.memory.stage[GAME2_voting].fetchArray('b2signals')[0][0];
      var GAME2_paid=node.game.memory.stage[GAME2_feedback].fetchArray('payoff')[0][0];
      GAME2_signals=cut_comma(GAME2_signals);


      //GAME 3
      var GAME3_feedback= (Pstep1.stage) + '.' + (Pstep1.step) + '.' + (Pstep1.round-3);
      var GAME3_voting= (Pstep1.stage) + '.' + (Pstep1.step-1) + '.' + (Pstep1.round-3);
      var GAME3_signaling= (Pstep1.stage) + '.' + (Pstep1.step-2) + '.' + (Pstep1.round-3);

      var GAME3_decision=node.game.memory.stage[GAME3_feedback].fetchArray('fdecision')[0][0];
      var GAME3_signals= node.game.memory.stage[GAME3_signaling].fetchArray('sharesignal1')[0][0]+", "+
                        node.game.memory.stage[GAME3_voting].fetchArray('b1signals')[0][0]+", "+
                        node.game.memory.stage[GAME3_voting].fetchArray('b2signals')[0][0];
      var GAME3_paid=node.game.memory.stage[GAME3_feedback].fetchArray('payoff')[0][0];
      GAME3_signals=cut_comma(GAME3_signals);
      //console.log(GAME3_decision);
      //console.log(GAME3_signals);

      //GAME 4
      var GAME4_feedback= (Pstep1.stage) + '.' + (Pstep1.step) + '.' + (Pstep1.round-2);
      var GAME4_voting= (Pstep1.stage) + '.' + (Pstep1.step-1) + '.' + (Pstep1.round-2);
      var GAME4_signaling= (Pstep1.stage) + '.' + (Pstep1.step-2) + '.' + (Pstep1.round-2);
      //console.log(node.game.memory.stage[GAME4_feedback].fetch());
      var GAME4_decision=node.game.memory.stage[GAME4_feedback].fetchArray('fdecision')[0][0];
      var GAME4_signals= node.game.memory.stage[GAME4_signaling].fetchArray('sharesignal1')[0][0]+", "+
                        node.game.memory.stage[GAME4_voting].fetchArray('b1signals')[0][0]+", "+
                        node.game.memory.stage[GAME4_voting].fetchArray('b2signals')[0][0];
      var GAME4_paid=node.game.memory.stage[GAME4_feedback].fetchArray('payoff')[0][0];
      GAME4_signals=cut_comma(GAME4_signals);

      //GAME 5
      var GAME5_feedback= (Pstep1.stage) + '.' + (Pstep1.step) + '.' + (Pstep1.round-1);
      var GAME5_voting= (Pstep1.stage) + '.' + (Pstep1.step-1) + '.' + (Pstep1.round-1);
      var GAME5_signaling= (Pstep1.stage) + '.' + (Pstep1.step-2) + '.' + (Pstep1.round-1);

      var GAME5_decision=node.game.memory.stage[GAME5_feedback].fetchArray('fdecision')[0][0];
      var GAME5_signals= node.game.memory.stage[GAME5_signaling].fetchArray('sharesignal1')[0][0]+", "+
                        node.game.memory.stage[GAME5_voting].fetchArray('b1signals')[0][0]+", "+
                        node.game.memory.stage[GAME5_voting].fetchArray('b2signals')[0][0];
      var GAME5_paid=node.game.memory.stage[GAME5_feedback].fetchArray('payoff')[0][0];
      GAME5_signals=cut_comma(GAME5_signals);


      //GAME 6
      var GAME6_feedback= (Pstep1.stage) + '.' + (Pstep1.step) + '.' + (Pstep1.round);
      var GAME6_voting= (Pstep1.stage) + '.' + (Pstep1.step-1) + '.' + (Pstep1.round);
      var GAME6_signaling= (Pstep1.stage) + '.' + (Pstep1.step-2) + '.' + (Pstep1.round);

      var GAME6_decision=node.game.memory.stage[GAME6_feedback].fetchArray('fdecision')[0][0];
      var GAME6_signals= node.game.memory.stage[GAME6_signaling].fetchArray('sharesignal1')[0][0]+", "+
                        node.game.memory.stage[GAME6_voting].fetchArray('b1signals')[0][0]+", "+
                        node.game.memory.stage[GAME6_voting].fetchArray('b2signals')[0][0];
      var GAME6_paid=node.game.memory.stage[GAME6_feedback].fetchArray('payoff')[0][0];
      GAME6_signals=cut_comma(GAME6_signals);


      // I get the signals from the signal step and put them in one String




        // Temporary (we just need the id).
        var playerId = node.game.pl.first();
        playerId = playerId.id;
        //console.log(playerId);
        var d={ "TUT1_signals": TUT1_signals,
                "TUT1_decision": TUT1_decision,
                "TUT2_signals": TUT2_signals,
                "TUT2_decision": TUT2_decision,
                "TUT3_signals": TUT3_signals,
                "TUT3_decision": TUT3_decision,
                "GAME1_decision": GAME1_decision,
                "GAME1_signals": GAME1_signals,
                "GAME2_decision": GAME2_decision,
                "GAME2_signals": GAME2_signals,
                "GAME3_decision": GAME3_decision,
                "GAME3_signals": GAME3_signals,
                "GAME4_decision": GAME4_decision,
                "GAME4_signals": GAME4_signals,
                "GAME5_decision": GAME5_decision,
                "GAME5_signals": GAME5_signals,
                "GAME6_decision": GAME6_decision,
                "GAME6_signals": GAME6_signals,
                "GAME1_paid": GAME1_paid,
                "GAME2_paid": GAME2_paid,
                "GAME3_paid": GAME3_paid,
                "GAME4_paid": GAME4_paid,
                "GAME5_paid": GAME5_paid,
                "GAME6_paid": GAME6_paid

        }


                //  console.log(d);

        node.say('DATA', playerId, d);
    }

  });

  stager.extendStep('belief_feedback',{
    cb: function(){
      var box, bomb, prize, paid2, paid3, paid4;
      var GAME1_paid, GAME2_paid, GAME3_paid,
          GAME4_paid, GAME5_paid, GAME6_paid,
          guess, truth, paid;

      var Pstep1=node.game.getPreviousStep(1);
      var Pstep1_s= Pstep1.stage + '.' + (Pstep1.step) + '.' + Pstep1.round;

      box=node.game.memory.stage[Pstep1_s].fetchArray('open')[0][0];
      bomb=node.game.memory.stage[Pstep1_s].fetchArray('bomb')[0][0];
      prize=node.game.memory.stage[Pstep1_s].fetchArray('prize')[0][0];

      if(box<bomb){
        paid2=prize;
      }
      else{
        paid2=0;
      }

      var Pstep2=node.game.getPreviousStep(2);
      var Pstep2_s= Pstep2.stage + '.' + (Pstep2.step) + '.' + Pstep2.round;

      GAME1_paid=node.game.memory.stage[Pstep2_s].fetchArray('GAME1_paid')[0][0];
      GAME2_paid=node.game.memory.stage[Pstep2_s].fetchArray('GAME2_paid')[0][0];
      GAME3_paid=node.game.memory.stage[Pstep2_s].fetchArray('GAME3_paid')[0][0];
      GAME4_paid=node.game.memory.stage[Pstep2_s].fetchArray('GAME4_paid')[0][0];
      GAME5_paid=node.game.memory.stage[Pstep2_s].fetchArray('GAME5_paid')[0][0];
      GAME6_paid=node.game.memory.stage[Pstep2_s].fetchArray('GAME6_paid')[0][0];

      //only one randomly drawn game is paid:
      var random_game=Math.round(Math.random()*5+1);

      var random_game2=Math.round(Math.random()*5+1);

      while(random_game2===random_game){
        random_game2=Math.round(Math.random()*5+1);
      }

      if(random_game===1){
        paid3=GAME1_paid;
      }
      if(random_game===2){
        paid3=GAME2_paid;
      }
      if(random_game===3){
        paid3=GAME3_paid;
      }
      if(random_game===4){
        paid3=GAME4_paid;
      }
      if(random_game===5){
        paid3=GAME5_paid;
      }
      if(random_game===6){
        paid3=GAME6_paid;
      }

      if(random_game2===1){
        paid4=GAME1_paid;
      }
      if(random_game2===2){
        paid4=GAME2_paid;
      }
      if(random_game2===3){
        paid4=GAME3_paid;
      }
      if(random_game2===4){
        paid4=GAME4_paid;
      }
      if(random_game2===5){
        paid4=GAME5_paid;
      }
      if(random_game2===6){
        paid4=GAME6_paid;
      }

      guess=node.game.memory.stage[Pstep2_s].fetchArray('guess')[0][0];

      truth= node.game.settings.bias;

      if(guess==truth){
        paid=40;
      }
      if(Math.abs(guess-truth)===1){
        paid=30;
      }
      if(Math.abs(guess-truth)===2){
        paid=10;
      }
      if(Math.abs(guess-truth)>2){
        paid=0;
      }
      // Temporary (we just need the id).
      var playerId = node.game.pl.first();
      playerId = playerId.id;

      var client = channel.registry.getClient(playerId);

      //console.log(client);

      // Ternary Assignment.
      client.win = client.win ? (client.win + paid) : paid;

      client.win = client.win ? (client.win + paid2) : paid2;

      client.win = client.win ? (client.win + paid3) : paid3;

      client.win = client.win ? (client.win + paid4) : paid4;
      //console.log(playerId);
      var d={ "guess": guess,
              "GAME1_paid": GAME1_paid,
              "GAME2_paid": GAME2_paid,
              "GAME3_paid": GAME3_paid,
              "GAME4_paid": GAME4_paid,
              "GAME5_paid": GAME5_paid,
              "GAME6_paid": GAME6_paid,
              "win": paid,
              "random_game": random_game,
              "random_game2": random_game2,
              "win3": paid3,
              "win4": paid4,
              "truth": truth,
              "box":box,
              "bomb":bomb,
              "win2": paid2
      }


              //  console.log(d);

      node.say('DATA', playerId, d);

    }
  })


    // in the last stage the data is saved.
    stager.extendStep('end', {
        cb: function() {
          var playerId = node.game.pl.first();
          playerId = playerId.id;


          var client = channel.registry.getClient(playerId);

          // Ternary Assignment.
          client.win = client.win ? (client.win + 0) : 0;

            gameRoom.computeBonus({
                amt: true,
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
