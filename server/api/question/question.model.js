'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
  question: String,
  answer: String,
  visible: { type: Boolean, default: true },
  hints: { type: String, default: '' },
  displayHints: { type: Boolean, default: false },
  next: { type: Schema.Types.ObjectId, ref: 'Question', default: null }
});

module.exports = mongoose.model('Question', QuestionSchema);
