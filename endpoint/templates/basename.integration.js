'use strict';

var app = require('<%= relativeRequire('server/index.js') %>');
var supertest = require('supertest');<% if(filters.models) { %>

var new<%= classedName %>;<% } %>

describe('<%= classedName %> API:', function() {
  var request, csrfToken;

  beforeEach(function(done) {
    /* get new session and csrf token */
    csrfToken = '';
    request = supertest.agent(app);
    request.head('/')
      .end(function(err, res) {
        if (err) { return done(err); }
        if (res.headers['set-cookie']) {
          res.headers['set-cookie'].forEach(function(v) {
            if (v.match(/^XSRF-TOKEN=/)) {
              csrfToken = decodeURIComponent(v.split(';')[0].split('=')[1]);
            }
          });
        }
        done();
      });
  });

  describe('GET <%= route %>', function() {
    var <%= cameledName %>s;

    beforeEach(function(done) {
      request.get('<%= route %>')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          <%= cameledName %>s = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      <%= cameledName %>s.should.be.instanceOf(Array);
    });

  });<% if(filters.models) { %>

  describe('POST <%= route %>', function() {
    beforeEach(function(done) {
      request.post('<%= route %>')
        .set('X-XSRF-TOKEN', csrfToken)
        .send({
          name: 'New <%= classedName %>',
          info: 'This is the brand new <%= cameledName %>!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          new<%= classedName %> = res.body;
          done();
        });
    });

    it('should respond with the newly created <%= cameledName %>', function() {
      new<%= classedName %>.name.should.equal('New <%= classedName %>');
      new<%= classedName %>.info.should.equal('This is the brand new <%= cameledName %>!!!');
    });

  });

  describe('GET <%= route %>/:id', function() {
    var <%= cameledName %>;

    beforeEach(function(done) {
      request.get('<%= route %>/' + new<%= classedName %>._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          <%= cameledName %> = res.body;
          done();
        });
    });

    afterEach(function() {
      <%= cameledName %> = {};
    });

    it('should respond with the requested <%= cameledName %>', function() {
      <%= cameledName %>.name.should.equal('New <%= classedName %>');
      <%= cameledName %>.info.should.equal('This is the brand new <%= cameledName %>!!!');
    });

  });

  describe('PUT <%= route %>/:id', function() {
    var updated<%= classedName %>

    beforeEach(function(done) {
      request.put('<%= route %>/' + new<%= classedName %>._id)
        .set('X-XSRF-TOKEN', csrfToken)
        .send({
          name: 'Updated <%= classedName %>',
          info: 'This is the updated <%= cameledName %>!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updated<%= classedName %> = res.body;
          done();
        });
    });

    afterEach(function() {
      updated<%= classedName %> = {};
    });

    it('should respond with the updated <%= cameledName %>', function() {
      updated<%= classedName %>.name.should.equal('Updated <%= classedName %>');
      updated<%= classedName %>.info.should.equal('This is the updated <%= cameledName %>!!!');
    });

  });

  describe('DELETE <%= route %>/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request.delete('<%= route %>/' + new<%= classedName %>._id)
        .set('X-XSRF-TOKEN', csrfToken)
        .expect(204)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when <%= cameledName %> does not exist', function(done) {
      request.delete('<%= route %>/' + new<%= classedName %>._id)
        .set('X-XSRF-TOKEN', csrfToken)
        .expect(404)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });<% } %>

});
