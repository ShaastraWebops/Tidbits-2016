/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/questions              ->  index
 * POST    /api/questions              ->  create
 * GET     /api/questions/:id          ->  show
 * PUT     /api/questions/:id          ->  update
 * DELETE  /api/questions/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Question = require('./question.model');
var User = require('../user/user.model');

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function (entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(function (updated) {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.removeAsync()
        .then(function() {
          res.status(204).end();
        });
    }
  };
}

// Gets a list of Questions
exports.index = function(req, res) {
  // Question.findAsync()
  //   .then(responseWithResult(res))
  //   .catch(handleError(res));
  Question.find({}, '-answer -hints')
    .sort({_id: 1})
    .execAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));  
};

// Gets a single Question from the DB
exports.show = function(req, res) {
  Question.findByIdAsync(req.params.id, '-answer -hints')
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new Question in the DB
exports.create = function(req, res) {
  Question.findAsync({next: null}).then(function (res) {
    var last = null;
    console.log(res);
    if(res.length>0) {
      last = res[res.length-1];
    }
    console.log(last);
    Question.createAsync(req.body)
      .then(function (res2) {
        console.log(req.body);
        if(last!=null) {
          delete last._id;
          last.next = res2._id;
          Question.findByIdAsync(last._id)
          .then(handleEntityNotFound(res2))
          .then(saveUpdates(last));
        }
        responseWithResult(res, 200);
      })
      .catch(handleError(res));
  });
  res.send(200);
};

// Updates an existing Question in the DB
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Question.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Question from the DB
exports.destroy = function(req, gres) {
  Question.findByIdAsync(req.params.id)
    .then(function (res) {
      Question.findOneAsync({next: req.params.id}).then(function (qres) {
        var updated = _.assign(qres, {next: res.next});
        updated.save(function (err) {
          if (err) { return gres.send(500); }
          return;
        });
      });
      User.findOneAsync({solved: req.params.id}).then(function (ures) {
        ures.solved.splice(ures.solved.indexOf(req.params.id), 1);
        var updated = _.assign(ures, {solved: ures.solved, numSolved: ures.numSolved-1});
        updated.save(function (err) {
          if (err) { return gres.send(500); }
          return;
        });
      });
    });
  Question.findByIdAndRemoveAsync(req.params.id)
    .then(function() {
      gres.send(204);
    })
    .catch(handleError(gres));
};

exports.nextQ = function(req, gres) {
  User.findById(req.user._id).populate('solved', 'next').then(function (res) {
    if(!res.disqualified) {
      if(res.solved.length==0) {
        Question.find({}, '-answer')
          .sort({_id: 1})
          .then(function (actres) {
            if(actres.length != 0) {
              if(!actres[0].displayHints) {
                actres[0].hints = '';
              }
            }
            gres.status(200).send(actres[0]);
        });
      } else {
        Question.findById(res.solved[res.solved.length-1].next)
          .select('-answer')
          .then(function (actres) {
            if(actres != null) {
              if(!actres.displayHints) {
                actres.hints = '';
              }
            }
            gres.status(200).send(actres);
          });
      }
    } else {
      gres.status(200).send(null);
    } 
  });
};
