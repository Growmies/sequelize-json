var Sequelize = require('sequelize');

function JsonField(db, modelName, fieldName, options) {
  var self = this;
  options = options || {};

  process.nextTick(function() {
    db.models[modelName].hook('beforeUpdate', function(instance) {
      if (typeof instance.dataValues[fieldName] !== 'string' && instance.dataValues[fieldName]) {
        instance.setDataValue(fieldName, JSON.stringify(instance.getDataValue(fieldName)));
        return self;
      } else if (instance.dataValues[fieldName] === 'null' || !instance.dataValues[fieldName]) {
        instance.setDataValue(fieldName, null);
      }
    });
  });

  var model = {
    type: options.type || Sequelize.TEXT,
    get: function() {
      var currentValue = this.getDataValue(fieldName);
      if (typeof currentValue == 'string') {
        this.dataValues[fieldName] = JSON.parse(currentValue);
      }
      return this.dataValues[fieldName];
    },
    set: function(value) {
      this.setDataValue(fieldName, JSON.stringify(value));
    }
  };

  if (options.hasOwnProperty('defaultValue')) {
    model.defaultValue = JSON.stringify(options.defaultValue);
  }

  return model;
}

module.exports = JsonField;
