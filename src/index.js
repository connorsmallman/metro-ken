var request = require("request");
var cheerio = require("cheerio");
var url = 'http://www.nexus.org.uk/metro/updates';
var APP_ID = "amzn1.ask.skill.de3b848c-43e8-4f84-b2c4-4bb407f05430";

// function getPage() {

//   request(url, (error, response, body) => {
//     if (!error) {
//       var $ = cheerio.load(body);
//
//       var disruptionElements = $("#t_disruptions .view .view-content .views-row").toArray();
//
//       for (var i = 0; i < disruptionElements.length; i++) {
//         var el = disruptionElements[i];
//         this.addDisruption({
//           content: $(el).find('p').text()
//         });
//       }
//     } else {
//       console.log("Request failed");
//     }
//   });
// }

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./alexa-skill');

var MetroKen = function (appId) {
    AlexaSkill.call(this, appId);
};

// Extend AlexaSkill
MetroKen.prototype = Object.create(AlexaSkill.prototype);
MetroKen.prototype.constructor = MetroKen;

MetroKen.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
  console.log("MetroKen onSessionStarted requestId: " + sessionStartedRequest.requestId
      + ", sessionId: " + session.sessionId);
};

MetroKen.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("MetroKen onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to the Alexa Skills Kit, you can say hello";
    var repromptText = "You can say hello";
    response.ask(speechOutput, repromptText);
};

MetroKen.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("MetroKen onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

MetroKen.prototype.intentHandlers = {
    // register custom intent handlers
    "MetroKenIntent": function (intent, session, response) {
        request(url, function(error, res, body) {
          if (!error) {
            var disruptions = [];
            var $ = cheerio.load(body);

            var disruptionElements = $("#t_disruptions .view .view-content .views-row").toArray();

            console.log(disruptionElements);

            for (var i = 0; i < disruptionElements.length; i++) {
              var el = disruptionElements[i];

              disruptions.push({
                content: $(el).find('p').text()
              });
            }

            response.tellWithCard(disruptions[0].content, "Hello World", "Hello World!");
          } else {
            console.log("Request failed");
          }
        });
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can say hello to me!", "You can say hello to me!");
    }
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the MetroKen skill.
    var metroKen = new MetroKen(APP_ID);
    metroKen.execute(event, context);
};
