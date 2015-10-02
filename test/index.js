var Sequelize = require('sequelize'),
    mocha     = require('mocha'),
    expect    = require('chai').expect,
    JsonField = require('../'),
    db,
    User;

describe('Test the various uses of the JSON field', function() {

  beforeEach(function(done) {
    db = new Sequelize('database', 'username', 'password', {
      dialect: 'sqlite',
      logging: false
    });

    User = db.define('User', {
      username: Sequelize.STRING,
      jsonField: new JsonField(db, 'User', 'jsonField')
    });

    db
    .sync({ force: true })
    .then(function() {
      done();
    });
  });

  it('Should test the basic use case of a JSON field', function(done) {
    User.create({
      username: 'Scott',
      jsonField: { likes: ['running', 'node', 'tests'] }
    })
    .then(function(user) {
      expect(user.jsonField).to.be.a('object');
      expect(user.jsonField.likes).to.have.length(3);
      done();
    })
    .catch(done);

  });

  it('Should test updating the JSON field with `updateAttributes`', function(done) {
    User.create({
      username: 'Scott',
      jsonField: {
        likes: ['running', 'node']
      }
    })
    .then(function(user) {
      var jsonField = user.jsonField;
      jsonField.likes.push('tests');

      return user.updateAttributes({
        jsonField : jsonField
      });
    })
    .then(function(user) {
      expect(user.jsonField).to.be.a('object');
      expect(user.jsonField.likes).to.have.length(3);
      done();
    })
    .catch(done);

  });

  it('Should also work with modifying the JSON field directly and then calling `save`', function(done) {
    User.create({
      username: 'Scott',
      jsonField: {
        likes: ['running', 'node']
      }
    })
    .then(function(user) {
      user.jsonField.likes.push('tests');
      return user.save();
    })
    .then(function(user) {
      expect(user.jsonField).to.be.a('object');
      expect(user.jsonField.likes).to.have.length(3);
      done();
    })
    .catch(done);
  });

  it('Should work to create a user, modify the JSON field, save, then retrieve, and access the JSON field', function(done) {
    User.create({
      username: 'Scott',
      jsonField: {
        likes: ['running', 'node']
      }
    })
    .then(function(user) {
      user.jsonField.likes.push('tests');
      return user.save();
    })
    .then(function(user) {
      return User.findById(user.id);
    })
    .then(function(fetchedUser) {
      expect(fetchedUser.jsonField).to.be.a('object');
      expect(fetchedUser.jsonField.likes).to.have.length(3);
      done();
    })
    .catch(done);
  });

  it('You should be able to modify the json field and see how it changes before you call save', function(done) {
    User.create({
      username: 'Scott',
      jsonField: {
        likes: ['running', 'node']
      }
    })
    .then(function(user) {
      user.jsonField.likes.push('tests');
      expect(user.jsonField).to.be.a('object');
      expect(user.jsonField.likes).to.have.length(3);
      done();
    })
    .catch(done);
  });

  it('Default value should be undefined if nothing is provided', function(done) {
    User.create({
      username: 'Scott'
    })
    .then(function(user) {
      expect(user.jsonField).to.be.a('undefined');
      done();
    })
    .catch(done);
  });
});

describe('Test default values', function() {

  beforeEach(function(done) {
    db = new Sequelize('database', 'username', 'password', {
      dialect: 'sqlite',
      logging: false
    });

    User = db.define('User', {
      username: Sequelize.STRING,
      jsonField: new JsonField(db, 'User', 'jsonField', { defaultValue: { stuff: 'stuffValue' }})
    });

    db
    .sync({ force: true })
    .then(function() {
      done();
    });
  });

  it('Should be able to pass in a default value', function(done) {
    User.create({
      username: 'Scott'
    })
    .then(function(user) {
      expect(user.jsonField).to.be.a('object');
      expect(user.jsonField.stuff).to.equal('stuffValue');
      done();
    })
    .catch(done);
  });

  it('You should be able to override the default value', function(done) {
    User.create({
      username: 'Scott',
      jsonField: {
        likes: ['running', 'node']
      }
    })
    .then(function(user) {
      user.jsonField.likes.push('tests');
      expect(user.jsonField).to.be.a('object');
      expect(user.jsonField.likes).to.have.length(3);
      done();
    })
    .catch(done);
  });


});
