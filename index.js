var Botkit = require('botkit');
if (!process.env.token) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

var controller = Botkit.slackbot();
var bot = controller.spawn({
  token: process.env.token
})
bot.startRTM(function(err,bot,payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});

controller.hears(['wig'], ['message_received','direct_message','mention', 'direct_mention'], function(bot, message){ 
	console.log( 'Heard ' + JSON.stringify( message ) );
	bot.startConversation(message,function(err,convo){ 
    askType = function(response, convo) {
      convo.ask('What type of wig?', function(response, convo) {
        convo.say('Awesome.');
        askSize(response, convo);
        convo.next();
      });
    }
    askSize = function(response, convo) {
      convo.ask('What size do you want?', function(response, convo) {
        convo.say('Ok.')
        askColor(response, convo);
        convo.next();
      });
    }
    askColor = function(response, convo) {
      convo.ask('What color do you want?', function(response, convo) {
        convo.say('Ok!');
        askWhy(response, convo);
        convo.next();
      });
    }
    askWhy = function(response, convo) {
      convo.ask('And why did you want that...?', function(response, convo) {
        convo.say('Ok!');
        var values = convo.extractResponses();
        var msg1 = 'Your ' + values['What size do you want?'] + ' ' + values['What color do you want?'] + ' ' +
        	values['What type of wig?'] + ' wig is on its way for some reason...';
        var msg2 = 'Oh yeah, in your own words, you wanted it because "' + values['And why did you want that...?'] + '" ... weird.';
        var msg3 = 'Either way, you will not actually get a wig.';
        convo.say( msg1 ); 
        convo.say( msg2 ); 
        convo.say( msg3 ); 
        convo.next();
      });
    }

	convo.ask('Shall we proceed Say NO to quit.',[
	{
		pattern: bot.utterances.no,
		callback: function(response,convo) {
			convo.say('Perhaps later.');
			// do something else...
			convo.next();
		}
	},
	{
	default: true,
		callback: function(response,convo) {
			// just repeat the question
			askType(response,convo);
			convo.next();
		}
	}
    ]);

} );
} );