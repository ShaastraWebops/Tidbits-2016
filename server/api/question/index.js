'use strict';

var express = require('express');
var controller = require('./question.controller');
import auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/next/', auth.isAuthenticated(), controller.nextQ);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
