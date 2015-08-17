'use strict';

var app = require('../../app');<% if (filters.mongooseModels) { %>
var User = require('./user.model');<% } %><% if (filters.sequelizeModels) { %>
var User = require('../../sqldb').User;<% } %>
var supertest = require('supertest');

describe('User API:', function() {
  var request, csrfToken, user;

  // Clear users before testing
  before(function() {
    return <% if (filters.mongooseModels) { %>User.removeAsync().then(function() {<% }
       if (filters.sequelizeModels) { %>User.destroy({ where: {} }).then(function() {<% } %>
      <% if (filters.mongooseModels) { %>user = new User({<% }
         if (filters.sequelizeModels) { %>user = User.build({<% } %>
        name: 'Fake User',
        email: 'test@test.com',
        password: 'password'
      });

      return <% if (filters.mongooseModels) { %>user.saveAsync();<% }
         if (filters.sequelizeModels) { %>user.save();<% } %>
    });
  });

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

  // Clear users after testing
  after(function() {
    <% if (filters.mongooseModels) { %>return User.removeAsync();<% }
       if (filters.sequelizeModels) { %>return User.destroy({ where: {} });<% } %>
  });

  describe('GET /api/users/me', function() {
    var token;

    beforeEach(function(done) {
      request.post('/auth/local')
        .set('X-XSRF-TOKEN', csrfToken)
        .send({
          email: 'test@test.com',
          password: 'password'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          token = res.body.token;
          done();
        });
    });

    it('should respond with a user profile when authenticated', function(done) {
      request.get('/api/users/me')
        .set('authorization', 'Bearer ' + token)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          res.body._id.toString().should.equal(user._id.toString());
          done();
        });
    });

    it('should respond with a 401 when not authenticated', function(done) {
      request.get('/api/users/me')
        .expect(401)
        .end(done);
    });
  });
});
