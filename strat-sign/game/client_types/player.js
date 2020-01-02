/**
 * # Player type implementation of the game stages
 * Copyright(c) 2019 Samuel <sammuell@mail.uni-mannheim.de>
 * MIT Licensed
 *
 * Each client type must extend / implement the stages defined in `game.stages`.
 * Upon connection each client is assigned a client type and it is automatically
 * setup with it.
 *
 * http://www.nodegame.org
 * ---
 */

"use strict";

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

    stager.setOnInit(function() {

        // Initialize the client.

        var header, frame;

        // Bid is valid if it is a number between 0 and 100.
        this.isValidBid = function(n) {
            return node.JSUS.isInt(n, -1, 2);
        };

        this.randomOffer = function(decison, submitSignals) {
            var n;
            n = J.randomInt(-1,2);
            offer.value = n;
            submitOffer.click();
        };

        // Setup page: header + frame.
        header = W.generateHeader();
        frame = W.generateFrame();

        // Add widgets.
        this.visualRound = node.widgets.append('VisualRound', header, {
            title: false
        });
        this.visualTimer = node.widgets.append('VisualTimer', header);

        this.doneButton = node.widgets.append('DoneButton', header);

        // Additional debug information while developing the game.
        // this.debugInfo = node.widgets.append('DebugInfo', header)
    });

    stager.extendStep('instructions', {
        frame: 'instructions.htm',
        cb:function(){
          W.setInnerHTML('bias', node.game.settings.bias);
          W.setInnerHTML('bias2', node.game.settings.bias2);
        }
    });

    stager.extendStep('signals', {
        donebutton: false,
        frame: 'game.htm',
        timer: settings.bidTime,
            cb: function() {
              var button, decision1, decision2, decision3,
                  div, urncolor, noturncolor,
                  plyrsignal1, plyrsignal2, plyrsignal3;

              var shar_sig_array=[];

                  decision1= -99;
                  decision2= -99;
                  decision3= -99;

              if ( Math.random()>0.5){
                   urncolor= 'red';
                   noturncolor= 'blue';
              }
              else{
                  urncolor='blue';
                  noturncolor= 'red';
              }
              if (Math.random()< node.game.settings.getsignal) {
                if (Math.random()< node.game.settings.correctsignal){
                  plyrsignal1=urncolor;
                }
                else{
                  plyrsignal1=noturncolor;
                }
              }
              else {
                plyrsignal1= '';
                div = W.getElementById('signal1').style.display = 'none';
              }

              if (Math.random()< node.game.settings.getsignal) {
                if (Math.random()< node.game.settings.correctsignal){
                  plyrsignal2=urncolor;
                }
                else{
                  plyrsignal2=noturncolor;
                }
              }
              else {
                plyrsignal2= '';
                div = W.getElementById('signal2').style.display = 'none';

              }

              if (Math.random()< node.game.settings.getsignal) {
                if (Math.random()< node.game.settings.correctsignal){
                  plyrsignal3=urncolor;

                }
                else{
                  plyrsignal3=noturncolor;
                }
              }
              else {
                plyrsignal3= '';
                div = W.getElementById('signal3').style.display = 'none';
              }

              W.setInnerHTML('ps1', plyrsignal1);
              W.setInnerHTML('ps2', plyrsignal2);
              W.setInnerHTML('ps3', plyrsignal3);
              button = W.getElementById('submitSignals');
              // Listen on click event.
              button.onclick = function() {
              // Validate offer.
              if (plyrsignal1===''){
                decision1 = 0;
              }
              if (plyrsignal2===''){
                decision2 = 0;
              }
              if (plyrsignal3===''){
                decision3 = 0;
              }
                if (W.getElementById('hide1').checked){
                  decision1 = 0;
                }
                if (W.getElementById('share1').checked){
                  decision1 = 1;
                }
                if (W.getElementById('hide2').checked){
                  decision2 = 0;
                }
                if (W.getElementById('share2').checked){
                  decision2 = 1;
                }
                if (W.getElementById('hide3').checked){
                  decision3 = 0;
                }
                if (W.getElementById('share3').checked){
                  decision3 = 1;
                }

                var dsum=decision1+decision2+decision3;
                if(dsum<0){
                  W.writeln('You should decide for all possible signals');
                  return;
                }

                if (plyrsignal1===''){
                  decision1 = 0;
                }
                if (plyrsignal2===''){
                  decision2 = 0;
                }
                if (plyrsignal3===''){
                  decision3 = 0;
                }

                var sharesignals='';
                // Validate incoming offer.
               if (decision1 == 1) {
                    sharesignals= sharesignals + ', ' + plyrsignal1;
                    if(plyrsignal1==="red"){
                      shar_sig_array.push(1);
                    }
                    if(plyrsignal1==="blue"){
                      shar_sig_array.push(0);
                    }
                  }
               if (decision2 == 1) {
                    sharesignals= sharesignals + ', ' + plyrsignal2;
                    if(plyrsignal2==="red"){
                      shar_sig_array.push(1);
                    }
                    if(plyrsignal2==="blue"){
                      shar_sig_array.push(0);
                    }
                  }
               if (decision3 == 1) {
                    sharesignals= sharesignals + ', ' + plyrsignal3;
                    if(plyrsignal3==="red"){
                      shar_sig_array.push(1);
                    }
                    if(plyrsignal3==="blue"){
                      shar_sig_array.push(0);
                    }
                  }

                sharesignals = sharesignals.slice(1);
                button.disabled = true;

              // Mark the end of the round, and
              // store the decision in the server.
                node.done({ decision1: decision1,
                            decision2: decision2,
                            decision3: decision3,
                            urncolor: urncolor,
                            noturncolor: noturncolor,
                            plyrsignal1:plyrsignal1,
                            plyrsignal2:plyrsignal2,
                            plyrsignal3:plyrsignal3,
                            sharesignal1: sharesignals,
                            sig_array: shar_sig_array});
              };
          },
          timeup: function() {
              node.game.randomOffer(W.getElementById('offer'),
                                    W.getElementById('submitOffer'));
        },
        timeup: function() {
            node.game.randomOffer(W.getElementById('offer'),
                                  W.getElementById('submitOffer'));
        }
    });

    stager.extendStep('voting', {
      donebutton: false,
      frame: 'vote.htm',
      timer: settings.bidTime,

          cb: function() {
              var vote, Red_button, Blue_button, fdecision;

              node.on.data('SIG_P' , function(msg){
                var signal1=msg.data;
                W.setInnerHTML('signals1', signal1);
              });

              node.on.data('SIG_B1' , function(msg){
                var signal2=msg.data;
                W.setInnerHTML('signals2', signal2);
              });

              node.on.data('SIG_B2' , function(msg){
                var signal3=msg.data;
                W.setInnerHTML('signals3', signal3);
              });

              node.on.data('FDECISION' , function(msg){
                fdecision=msg.data;
              });

              fdecision=this.fdecision;

              Red_button=W.getElementById('Red_button');
              Blue_button=W.getElementById('Blue_button');


              Red_button.onclick=function() {
                vote='red';
                Red_button.disabled = true;
                node.done({
                  vote: vote,
                  fdecision: fdecision
                });
              }
           Blue_button.onclick=function() {
                vote='blue';
                Blue_button.disabled = true;
                node.done({
                  vote: vote,
                  fdecision: fdecision
                });
              }
            },
            timeup: function() {
                node.game.randomOffer(W.getElementById('offer'),
                                      W.getElementById('submitOffer'));
          }

    });

    stager.extendStep('feedback', {
        donebutton: false,
        frame: 'feedback.htm',
        timer: settings.bidTime,
        cb: function() {
          var urncolor, fdecision, correct, payed, c_button;

          node.on.data('URNCOLOR', function(msg){
              urncolor=msg.data;
              W.setInnerHTML('urncolor', urncolor);
          });
          node.on.data('FDECISION', function(msg){
              fdecision=msg.data;
              W.setInnerHTML('committee_decision', fdecision);
          });
          node.on.data('CORRECT', function(msg){
              correct=msg.data;
              W.setInnerHTML('wrong_right', correct);
          });
          node.on.data('PAYED', function(msg){
              payed=msg.data;
              W.setInnerHTML('payoff', payed);
          });



          c_button=W.getElementById('Continue_button');

          c_button.onclick=function(){
            node.done({
              payoff:this.payed,
              correct: this.correct
            });
          }


        }
    });

    stager.extendStep('end', {
        donebutton: false,
        frame: 'end.htm',
        cb: function() {
            node.game.visualTimer.setToZero();
        }
    });
};
