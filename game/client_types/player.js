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

    // Setting the SOLO rule: game steps each time node.done() is called,
    // ignoring the state of other clients.
    const ngc = require('nodegame-client');
    stager.setDefaultStepRule(ngc.stepRules.SOLO);

    stager.setOnInit(function() {

        // Initialize the client.

        var header, frame, infoPanel;




        // Setup page: header + frame.
        header = W.generateHeader();
        frame = W.generateFrame();

        // Add infoPanel
        infoPanel = W.generateInfoPanel(undefined, {
          onStep: 'close'
        });

        // Generate the toggle button and append it to the header.
        this.infoButton = infoPanel.createToggleButton('Show Player Behavior');
        this.infoButton.disabled = true;
        this.infoButton.onclick=function(){
          infoPanel.toggle();
          if(infoPanel.isVisible===true){
              parent.scrollTo(0,0);
              this.innerHTML='Hide Player Behavior';
          }
          if(infoPanel.isVisible===false){
            this.innerHTML='Show Player Behavior';
          }

        }

        // Add a new div to the info panel.
        this.infoDiv = document.createElement('div');
        this.infoDiv.innerHTML = '<h3>Behavior of automated players</h3>'+
        "<h4>The automated players always share all private signals they receive. Their voting decision is made as follows: </br>"+
        "1. They count the <strong>number of shared signals that show '<span style='color:blue'>blue</span>'</strong> and multiply if by <strong>" +node.game.settings.bias2+"</strong>.<br>"+
        '2. Then they count the <strong>number of shared signals that show "<span style="color:red">red</span>"</strong> and multiply it by <span id="bias" style="font-weight:bold; color: red">x</span>, which is a number between 0 and 30.<br>'+
        "3. Finally, the automated players compare the numbers they calculated and <strong>vote for the color that has the larger number</strong>. If both numbers are the <strong>same</strong>, a coin toss decides the color they choose.</h4>"+
        "The automated players are identical and made the following choices after seeing the signals given below: <br><br>"+
        '<table style="width:60%; margin-left:20%; margin-right:20%">'+
          '<tr>'+
            '<th> Signals </th>'+
            '<th> Decision </th>'+
          '</tr>'+
          '<tr>'+
            '<td>  <span style="color:blue">blue</span>,'+
                  '<span style="color:red">red</span>,'+
                  '<span style="color:red">red</span>,'+
                  '<span style="color:red">red</span>,'+
                  '<span style="color:blue">blue</span>,'+
                  '<span style="color:red">red</span></td>'+
            '<td> '+ node.game.settings.first_decision +'</td>'+
          '</tr>'+
          '<tr>'+
            '<td>  <span style="color:blue">blue</span>,'+
                  '<span style="color:blue">blue</span>,'+
                  '<span style="color:red">red</span>,'+
                  '<span style="color:red">red</span>,'+
                  '<span style="color:blue">blue</span> </td>'+
            '<td>'+node.game.settings.second_decision +'</td>'+
          '</tr>'+
          '<tr>'+
            '<td>  <span style="color:red">red</span></td>'+
            '<td>'+ node.game.settings.third_decision +'</td>'+
          '</tr>'+
          '<tr>'+
            '<td>  <span style="color:red">red</span>,'+
                  '<span style="color:red">red</span>,'+
                  '<span style="color:blue">blue</span>,'+
                  '<span style="color:red">red</span></td>'+
            '<td>'+ node.game.settings.fourth_decision+  '</td>'+
          '</tr>'+
          '<tr>' +
            '<td>  <span style="color:blue">blue</span>,'+
                  '<span style="color:red">red</span>,'+
                  '<span style="color:red">red</span>,'+
                  '<span style="color:blue">blue</span>,'+
                  '<span style="color:blue">blue</span>,'+
                  '<span style="color:blue">blue</span></td>'+
            '<td>' +node.game.settings.fifth_decision+ '</td>'+
          '</tr>'+
        '</table>';

        W.addClass(this.infoDiv, 'inner');
        infoPanel.infoPanelDiv.appendChild(this.infoDiv);

        header.appendChild(this.infoButton);

        // Add widgets.
        this.visualRound = node.widgets.append('VisualRound', header, {
            title: false
        });
        // I don't think I need a timer because players play alone.
        //this.visualTimer = node.widgets.append('VisualTimer', header);

        this.doneButton = node.widgets.append('DoneButton', header);

        // Additional debug information while developing the game.
        //this.debugInfo = node.widgets.append('DebugInfo', header)




    });

    stager.extendStep('welcome', {
      frame: 'welcome.htm',
      cb: function(){
        //some variables for the welcome stage
        W.setInnerHTML('time', 20);
        W.setInnerHTML('low_money', 0.50);
        W.setInnerHTML('high_money', 5.98);
      }
    });

    stager.extendStep('instructions', {
        frame: 'instructions.htm',

        cb:function(){
            //Instructions differ between treatments.
            var rsig=4*node.game.settings.bias;
            var bsig=3*node.game.settings.bias2;

            var csig=Math.round(100*node.game.settings.correctsignal);
            var wsig=Math.round(100*(1-node.game.settings.correctsignal));
            W.setInnerHTML('red_count', rsig);
            W.setInnerHTML('blue_count', bsig);
            W.setInnerHTML('correctsignal', csig);
            W.setInnerHTML('wrongsignal', wsig);
            W.setInnerHTML('bias2', node.game.settings.bias2);
            W.setInnerHTML('exchange-rate', node.game.settings.EXCHANGE_RATE_INSTRUCTIONS);
            W.setInnerHTML('first_decision', node.game.settings.first_decision);
            W.setInnerHTML('second_decision', node.game.settings.second_decision);
            W.setInnerHTML('third_decision', node.game.settings.third_decision);
            W.setInnerHTML('fourth_decision', node.game.settings.fourth_decision);
            W.setInnerHTML('fifth_decision', node.game.settings.fifth_decision);
        }
    });


    //a short quiz to test the participants understanding of the game
    // I would really want the back button to work in case somebody has not read
    // the instructions well enough
    stager.extendStep('quiz', {
      init: function() {

          parent.scrollTo(0,0);

          this.infoButton.disabled=false;
          this.infoButton.innerHTML='Show Player Behavior';

          node.on.step(function(){
            W.infoPanel.close();
          })

      },



	    widget: {
	       name: 'ChoiceManager',
	       root: 'container',
	       options: {
		         className: 'centered',
		         mainText: 'Here we test your understanding of the instructions',
		         hint: 'Good luck!',
		         forms: [
		             {
			            name: 'ChoiceTable',
			            id: 'understand_task',
			            mainText: 'What do you have to decide on in your group?',
			            choices: [
			              'The color of an urn.',
			              'The color of a box.',
			              'The most beautiful color.',
			              'I don\'t know.',
			              "The color preferred by most people."
			               ],
			            correctChoice: 0,
			            shuffleChoices: true,
			            orientation: 'V' //vertical
		             },
		             {
			            name: 'ChoiceTable',
			            id: 'possible_action',
			            mainText: 'What can you do with the private signals that you receive?',
			            choices: [
			                     'Either share the signals with the automated players or hide them.',
                           'Either share the true values of the signals or lie about them.',
                           'Nothing.',
                           'I don\'t know.',
                           'I can decide which players receives which of the signals, while I can provide any signal only to a single automated player.'
			                      ],
			            correctChoice: 0,
			            shuffleChoices: true,
			            orientation: 'V' //horizontal
                },
                {
                 name: 'ChoiceTable',
                 id: 'automated_players',
                 mainText: 'With which number does the automated player multiply the count of blue signals?',
                 choices: [
                          '0',
                          '1',
                          '5',
                          '10',
                          '15',
                          '21',
                          '30'
                           ],
                 correctChoice: 3,
                 shuffleChoices: true,
                 orientation: 'V' //horizontal
                }
		        ]
	    }
	   }
  });



  // The stage in which all participants receive their signals and the urn color
  // is decided.
  stager.extendStep('signalsTUT', {
      donebutton: false,
      frame: 'gameTUT.htm',

      init: function() {

          this.infoButton.disabled=false;
          this.infoButton.innerHTML='Show Player Behavior';

          node.on.step(function(){
            W.infoPanel.close();
          })
          parent.scrollTo(0,0);
      },


      cb: function() {
        var csig=Math.round(100*node.game.settings.correctsignal);
        var wsig=Math.round(100*(1-node.game.settings.correctsignal));
        W.setInnerHTML('correctsignal', csig);
        W.setInnerHTML('wrongsignal', wsig);

          // variables I need
          var button, decision1, decision2,
              div, urncolor, noturncolor,
              plyrsignal1, plyrsignal2;
          //this array gets the information whether a signal is shared (1) or not (0)
          var shar_sig_array=[];

          // decisions get a default of -99 to make it easy to check whether
          // a decision was made for all signals
          decision1= -99;
          decision2= -99;



          // the urncolor is decided randomly
          // the noturncolor has to be decided as well
          if ( Math.random()>=0.5){
              urncolor= 'red';
              noturncolor= 'blue';
          }
          else{
              urncolor='blue';
              noturncolor= 'red';
          }

          // now it is decided whether signal 1 is conatining information
          if (Math.random()< node.game.settings.getsignal) {
              // and now whether the information is correct
              if (Math.random()< node.game.settings.correctsignal){
                  plyrsignal1=urncolor;
                  div = W.getElementById('ps1').style.color = plyrsignal1;
              }
              else{
                  plyrsignal1=noturncolor;
                  div = W.getElementById('ps1').style.color = plyrsignal1;
              }
          }
          // if the signal is empty, it is not displayed at all
          else {
              plyrsignal1= '';
              div = W.getElementById('signal1').style.display = 'none';
          }

          // the same procedure for signal 2
          if (Math.random()< node.game.settings.getsignal) {
              if (Math.random()< node.game.settings.correctsignal){
                  plyrsignal2=urncolor;
                  div = W.getElementById('ps2').style.color = plyrsignal2;
              }
              else{
                  plyrsignal2=noturncolor;
                  div = W.getElementById('ps2').style.color = plyrsignal2;
              }
          }
          else {
              plyrsignal2= '';
              div = W.getElementById('signal2').style.display = 'none';

          }


          // signals are sent to the html file
          W.setInnerHTML('ps1', plyrsignal1);
          W.setInnerHTML('ps2', plyrsignal2);

          // button is identified that submit the signals to the next stage
          button = W.getElementById('submitSignals');
          // Listen on click event.
          button.onclick = function() {
              // first it is decided that empty signals are never shared.
              if (plyrsignal1===''){
                  decision1 = 0;
              }
              if (plyrsignal2===''){
                  decision2 = 0;
              }

              // now it is checked for each signal whether it should be shared or hided
              // the decision is saved in the different decision variables
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


              // Now, it is checked whether there has bee a decuision made for all signals.
              // An error message is written.
              var dsum=decision1+decision2;
              if(dsum<0){

                  div = W.getElementById('warning').style.display = '';
                  return;
              }

              // Making sure, that empty signals are not shared.
              if (plyrsignal1===''){
                  decision1 = 0;
              }
              if (plyrsignal2===''){
                  decision2 = 0;
              }


              // A String variable that is used to display the signals in the next stage.
              var sharesignals='';

              // If the signal is shared, it is added to the string and
              // a (1) is written in the array that tells us whether a signal was shared.
              if (decision1 == 1) {
                  sharesignals= sharesignals + ', <span style="color:' + plyrsignal1+'">'+plyrsignal1+'</span>';
                  if(plyrsignal1==="red"){
                      shar_sig_array.push(1);
                  }
                  if(plyrsignal1==="blue"){
                      shar_sig_array.push(0);
                  }
              }
              if (decision2 == 1) {
                  sharesignals= sharesignals + ', <span style="color:' + plyrsignal2+'">'+ plyrsignal2+'</span>';
                  if(plyrsignal2==="red"){
                      shar_sig_array.push(1);
                  }
                  if(plyrsignal2==="blue"){
                      shar_sig_array.push(0);
                  }
              }

              // the sharesignals string starts with a comma that is removed
              sharesignals = sharesignals.slice(1);
              button.disabled = true;

              // Mark the end of the round, and
              // store the decision in the server.
              node.done({ decision1: decision1,
                          decision2: decision2,
                          urncolor: urncolor,
                          noturncolor: noturncolor,
                          plyrsignal1:plyrsignal1,
                          plyrsignal2:plyrsignal2,
                          sharesignal1: sharesignals,
                          sig_array: shar_sig_array});
          };
      }

  });

  // The next step in the game stage is the voting.
  // All shared signals must be displayed here!
  stager.extendStep('votingTUT', {
      donebutton: false,

      frame: 'voteTUT.htm',
      // timer: settings.bidTime,
      init:function() {
        parent.scrollTo(0,0);
        this.infoButton.innerHTML='Show Player Behavior';

      },

      cb: function() {
          var vote, Red_button, Blue_button, fdecision, signal1, signal2, signal3;
          // the signals that the player shared are coming from the logic
          node.on.data('DATA' , function(msg){
              signal1=msg.data.playsig;
              W.setInnerHTML('signals1', signal1);

          // the signals that the first automated player received and
          // shared are created in logic and also send to the player

              signal2=msg.data.b1sig;
              W.setInnerHTML('signals2', signal2);

          // the signals that the second automated player received and
          // shared are created in logic and also send to the player

              signal3=msg.data.b2sig;
              W.setInnerHTML('signals3', signal3);
          });
          // since the player is never the pivotal voter, the decision was already
          // computed in the logic and send to the player
          node.on.data('FDECISION' , function(msg){
              fdecision=msg.data;
          });
          // need to get the decision
          fdecision=this.fdecision;
          signal2=this.signal2;
          signal3=this.signal3;
          // buttons for voting are initiated
          Red_button=W.getElementById('Red_button');
          Blue_button=W.getElementById('Blue_button');

          // on click functions are generated and voting decision is stored
          Red_button.onclick=function() {
              vote='red';
              Red_button.disabled = true;
              node.done({
                  b1signals: signal2,
                  b2signals: signal3,
                  vote: vote,
                  fdecision: fdecision
              });
          }
          Blue_button.onclick=function() {
              vote='blue';
              Blue_button.disabled = true;
              node.done({
                  b1signals: signal2,
                  b2signals: signal3,
                  vote: vote,
                  fdecision: fdecision
              });
          }
      }

  });

  // in order to enable learning, the players receive feedback about the voting decision
  // and their payoff
  stager.extendStep('feedbackTUT', {
      donebutton: false,
      frame: 'feedbackTUT.htm',
      init:function() {
        parent.scrollTo(0,0);
        this.infoButton.innerHTML='Show Player Behavior';

      },


      cb: function() {
          var urncolor, fdecision, correct, paid, c_button;
          // all variables are sent by logic
          node.on.data('DATA', function(msg){
              //signals=msg.data.signals
              W.setInnerHTML('signals', msg.data.signals);


              W.setInnerHTML('signals1', msg.data.sharesignal1);
              W.setInnerHTML('signals2', msg.data.sharesignal2);
              W.setInnerHTML('signals3', msg.data.sharesignal3);
              W.setInnerHTML('vdecision', msg.data.vote);
              W.setInnerHTML('v_correct',  msg.data.v_correct);
              W.setInnerHTML('urncolor',  msg.data.urncolor);
              fdecision=msg.data.fdecision;
              W.setInnerHTML('committee_decision',  msg.data.fdecision);

              correct=msg.data.correct;
              W.setInnerHTML('wrong_right',  msg.data.correct);

              paid=msg.data.paid;
              W.setInnerHTML('payoff',  msg.data.paid);
          });

          fdecision=this.fdecision;
          paid=this.paid;
          correct=this.correct;
          // button to continue to next round
          c_button=W.getElementById('Continue_button');

          c_button.onclick=function(){
              node.done({
                  fdecision: fdecision,
                  payoff: paid,
                  correct: correct
              });
          }


      }
  });





      stager.extendStep('START', {
        frame: 'START.htm',
        donebutton: true,
        init:function() {
          parent.scrollTo(0,0);
          this.infoButton.innerHTML='Show Player Behavior';

        }
      });






    // The stage in which all participants receive their signals and the urn color
    // is decided.
    stager.extendStep('signals', {
        donebutton: false,
        frame: 'game.htm',
        init:function() {
          parent.scrollTo(0,0);
          this.infoButton.innerHTML='Show Player Behavior';

        },


        cb: function() {
          var csig=Math.round(100*node.game.settings.correctsignal);
          var wsig=Math.round(100*(1-node.game.settings.correctsignal));
          W.setInnerHTML('correctsignal', csig);
          W.setInnerHTML('wrongsignal', wsig);

            // variables I need
            var button, decision1, decision2,
                div, urncolor, noturncolor,
                plyrsignal1, plyrsignal2;
            //this array gets the information whether a signal is shared (1) or not (0)
            var shar_sig_array=[];

            // decisions get a default of -99 to make it easy to check whether
            // a decision was made for all signals
            decision1= -99;
            decision2= -99;


            // the urncolor is decided randomly
            // the noturncolor has to be decided as well
            if ( Math.random()>=0.5){
                urncolor= 'red';
                noturncolor= 'blue';
            }
            else{
                urncolor='blue';
                noturncolor= 'red';
            }

            // now it is decided whether signal 1 is conatining information
            if (Math.random()< node.game.settings.getsignal) {
                // and now whether the information is correct
                if (Math.random()< node.game.settings.correctsignal){
                    plyrsignal1=urncolor;
                    div = W.getElementById('ps1').style.color = plyrsignal1;
                }
                else{
                    plyrsignal1=noturncolor;
                    div = W.getElementById('ps1').style.color = plyrsignal1;
                }
            }
            // if the signal is empty, it is not displayed at all
            else {
                plyrsignal1= '';
                div = W.getElementById('signal1').style.display = 'none';
            }

            // the same procedure for signal 2
            if (Math.random()< node.game.settings.getsignal) {
                if (Math.random()< node.game.settings.correctsignal){
                    plyrsignal2=urncolor;
                    div = W.getElementById('ps2').style.color = plyrsignal2;
                }
                else{
                    plyrsignal2=noturncolor;
                    div = W.getElementById('ps2').style.color = plyrsignal2;
                }
            }
            else {
                plyrsignal2= '';
                div = W.getElementById('signal2').style.display = 'none';

            }



            // signals are sent to the html file
            W.setInnerHTML('ps1', plyrsignal1);
            W.setInnerHTML('ps2', plyrsignal2);

            // button is identified that submit the signals to the next stage
            button = W.getElementById('submitSignals');
            // Listen on click event.
            button.onclick = function() {
                // first it is decided that empty signals are never shared.
                if (plyrsignal1===''){
                    decision1 = 0;
                }
                if (plyrsignal2===''){
                    decision2 = 0;
                }

                // now it is checked for each signal whether it should be shared or hided
                // the decision is saved in the different decision variables
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

                // Now, it is checked whether there has bee a decuision made for all signals.
                // A error message is written.
                // Unfortunately the error message is written on the side of the display and not below
                var dsum=decision1+decision2;
                if(dsum<0){

                    div = W.getElementById('warning').style.display = '';
                    return;
                }

                // Making sure, that empty signals are not shared.
                if (plyrsignal1===''){
                    decision1 = 0;
                }
                if (plyrsignal2===''){
                    decision2 = 0;
                }

                // A String variable that is used to display the signals in the next stage.
                var sharesignals='';

                // If the signal is shared, it is added to the string and
                // a (1) is written in the array that tells us whether a signal was shared.
                if (decision1 == 1) {
                    sharesignals= sharesignals + ', <span style="color:' + plyrsignal1+'">'+plyrsignal1+'</span>';
                    if(plyrsignal1==="red"){
                        shar_sig_array.push(1);
                    }
                    if(plyrsignal1==="blue"){
                        shar_sig_array.push(0);
                    }
                }
                if (decision2 == 1) {
                    sharesignals= sharesignals + ', <span style="color:' + plyrsignal2+'">'+ plyrsignal2+'</span>';
                    if(plyrsignal2==="red"){
                        shar_sig_array.push(1);
                    }
                    if(plyrsignal2==="blue"){
                        shar_sig_array.push(0);
                    }
                }


                // the sharesignals string starts with a comma that is removed
                sharesignals = sharesignals.slice(1);
                button.disabled = true;

                // Mark the end of the round, and
                // store the decision in the server.
                node.done({ decision1: decision1,
                            decision2: decision2,
                            urncolor: urncolor,
                            noturncolor: noturncolor,
                            plyrsignal1:plyrsignal1,
                            plyrsignal2:plyrsignal2,
                            sharesignal1: sharesignals,
                            sig_array: shar_sig_array});
            };
        }

    });

    // The next step in the game stage is the voting.
    // All shared signals must be displayed here!
    stager.extendStep('voting', {
        donebutton: false,

        frame: 'vote.htm',
        // timer: settings.bidTime,
        init:function() {
          parent.scrollTo(0,0);
          this.infoButton.innerHTML='Show Player Behavior';

        },
        cb: function() {
            var vote, Red_button, Blue_button, fdecision, signal2, signal3;
            // the signals that the player shared are coming from the logic
            node.on.data('DATA' , function(msg){
                var signal1=msg.data.playsig;
                W.setInnerHTML('signals1', signal1);

            // the signals that the first automated player received and
            // shared are created in logic and also send to the player

                signal2=msg.data.b1sig;
                W.setInnerHTML('signals2', signal2);

            // the signals that the second automated player received and
            // shared are created in logic and also send to the player

                signal3=msg.data.b2sig;
                W.setInnerHTML('signals3', signal3);
            });
            // since the player is never the pivotal voter, the decision was already
            // computed in the logic and send to the player
            node.on.data('FDECISION' , function(msg){
                fdecision=msg.data;
            });
            // need to get the decision
            fdecision=this.fdecision;
            signal2=this.signal2;
            signal3=this.signal3;
            // buttons for voting are initiated
            Red_button=W.getElementById('Red_button');
            Blue_button=W.getElementById('Blue_button');

            // on click functions are generated and voting decision is stored
            Red_button.onclick=function() {
                vote='red';
                Red_button.disabled = true;
                node.done({
                    b1signals: signal2,
                    b2signals: signal3,
                    vote: vote,
                    fdecision: fdecision
                });
            }
            Blue_button.onclick=function() {
                vote='blue';
                Blue_button.disabled = true;
                node.done({
                    b1signals: signal2,
                    b2signals: signal3,
                    vote: vote,
                    fdecision: fdecision
                });
            }
        }

    });

    // in order to enable learning, the players receive feedback about the voting decision
    // and their payoff
    stager.extendStep('feedback', {
        donebutton: false,
        frame: 'feedback.htm',
        init:function() {
          parent.scrollTo(0,0);
          this.infoButton.innerHTML='Show Player Behavior';

        },

        // timer: settings.bidTime,
        cb: function() {
            var urncolor, fdecision, correct, paid, c_button;
            // all variables are sent by logic
            node.on.data('DATA', function(msg){
                //signals=msg.data.signals
                W.setInnerHTML('signals', msg.data.signals);


                W.setInnerHTML('signals1', msg.data.sharesignal1);
                W.setInnerHTML('signals2', msg.data.sharesignal2);
                W.setInnerHTML('signals3', msg.data.sharesignal3);
                W.setInnerHTML('vdecision', msg.data.vote);
                W.setInnerHTML('v_correct',  msg.data.v_correct);
                W.setInnerHTML('urncolor',  msg.data.urncolor);

                fdecision= msg.data.fdecision;
                W.setInnerHTML('committee_decision',  msg.data.fdecision);

                correct=msg.data.correct;
                W.setInnerHTML('wrong_right',  msg.data.correct);

                paid=msg.data.paid;
                W.setInnerHTML('payoff',  msg.data.paid);
            });

            fdecision=this.fdecision;
            paid=this.paid;
            correct=this.correct;
            // button to continue to next round
            c_button=W.getElementById('Continue_button');

            c_button.onclick=function(){
                node.done({
                    fdecision: fdecision,
                    payoff: paid,
                    correct: correct
                });
            }


        }
    });

    stager.extendStep('belief', {

        donebutton: false,
        frame: 'belief_elicitation.htm',
        init:function() {
          parent.scrollTo(0,0);
          this.infoButton.innerHTML='Show Player Behavior';

        },

        cb: function() {
          var c_button, TUT1_signals, TUT1_decision,
          TUT2_signals, TUT2_decision,TUT3_signals, TUT3_decision,
          GAME1_signals, GAME1_decision, GAME2_signals,
          GAME2_decision, GAME3_signals, GAME3_decision,
          GAME1_paid, GAME2_paid, GAME3_paid,
          GAME4_signals, GAME4_decision, GAME5_signals,
          GAME5_decision, GAME6_signals, GAME6_decision,
          GAME4_paid, GAME5_paid, GAME6_paid,
          div, guess;

          node.on.data('DATA', function(msg){
            GAME1_signals=  msg.data.GAME1_signals;
            W.setInnerHTML('GAME_signals1',  GAME1_signals);
            GAME1_decision= msg.data.GAME1_decision;
            W.setInnerHTML('GAME_decision1',  GAME1_decision);
            GAME1_paid= msg.data.GAME1_paid;

              GAME2_signals=  msg.data.GAME2_signals;
              W.setInnerHTML('GAME_signals2',  GAME2_signals);
              GAME2_decision= msg.data.GAME2_decision;
              W.setInnerHTML('GAME_decision2',  GAME2_decision);
              GAME2_paid= msg.data.GAME2_paid;

            GAME3_signals=  msg.data.GAME3_signals;
            W.setInnerHTML('GAME_signals3',  GAME3_signals);
            GAME3_decision= msg.data.GAME3_decision;
            W.setInnerHTML('GAME_decision3',  GAME3_decision);
            GAME3_paid= msg.data.GAME3_paid;

              GAME4_signals=  msg.data.GAME4_signals;
              W.setInnerHTML('GAME_signals4',  GAME4_signals);
              GAME4_decision= msg.data.GAME4_decision;
              W.setInnerHTML('GAME_decision4',  GAME4_decision);
              GAME4_paid= msg.data.GAME4_paid;

            GAME5_signals=  msg.data.GAME5_signals;
            W.setInnerHTML('GAME_signals5',  GAME5_signals);
            GAME5_decision= msg.data.GAME5_decision;
            W.setInnerHTML('GAME_decision5',  GAME5_decision);
            GAME5_paid= msg.data.GAME5_paid;

          GAME6_signals=  msg.data.GAME6_signals;
          W.setInnerHTML('GAME_signals6',  GAME6_signals);
          GAME6_decision= msg.data.GAME6_decision;
          W.setInnerHTML('GAME_decision6',  GAME6_decision);
          GAME6_paid= msg.data.GAME6_paid;

               TUT1_signals=  msg.data.TUT1_signals;
               W.setInnerHTML('TUT_signals1',  TUT1_signals);
               TUT1_decision= msg.data.TUT1_decision;
               W.setInnerHTML('TUT_decision1',  TUT1_decision);


          TUT2_signals=  msg.data.TUT2_signals;
          W.setInnerHTML('TUT_signals2',  TUT2_signals);
          TUT2_decision= msg.data.TUT2_decision;
          W.setInnerHTML('TUT_decision2',  TUT2_decision);


               TUT3_signals=  msg.data.TUT3_signals;
               W.setInnerHTML('TUT_signals3',  TUT3_signals);
               TUT3_decision= msg.data.TUT3_decision;
               W.setInnerHTML('TUT_decision3',  TUT3_decision);
           });



           W.setInnerHTML('first_decision', node.game.settings.first_decision);
           W.setInnerHTML('second_decision', node.game.settings.second_decision);
           W.setInnerHTML('third_decision', node.game.settings.third_decision);
           W.setInnerHTML('fourth_decision', node.game.settings.fourth_decision);
           W.setInnerHTML('fifth_decision', node.game.settings.fifth_decision);
           W.setInnerHTML('bias2', node.game.settings.bias2);

          // button to continue to next round
          GAME1_paid=this.GAME1_paid;
          GAME2_paid=this.GAME2_paid;
          GAME3_paid=this.GAME3_paid;
          GAME4_paid=this.GAME4_paid;
          GAME5_paid=this.GAME5_paid;
          GAME6_paid=this.GAME6_paid;

          c_button=W.getElementById('Continue_button');

          c_button.onclick=function(){
              guess=Math.round(W.getElementById('guess').value);
              if(guess>=0 & guess<=30 &guess!=""){
                node.done({
                  guess: guess,
                  GAME1_paid: GAME1_paid,
                  GAME2_paid: GAME2_paid,
                  GAME3_paid: GAME3_paid,
                  GAME4_paid: GAME4_paid,
                  GAME5_paid: GAME5_paid,
                  GAME6_paid: GAME6_paid
                });
              }
              else{
                div = W.getElementById('warning').style.display = '';
                return;
              }
          }
        }
    });

    stager.extendStep('bomb', {
      frame: 'bomb.htm',
      donebutton: false,
      // There should only be one risk task included (either holt laury or bomb)
      init: function(){
       W.infoPanel.destroy();
       W.restoreOnleave();
       parent.scrollTo(0,0);
      },

      cb:function() {
        var div, g, c_button, open;
        var slider = W.getElementById("myRange");
        var output = W.getElementById("demo");
        var prize = W.getElementById("prize");
        output.innerHTML = slider.value;

        slider.oninput = function() {
          open= this.value
          output.innerHTML = this.value;
          prize.innerHTML = Math.round(this.value*1);
          var i = 1;
          for(; i<101; i++){
            if(this.value>=i){
              div = W.getElementById(String(i)).style.background = '#1be139';
            }
            else{
              div = W.getElementById(String(i)).style.background = '#000000';
            }
          }
        }

        open=this.open
        c_button=W.getElementById('Continue_button');

        c_button.onclick=function(){
          if(isNaN(open)==false & open>0){
            node.done({
              open: open,
              prize: Math.round(open*1),
              bomb: Math.ceil(Math.random()*100)
            });
          }
          else{
            div = W.getElementById('warning').style.display = '';
            return;
          }
        }
      }
    });



    stager.extendStep('belief_feedback', {
        donebutton: true,
        frame: 'belief_feedback.htm',
        init:function() {
          parent.scrollTo(0,0);
        },

        cb: function() {
          var GAME1_paid, GAME2_paid, GAME3_paid,
              GAME4_paid, GAME5_paid, GAME6_paid;
          var truth, guess, win;
          var box, bomb, win2, win3, random_game, random_game2;

          node.on.data('DATA', function(msg){

            GAME1_paid= msg.data.GAME1_paid;
            W.setInnerHTML('GAME_payment1', GAME1_paid);
            GAME2_paid= msg.data.GAME2_paid;
            W.setInnerHTML('GAME_payment2', GAME2_paid);
            GAME3_paid= msg.data.GAME3_paid;
            W.setInnerHTML('GAME_payment3', GAME3_paid);
            GAME4_paid= msg.data.GAME4_paid;
            W.setInnerHTML('GAME_payment4', GAME4_paid);
            GAME5_paid= msg.data.GAME5_paid;
            W.setInnerHTML('GAME_payment5', GAME5_paid);
            GAME6_paid= msg.data.GAME6_paid;
            W.setInnerHTML('GAME_payment6', GAME6_paid);
            guess=msg.data.guess;
            W.setInnerHTML('Guess', guess);
            win=msg.data.win;
            W.setInnerHTML('Win', win);
            truth=msg.data.truth;
            W.setInnerHTML('Value', truth);
            box=msg.data.box;
            W.setInnerHTML('Box', box);
            bomb=msg.data.bomb;
            W.setInnerHTML('Bomb', bomb);
            win2=msg.data.win2;
            W.setInnerHTML('Win2', win2);
            win3=msg.data.win3+msg.data.win4;
            W.setInnerHTML('Win3', win3);
            random_game=msg.data.random_game;
            W.setInnerHTML('Random_Game', random_game);
            random_game2=msg.data.random_game2;
            W.setInnerHTML('Random_Game2', random_game2);
          });

        }
    });



    // I use the cognitive reflection test by Frederick.
    // The questions have to be answered by providing an input as an integer.
    // Input that does not meake sense is not allowed.
    stager.extendStep('CRT',{
        // frame: 'questionnaire.htm',
        // cb: function() {
        widget: {
            name: 'ChoiceManager',
            root: 'container',
            options: {
                mainText: 'Please answer the questions below',
                className: 'centered',
                forms: [
                    {
                        name: 'CustomInput',
                        id: 'CRT1',
                        mainText: 'A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost in cents?',
                        type: 'int',
                        min: 0,
                        max: 110
                    },
                    {
                        name: 'CustomInput',
                        id: 'CRT2',
                        mainText: 'If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?',
                        type: 'int',
                        min: 0,
                        max: 120
                    },
                    {
                        name: 'CustomInput',
                        id: 'CRT3',
                        mainText: 'In a lake, there is a patch of lily pads. Every day, the patch doubles in size. If it takes 48 days for the patch to cover the entire lake, how long would it take for the patch to cover half of the lake?',
                        type: 'int',
                        min: 0,
                        max: 48
                    },
                    {
                        name: 'CustomInput',
                        id: 'CRT4',
                        mainText: 'Imagine you are driving a car in a race. You overtake the car on the second position. On which position are you now?',
                        type: 'int',
                        min: 0,
                        max: 10
                    },
                    {
                        name: 'CustomInput',
                        id: 'CRT5',
                        mainText: 'A shephard has 15 sheep. All but 8 sheep die. How many sheep are left?',
                        type: 'int',
                        min: 0,
                        max: 15
                    }
                ],
                formsOptions: { requiredChoice: true }
            }

        }

    });


    // a questionnaire that gives me some general information
    // is the data saved somewhere?
    stager.extendStep('questionnaire',{
        widget: {
  	    name: 'ChoiceManager',
  	    root: 'container',
  	    options: {
  		className: 'centered',
  		mainText: 'Please, answer the following questions!',
  		//	hint: 'Good luck!',
                forms: [
                    {name: 'CustomInput',
                     id: 'age',
                     mainText: 'What is your age?',
                     type: 'int',
                     min: 18,
                     max: 120,
                     title: false,
                     requiredChoice: true
                    },

                    {
                        name:'ChoiceTable',
                        id: 'education',
                        mainText: 'What is your highest level of eduction?',
                        choices: [
                            'less than high school degree', 'high school degree', 'college degree',
                            'graduate school degree', 'Do not want to say'
                        ],
                        title: false,
                        requiredChoice: true
                    },

                    {
                        name:'ChoiceTable',
                        id: 'gender',
                        mainText: 'What is your gender?',
                        choices: [
                            'Male', 'Female', 'Other', 'Do not want to say'
                        ],
                        shuffleChoices: false,
                        title: false,
                        requiredChoice: true
                    }

                ]
  	    }
  	}
    });


  stager.extendStep('preEnd', {
    widget: {
      name: 'Feedback',
      root: 'container',
      options: {
        className: 'centered',
        mainText: 'Please leave some short feedback what you liked or did not like about the experiment:<br>',
        minChars: 50,
        minWords: 10,
        showSubmit: false,
        requiredChoice: true,
        panel: false,
        title: false
      }
    }
  });



    // I am not sure what I really need in this last page.
    // the players should see how much they earned
    stager.extendStep('end', {
        donebutton: false,
        frame: 'end.htm',
        widget: {
            name: 'EndScreen',
            root: "container",
            options: {
                title: false, // Disable title for seamless Widget Step.
                panel: false, // No border around.
                showEmailForm: false,
                showFeedbackForm: false,
                texts:{
                  totalWin:"Your total bonus:"
                }
            }
        }
    });
};
