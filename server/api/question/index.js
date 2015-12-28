'use strict';

var express = require('express');
var controller = require('./question.controller');
import auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', controller.index);
router.get('/next/', auth.isAuthenticated(), controller.nextQ);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
