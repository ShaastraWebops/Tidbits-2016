'use strict';

var express = require('express');
var controller = require('./answer.controller');
import auth from '../../auth/auth.service';

var router = express.Router();

router.post('/:id', auth.isAuthenticated(), controller.verify);

module.exports = router;
