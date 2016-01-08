'use strict';

import express from 'express';
import controller from './user.controller';
import auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.get('/leaders/', controller.scoreboard);
router.get('/adminLeaders/', auth.hasRole('admin'), controller.adminScoreboard);
router.get('/currUserPosition/', auth.isAuthenticated(), controller.getUserPosition);
router.put('/toggleQualification/:id', auth.hasRole('admin'), controller.toggleQualification);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);

module.exports = router;
