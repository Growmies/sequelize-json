# sequelize-json

#### Want to store JSON data in your database (that isn't PostGres)? This is for you. 


## How


* Create a database and a Schema: 


```javascript    

    var Sequelize = require('sequelize'),
        JsonField = require('sequelize-json'),
        db,
        User;

    db = new Sequelize('database', 'username', 'password', {
      dialect: 'sqlite',
      logging: false
    });

    User = db.define('User', {
      username: Sequelize.STRING,
      jsonField: JsonField(db, 'User', 'jsonField')
    });
```

_Note the parameters of JsonField, you pass your Sequelize instance, the name of the model, and the name of the field. A little awkard, but this is needed in order to add the proper hooks to the model instance._

Now, you can always treat that field as a json object: 

```javascript
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
    });
```

It will work with normal `save` commands, as well as `updateAttribute` commands. 



