'use strict';

import User from './user.model';
import passport from 'passport';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.status(statusCode).json(err);
  }
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function respondWith(res, statusCode) {
  statusCode = statusCode || 200;
  return function() {
    res.status(statusCode).end();
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.findAsync({}, '-salt -hashedPassword')
    .then(function(users) {
      res.status(200).json(users);
    })
    .catch(handleError(res));
};

/**
 * Creates a new user
 */
exports.create = function(req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.saveAsync()
    .spread(function(user) {
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresInMinutes: 60 * 5
      });
      res.json({ token: token });
    })
    .catch(validationError(res));
};

/**
 * Get a single user
 */
exports.show = function(req, res, next) {
  var userId = req.params.id;

  User.findByIdAsync(userId)
    .then(function(user) {
      if (!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(function(err) {
      return next(err);
    });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemoveAsync(req.params.id)
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findByIdAsync(userId)
    .then(function(user) {
      if (user.authenticate(oldPass)) {
        user.password = newPass;
        return user.saveAsync()
          .then(function() {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;

  User.findById(userId, '-salt -password')
    .populate('solved', '_id question answer')
    .exec(function(err, user) { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      } else {
        res.json(user);
      }
    });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};

exports.scoreboard = function(req, gres) {
  User.find({'role':'user', $or:[ { 'disqualified':{$exists: false} }, { 'disqualified':false } ]}, 'name _id numSolved lastSolvedAt')
  .sort({numSolved: -1, lastSolvedAt: 1})
  .limit(20)
  .exec(function (err, res) {
    gres.status(200).send(res);
  });
};

exports.adminScoreboard = function(req, gres) {
  User.find({'role':'user', $or:[ { 'disqualified':{$exists: false} }, { 'disqualified':false } ]}, 'name _id numSolved lastSolvedAt email phoneNumber disqualified')
  .sort({numSolved: -1, lastSolvedAt: 1})
  .exec(function (err, res_one) {
    User.find({'role':'user', 'disqualified':true }, 'name _id numSolved lastSolvedAt email phoneNumber disqualified')
    .sort({numSolved: -1, lastSolvedAt: 1})
    .exec(function (err, res_two) {
      var actres = res_one.concat(res_two);
      gres.status(200).send(actres);
    });
  });
};

exports.getUserPosition = function (req, gres) {
  User.find({'role':'user', $or:[ { 'disqualified':{$exists: false} }, { 'disqualified':false } ]})
  .sort({numSolved: -1, lastSolvedAt: 1})
  .exec(function (err, users) {
    users.some(function (user, index) {
      if(user._id.equals(req.user._id)) {
        console.log(index);
        gres.status(200).json(index+1);
      }
    });
  });  
};

exports.toggleQualification = function (req, res) {
  User.findByIdAsync(req.params.id)
    .then(function (user) {
      user.disqualified = !user.disqualified;
      return user.saveAsync()
        .then(function() {
          res.status(204).end();
        })
        .catch(validationError(res));      
    });
};