var expect  = require('chai').expect;
var request = require('request');
const uuidv1 = require('uuid/v1');

const base_url = 'http://localhost:5000/api/';
const headers = {
  'X-Device': 'mobile',
  'X-Language': 'en',
  'Content-Type': 'application/json'
}

doSignup('admin', 'admin@gmail.com', '123456', 'admin');

function doSignup(name, email, password, role) {
  request({
    url: base_url + 'signup',
    method: 'POST',
    headers: headers,
    form: {
      name: name,
      email: email,
      password: password,
      role: role}
    });
}

function doLogin(email, password, callback) {
  request({
    url: base_url + 'signin',
    method: 'POST',
    headers: headers,
    form: {
      email: email,
      password: password
    }} , function(error, response, body) {
      let uuid = response.headers.uuid;
      callback(uuid);
  });
}

describe('/signup', function(){
  const url = base_url + 'signup';
  var options = {
    url: url,
    method: 'POST',
    headers: headers,
  }

  describe('error', function(){
    it('should return error if header is missing', function(done) {
      request({
        url: url,
        method: 'POST',
        form: {
          name: 'thanh',
          email: 'temp@gmail.com',
          password: '123456'
        }} , function(error, response, body) {
          expect(response.statusCode).to.equal(500);
          done();
      });
    });

    it('should return error if name is missing', function(done) {
      request({
        ...options,
        form: {
          email: 'temp@gmail.com',
          password: '123456'
        }} , function(error, response, body) {
          expect(response.statusCode).to.equal(500);
          done();
      });
    });

    it('should return error if password is less then 6 letters', function(done) {
      request({
        ...options,
        form: {
          name: 'Thanh',
          email: 'temp@gmail.com',
          password: '12345'
        }} , function(error, response, body) {
          expect(response.statusCode).to.equal(500);
          done();
      });
    });
  
    it('should return error if email is invalid', function(done) {
      request({
        ...options,
        form: {
          name: 'Thanh',
          email: 'temp@gmail',
          password: '123456'
        }} , function(error, response, body) {
          expect(response.statusCode).to.equal(500);
          done();
      });
    });
  
    it('should return error if email already in use', function(done) {
      request({
        ...options,
        form: {
          name: 'Thanh',
          email: 'admin@gmail.com',
          password: '123456',
          role: 'admin'
        }
      } , function(error, response, body) {
          expect(response.statusCode).to.equal(500);
          done();
      });
    });
  });

  describe('success', function(){
    it('should return user in json format for mobile', function(done) {
      let email = `test_${uuidv1()}@gmail.com`;
      request({
        ...options,
        form: {
          name: 'thanh',
          email: email,
          password: '123456'
        }} , function(error, response, body) {
          body = JSON.parse(body);
          expect(response.statusCode).to.equal(200);
          expect(body.success).equal(true);
          expect(body.data.fullname).equal('thanh');
          expect(body.data.email).equal(email);
          done();
      });
    });

    it('should return user in json format for webapp', function(done) {
      let email = `test_${uuidv1()}@gmail.com`;
      request({
        url: url,
        method: 'POST',
        headers: {
          'X-Device': 'webapp',
          'X-Language': 'en',
          'Content-Type': 'application/json'
        },
        form: {
          name: 'thanh',
          email: email,
          password: '123456'
        }} , function(error, response, body) {
          body = JSON.parse(body);
          expect(response.statusCode).to.equal(200);
          expect(body.success).equal(true);
          expect(body.data.full_name).equal('thanh');
          expect(body.data.login_id).equal(email);
          done();
      });
    });
  });
});


describe('/signin', function(){
  const url = base_url + 'signin';
  var options = {
    url: url,
    method: 'POST',
    headers: headers,
  }

  describe('error', function(){
    it('should return error if password not match', function(done) {
      request({
        url: url,
        method: 'POST',
        form: {
          name: 'thanh',
          email: 'admin@gmail.com',
          password: 'fdsfsdfdssd'
        }} , function(error, response, body) {
          expect(response.statusCode).to.equal(500);
          done();
      });
    });
  });

  describe('success', function(){
    it('should return uuid in header and user info', function(done) {
      let email = 'admin@gmail.com'; 
      request({
        ...options,
        form: {
          name: 'thanh',
          email: email,
          password: '123456'
        }} , function(error, response, body) {
          body = JSON.parse(body);
          expect(response.statusCode).to.equal(200);
          
          expect(response.headers.uuid).length > 0;

          expect(body.success).equal(true);
          expect(body.data.email).equal(email);
          done();
      });
    });
    
  });
});

describe('/search', function(){
  const url = base_url + 'search?name=thanh';
  var options = {
    url: base_url + 'search?name=thanh',
    method: 'GET',
  }

  describe('error', function(){
    it('should return error permission denied if user is not admin role', function(done) {
      let emailTest = 'test_user@gmail.com';
      doSignup('Test user', emailTest, '123456', 'user');
      doLogin(emailTest, '123456', function(uuid){
        request({
          ...options,
          headers: {
            ...headers,
            uuid: uuid
          }
        }, function(error, response, body) {
          body = JSON.parse(body);
          expect(response.statusCode).to.equal(500);
          expect(body.error).to.equal('Permission denied!');
          done();
        });
      });
    });
  });

  describe('success', function(){
    it('should return search results if user is admin role', function(done) {
      doLogin('admin@gmail.com', '123456', function(uuid){
        request({
          ...options,
          headers: {
            ...headers,
            uuid: uuid
          }
        }, function(error, response, body) {
          body = JSON.parse(body);
          expect(response.statusCode).to.equal(200);
          expect(body.success).equal(true);
          expect(body.data).length > 0;
          body.data.forEach(element => {
            expect(element.name.toLowerCase()).include('thanh');
          });
          done();
        });
      });
    });

    it('should return the new uuid after each request', function(done) {
      doLogin('admin@gmail.com', '123456', function(uuid){
        request({
          ...options,
          headers: {
            ...headers,
            uuid: uuid
          }
        }, function(error, response, body) {
          expect(response.statusCode).to.equal(200);

          expect(response.headers.uuid).length > 0;
          expect(response.headers.uuid) != uuid;

          done();
        });
      });
    });
  });

});