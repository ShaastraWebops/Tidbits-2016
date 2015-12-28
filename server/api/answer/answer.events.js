/**
 * Answer model events
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var Answer = require('./answer.model');
var AnswerEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
AnswerEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Answer.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    AnswerEvents.emit(event + ':' + doc._id, doc);
    AnswerEvents.emit(event, doc);
  }
}

module.exports = AnswerEvents;
