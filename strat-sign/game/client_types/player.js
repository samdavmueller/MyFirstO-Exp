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
        // I don't think I need a timer because players play alone.
        //this.visualTimer = node.widgets.append('VisualTimer', header);

        this.doneButton = node.widgets.append('DoneButton', header);

        //BackButton is not working, I don't know why...
        this.backButton = node.widgets.append('BackButton', header);

        // Additional debug information while developing the game.
        // this.debugInfo = node.widgets.append('DebugInfo', header)
    });

    stager.extendStep('instructions', {
        frame: 'instructions.htm',
        cb:function(){
          //Instructions differ between treatments.
          var gsig=Math.round(100*node.game.settings.getsignal);
          console.log(gsig);
          var nsig=Math.round(100*(1-node.game.settings.getsignal));
          console.log(wsig);
          var csig=Math.round(100*node.game.settings.correctsignal);
          var wsig=Math.round(100*(1-node.game.settings.correctsignal));
          W.setInnerHTML('getsignal', gsig);
          W.setInnerHTML('getnosignal', nsig);
          W.setInnerHTML('correctsignal', csig);
          W.setInnerHTML('wrongsignal', wsig);
          W.setInnerHTML('bias', node.game.settings.bias);
          W.setInnerHTML('bias2', node.game.settings.bias2);
        }
    });

    //a short quiz to test the participants understanding of the game
    // I would really want the back button to work in case somebody has not read
    // the instructions well enough
    stager.extendStep('quiz',{
    backbutton: false,
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
							'I don\'t know',
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
              'Nothing',
              'I don\'t know',
              'I can decide which players receives which of the signals, while I can provide any signal only to a single automated player.'
						],
						correctChoice: 0,
						shuffleChoices: true,
						orientation: 'V' //horizontal
					},
					{
						name: 'ChoiceTable',
						id: 'automated_players',
						mainText: 'The shared signals are BLUE, RED, BLUE, BLUE, RED. How do the automated players vote?',
						choices: [
							settings.right_decision,
              settings.wrong_decision,
              'I don\'t know'
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
    stager.extendStep('signals', {
        donebutton: false,
        frame: 'game.htm',
        // I did not change the name of the time variable.
        // But I decided I do not need time pressure at all.
        // timer: settings.bidTime,
            cb: function() {
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
                }
                else{
                  plyrsignal1=noturncolor;
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
                }
                else{
                  plyrsignal2=noturncolor;
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

                }
                else{
                  plyrsignal3=noturncolor;
                }
              }
              else {
                plyrsignal3= '';
                div = W.getElementById('signal3').style.display = 'none';
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
                  W.writeln('You should decide for all possible signals');
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
      donebutton: false,
      frame: 'vote.htm',
      // timer: settings.bidTime,

          cb: function() {
              var vote, Red_button, Blue_button, fdecision;
              // the signals that the player shared are coming from the logic
              node.on.data('SIG_P' , function(msg){
                var signal1=msg.data;
                W.setInnerHTML('signals1', signal1);
              });
              // the signals that the first automated player received and
              // shared are created in logic and also send to the player
              node.on.data('SIG_B1' , function(msg){
                var signal2=msg.data;
                W.setInnerHTML('signals2', signal2);
              });
              // the signals that the second automated player received and
              // shared are created in logic and also send to the player
              node.on.data('SIG_B2' , function(msg){
                var signal3=msg.data;
                W.setInnerHTML('signals3', signal3);
              });
              // since the player is never the pivotal voter, the decision was already
              // computed in the logic and send to the player
              node.on.data('FDECISION' , function(msg){
                fdecision=msg.data;
              });
              // need to get the decision
              fdecision=this.fdecision;
              // buttons for voting are initiated
              Red_button=W.getElementById('Red_button');
              Blue_button=W.getElementById('Blue_button');

              // on click functions are generated and voting decision is stored
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
            }

    });

    // in order to enable learning, the players receive feedback about the voting decision
    // and their payoff
    stager.extendStep('feedback', {
        donebutton: false,
        frame: 'feedback.htm',
        // timer: settings.bidTime,
        cb: function() {
          var urncolor, fdecision, correct, payed, c_button;

          // all variables are sent by logic

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


          // button to continue to next round
          c_button=W.getElementById('Continue_button');

          c_button.onclick=function(){
            node.done({
              payoff:this.payed,
              correct: this.correct
            });
          }


        }
    });

    // risk widget is used to measure risk preferences.
    // I am not sure whether the data is saved.
    stager.extendStep('risk',{

		widget: {
			name: 'RiskGauge',
      root: 'container',
      options: {
                panel: false,
                title: false
              }
		}
	});

  // I use the cognitive reflection test by Frederick.
  // The questions have to be answered by providing an input as an integer.
  // Input that does not meake sense is not allowed.
  stager.extendStep('CRT',{
    frame: 'questionnaire.htm',
    cb: function() {
      var root = W.getElementById('root');


      var BatBall = node.widgets.append('CustomInput', root, {
        id: 'CRT1',
        mainText: 'A bat and a ball cost $1.10 in total. The bat costs $1.00 more than the ball. How much does the ball cost in cents?',
        type: 'int',
        min: 0,
        max: 110,
        requiredChoice: true
      });
      var machines = node.widgets.append('CustomInput', root, {
        id: 'CRT2',
        mainText: 'If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?',
        type: 'int',
        min: 0,
        max: 120,
        requiredChoice: true
      });
      var lillys = node.widgets.append('CustomInput', root, {
        id: 'CRT3',
        mainText: 'In a lake, there is a patch of lily pads. Every day, the patch doubles in size. If it takes 48 days for the patch to cover the entire lake, how long would it take for the patch to cover half of the lake?',
        type: 'int',
        min: 0,
        max: 48,
        requiredChoice: true
      });
      var race = node.widgets.append('CustomInput', root, {
        id: 'CRT4',
        mainText: 'Imagine you are driving a car in a race. You overtake the car on the second position. On which position are you now?',
        type: 'int',
        min: 0,
        max: 10,
        requiredChoice: true
      });
      var sheep = node.widgets.append('CustomInput', root, {
        id: 'CRT5',
        mainText: 'A shephard has 15 sheep. All but 8 sheep die. How many sheep are left?',
        type: 'int',
        min: 0,
        max: 15,
        requiredChoice: true
      });


      // As far as I understand it, this function should save the answers that the participants gave.
      BatBall.getValues();
      machines.getValues();
      lillys.getValues();
      race.getValues();
      sheep.getValues();

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
          {name: 'ChoiceTable',
            id: 'age',
            mainText: 'What is your age group?',
            choices: [
              '18-20', '21-30', '31-40', '41-50',
              '51-60', '61-70', '71+', 'Do not want to say'
            ],
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
