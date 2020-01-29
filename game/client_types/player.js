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
        this.infoButton = infoPanel.createToggleButton('Auto Player Behavior');
        this.infoButton.disabled = true;
        //W.getHeader().appendChild(this.infoButton);

        // Add a new div to the info panel.
        this.infoDiv = document.createElement('div');
        this.infoDiv.innerHTML = '<h3>Behavior of automated players</h3>'+
        "<h4>The automated players always share all private signals they receive. Their voting decision is made using the following procedure: </br>"+
        "1. They count the <strong>number of shared signals that show '<span style='color:red'>red</span>'</strong> and multiply it by <strong>" +node.game.settings.bias+"</strong>.<br>"+
        "2. Then they count the <strong>number of shared signals that show '<span style='color:blue'>blue</span>'</strong> and multiply if by <strong>" +node.game.settings.bias2+"</strong>.<br>"+
        "3. Finally, the automated players compare the numbers they received and <strong>vote for the color that has the larger number</strong>. If both number are the <strong>same</strong>, a coin toss decides the color they choose.</h4>";

      //  W.setInnerHTML('bias', node.game.settings.bias);
      //  W.setInnerHTML('bias2', node.game.settings.bias2);
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


            //BackButton is not working, I don't know why...
        this.backButton = node.widgets.append('BackButton',
                                              W.getHeader(), {
                                                  acrossStages:  true
        });
        // Last instruction in the init function.
        // Game must be started manually.


    });

    stager.extendStep('welcome', {
      frame: 'welcome.htm',
      cb: function(){
        W.setInnerHTML('time', 20);
        W.setInnerHTML('low_money', 0.37);
        W.setInnerHTML('high_money', 3.62);
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
            W.setInnerHTML('bias', node.game.settings.bias);
            W.setInnerHTML('bias2', node.game.settings.bias2);
            W.setInnerHTML('bias3', node.game.settings.bias);
            W.setInnerHTML('bias4', node.game.settings.bias2);
            W.setInnerHTML('exchange-rate', node.game.settings.EXCHANGE_RATE_INSTRUCTIONS);
        }
    });


    //a short quiz to test the participants understanding of the game
    // I would really want the back button to work in case somebody has not read
    // the instructions well enough
    stager.extendStep('quiz', {



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
			            mainText: 'The shared signals are <span style="color:blue">BLUE</span>, <span style="color:red">RED</span>, <span style="color:blue">BLUE</span>, <span style="color:blue">BLUE</span>, <span style="color:red">RED</span>. How do the automated players vote?',
			            choices: [
			                      settings.right_decision,
                            settings.wrong_decision,
                            'I don\'t know.'
			                     ],
			            correctChoice: 0,
			            shuffleChoices: true,
			            orientation: 'H' //horizontal
		             }
		        ]
	    }
	   }
  });



  // The stage in which all participants receive their signals and the urn color
  // is decided.
  stager.extendStep('signalsTUT', {
      backbutton: false,
      donebutton: false,
      frame: 'gameTUT.htm',
      // I did not change the name of the time variable.
      // But I decided I do not need time pressure at all.
      // timer: settings.bidTime,
      init: function() {
          node.game.backButton.destroy();
       // A info button is created that is available
        // It explains the strategy of the automated players
        // Generate the info panel object.

          /*var infoPanel = W.generateInfoPanel();

          // Generate the toggle button and append it to the header.
          this.infoButton = infoPanel.createToggleButton('History');
          W.getHeader().appendChild(this.infoButton);

          // Add a new div to the info panel.
          this.infoDiv = document.createElement('div');
          this.infoDiv.innerHTML = '<h3>Strategy</h3>';
          this.infoDiv.class ='inner';
          infoPanel.infoPanelDiv.appendChild(this.infoDiv);*/

          this.infoButton.disabled=false;

          node.on.step(function(){
            W.infoPanel.close();
          })

      },


      cb: function() {
        var csig=Math.round(100*node.game.settings.correctsignal);
        var wsig=Math.round(100*(1-node.game.settings.correctsignal));
        W.setInnerHTML('correctsignal', csig);
        W.setInnerHTML('wrongsignal', wsig);

          // variables I need
          var button, decision1, decision2, decision3,
              div, urncolor, noturncolor,
              plyrsignal1, plyrsignal2, plyrsignal3;
          //this array gets the information whether a signal is shared (1) or not (0)
          var shar_sig_array=[];

          // decisions get a default of -99 to make it easy to check whether
          // a decision was made for all signals
          decision1= -99;
          decision2= -99;
          decision3= -99;


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

          // the same procedure for signal 3
          if (Math.random()< node.game.settings.getsignal) {
              if (Math.random()< node.game.settings.correctsignal){
                  plyrsignal3=urncolor;
                  div = W.getElementById('ps3').style.color = plyrsignal3;

              }
              else{
                  plyrsignal3=noturncolor;
                  div = W.getElementById('ps3').style.color = plyrsignal3;
              }
          }
          else {
              plyrsignal3= '';
              div = W.getElementById('signal3').style.display = 'none';
              div = W.getElementById('signal3').style.color = plyrsignal3;
          }

          // signals are sent to the html file
          W.setInnerHTML('ps1', plyrsignal1);
          W.setInnerHTML('ps2', plyrsignal2);
          W.setInnerHTML('ps3', plyrsignal3);

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
              if (plyrsignal3===''){
                  decision3 = 0;
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
              if (W.getElementById('hide3').checked){
                  decision3 = 0;
              }
              if (W.getElementById('share3').checked){
                  decision3 = 1;
              }

              // Now, it is checked whether there has bee a decuision made for all signals.
              // A error message is written.
              // Unfortunately the error message is written on the side of the display and not below
              var dsum=decision1+decision2+decision3;
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
              if (plyrsignal3===''){
                  decision3 = 0;
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
              if (decision3 == 1) {
                  sharesignals= sharesignals + ', <span style="color:' + plyrsignal3+'">' + plyrsignal3+'</span>';
                  if(plyrsignal3==="red"){
                      shar_sig_array.push(1);
                  }
                  if(plyrsignal3==="blue"){
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
                          decision3: decision3,
                          urncolor: urncolor,
                          noturncolor: noturncolor,
                          plyrsignal1:plyrsignal1,
                          plyrsignal2:plyrsignal2,
                          plyrsignal3:plyrsignal3,
                          sharesignal1: sharesignals,
                          sig_array: shar_sig_array});
          };
      }

  });

  // The next step in the game stage is the voting.
  // All shared signals must be displayed here!
  stager.extendStep('votingTUT', {
    backbutton: false,
      donebutton: false,

      frame: 'voteTUT.htm',
      // timer: settings.bidTime,

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
  stager.extendStep('feedbackTUT', {
    backbutton: false,
      donebutton: false,
      frame: 'feedbackTUT.htm',


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
              W.setInnerHTML('committee_decision',  msg.data.fdecision);

              correct=msg.data.correct;
              W.setInnerHTML('wrong_right',  msg.data.correct);

              paid=msg.data.paid;
              W.setInnerHTML('payoff',  msg.data.paid);
          });

          paid=this.paid;
          correct=this.correct;
          // button to continue to next round
          c_button=W.getElementById('Continue_button');

          c_button.onclick=function(){
              node.done({
                  payoff: paid,
                  correct: correct
              });
          }


      }
  });





      stager.extendStep('START', {
        frame: 'START.htm',
        backbutton: false,
        donebutton: true
      });






    // The stage in which all participants receive their signals and the urn color
    // is decided.
    stager.extendStep('signals', {
        backbutton: false,
        donebutton: false,
        frame: 'game.htm',
        // I did not change the name of the time variable.
        // But I decided I do not need time pressure at all.
        // timer: settings.bidTime,
      /*  init: function() {
            node.game.backButton.destroy();
         // A info button is created that is available
          // It explains the strategy of the automated players
          // Generate the info panel object.

            var infoPanel = W.generateInfoPanel();

            // Generate the toggle button and append it to the header.
            this.infoButton = infoPanel.createToggleButton('History');
            W.getHeader().appendChild(this.infoButton);

            // Add a new div to the info panel.
            this.infoDiv = document.createElement('div');
            this.infoDiv.innerHTML = '<h3>Strategy</h3>';
            this.infoDiv.class ='inner';
            infoPanel.infoPanelDiv.appendChild(this.infoDiv);

            this.infoButton.disabled=false;

            node.on.step(function(){
              W.infoPanel.close();
            })

        },*/


        cb: function() {
          var csig=Math.round(100*node.game.settings.correctsignal);
          var wsig=Math.round(100*(1-node.game.settings.correctsignal));
          W.setInnerHTML('correctsignal', csig);
          W.setInnerHTML('wrongsignal', wsig);

            // variables I need
            var button, decision1, decision2, decision3,
                div, urncolor, noturncolor,
                plyrsignal1, plyrsignal2, plyrsignal3;
            //this array gets the information whether a signal is shared (1) or not (0)
            var shar_sig_array=[];

            // decisions get a default of -99 to make it easy to check whether
            // a decision was made for all signals
            decision1= -99;
            decision2= -99;
            decision3= -99;


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

            // the same procedure for signal 3
            if (Math.random()< node.game.settings.getsignal) {
                if (Math.random()< node.game.settings.correctsignal){
                    plyrsignal3=urncolor;
                    div = W.getElementById('ps3').style.color = plyrsignal3;

                }
                else{
                    plyrsignal3=noturncolor;
                    div = W.getElementById('ps3').style.color = plyrsignal3;
                }
            }
            else {
                plyrsignal3= '';
                div = W.getElementById('signal3').style.display = 'none';
                div = W.getElementById('signal3').style.color = plyrsignal3;
            }

            // signals are sent to the html file
            W.setInnerHTML('ps1', plyrsignal1);
            W.setInnerHTML('ps2', plyrsignal2);
            W.setInnerHTML('ps3', plyrsignal3);

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
                if (plyrsignal3===''){
                    decision3 = 0;
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
                if (W.getElementById('hide3').checked){
                    decision3 = 0;
                }
                if (W.getElementById('share3').checked){
                    decision3 = 1;
                }

                // Now, it is checked whether there has bee a decuision made for all signals.
                // A error message is written.
                // Unfortunately the error message is written on the side of the display and not below
                var dsum=decision1+decision2+decision3;
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
                if (plyrsignal3===''){
                    decision3 = 0;
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
                if (decision3 == 1) {
                    sharesignals= sharesignals + ', <span style="color:' + plyrsignal3+'">' + plyrsignal3+'</span>';
                    if(plyrsignal3==="red"){
                        shar_sig_array.push(1);
                    }
                    if(plyrsignal3==="blue"){
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
                            decision3: decision3,
                            urncolor: urncolor,
                            noturncolor: noturncolor,
                            plyrsignal1:plyrsignal1,
                            plyrsignal2:plyrsignal2,
                            plyrsignal3:plyrsignal3,
                            sharesignal1: sharesignals,
                            sig_array: shar_sig_array});
            };
        }

    });

    // The next step in the game stage is the voting.
    // All shared signals must be displayed here!
    stager.extendStep('voting', {
      backbutton: false,
        donebutton: false,

        frame: 'vote.htm',
        // timer: settings.bidTime,

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
      backbutton: false,
        donebutton: false,
        frame: 'feedback.htm',


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
                W.setInnerHTML('committee_decision',  msg.data.fdecision);

                correct=msg.data.correct;
                W.setInnerHTML('wrong_right',  msg.data.correct);

                paid=msg.data.paid;
                W.setInnerHTML('payoff',  msg.data.paid);
            });

            paid=this.paid;
            correct=this.correct;
            // button to continue to next round
            c_button=W.getElementById('Continue_button');

            c_button.onclick=function(){
                node.done({
                    payoff: paid,
                    correct: correct
                });
            }


        }
    });

    // risk widget is used to measure risk preferences.
    // I am not sure whether the data is saved.
    stager.extendStep('risk_task',{
      init: function(){
       W.infoPanel.destroy();
       W.restoreOnleave();
      },

	       widget: {
	          name: 'RiskGauge',
            root: 'container',
            options: {
                mainText: 'Below you find a series of hypothetical lotteries. Each row contains two lotteries with different probabalities of winning. In each row, select the lottery you would rather take part in. After you made your choices, one of the ten rows is chosen randomly and the lottery you chose is played. The resulting payoff is added to your final payoff.',
                className: 'centered',
                currency: ' ECU',
                currencyAfter: true,
                panel: false,
                title: false,
                scale: 20

            }
	       }
    });

    stager.extendStep('risk_feedback', {
      backbutton: false,
        donebutton: false,
        frame: 'risk_feedback.htm',
        cb: function() {
          var win, cell,lottery, rand, r_button, c_button, div;

          node.on.data('RISK', function(msg){
            //  concole.log(msg.data);
              win=msg.data.win;
              cell=msg.data.cell;
              rand=msg.data.dice;
              lottery=msg.data.lottery;
              W.setInnerHTML('cell', cell);
              W.setInnerHTML('cell2', cell);
              W.setInnerHTML('cell3', cell);
              W.setInnerHTML('lottery', lottery);
              W.setInnerHTML('rand', rand);
              W.setInnerHTML('win', win);

          });
          win=this.win;
          cell=this.cell;
          rand=this.rand;
          console.log('win');
          r_button=W.getElementById('Run');

          r_button.onclick=function(){
            div = W.getElementById('result').style.display = '';
          }

          c_button=W.getElementById('Continue_button');

          c_button.onclick=function(){
              node.done({
                  win: win,
                  cell: cell,
                  rand: rand
              });
          }
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
//             // var root = W.getElementById('root');
//
//
//             var BatBall = node.widgets.append('CustomInput', root, );
//             var machines = node.widgets.append('CustomInput', root, );
//             var lillys = node.widgets.append('CustomInput', root, );
//             var race = node.widgets.append('CustomInput', root, );
//             var sheep = node.widgets.append('CustomInput', root, );
//
//             // As far as I understand it, this function should save the answers that the participants gave.
//             donebutton.onclick=function(){
//                 node.done({
//                     CRT1: BatBall.getValues(),
//                     CRT2: machines.getValues(),
//                     CRT3: lillys.getValues(),
//                     CRT4: race.getValues(),
//                     CRT5: sheep.getValues()
//                 })
//             }

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
                     /*choices: [
                         '18-20', '21-30', '31-40', '41-50',
                         '51-60', '61-70', '71+', 'Do not want to say'
                     ],*/
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
                            'high school graduate', 'some college', "Bachelor's degree",
                            "Master's degree","Doctoral or professional degree", 'Do not want to say'
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
                showEmailForm: true,
                showFeedbackForm: true,
                email: {
                    texts: {
                        label: 'Enter your email (optional):',
                        errString: 'Please enter a valid email and retry'
                    }
                },
                feedback: { minLength: 50 }
            }
        }
    });
};
