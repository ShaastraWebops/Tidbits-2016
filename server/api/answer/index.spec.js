'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var answerCtrlStub = {
  index: 'answerCtrl.index',
  show: 'answerCtrl.show',
  create: 'answerCtrl.create',
  update: 'answerCtrl.update',
  destroy: 'answerCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var answerIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './answer.controller': answerCtrlStub
});

describe('Answer API Router:', function() {

  it('should return an express router instance', function() {
    answerIndex.should.equal(routerStub);
  });

  describe('GET /api/answers', function() {

    it('should route to answer.controller.index', function() {
      routerStub.get
        .withArgs('/', 'answerCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/answers/:id', function() {

    it('should route to answer.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'answerCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/answers', function() {

    it('should route to answer.controller.create', function() {
      routerStub.post
        .withArgs('/', 'answerCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/answers/:id', function() {

    it('should route to answer.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'answerCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/answers/:id', function() {

    it('should route to answer.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'answerCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/answers/:id', function() {

    it('should route to answer.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'answerCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
