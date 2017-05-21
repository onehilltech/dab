'use strict';

const async   = require ('async')
  , util      = require ('util')
  , pluralize = require ('pluralize')
  , mongoose  = require ('mongoose')
  ;

module.exports = seed;


function seed (data, conn, callback) {
  if (!callback) {
    callback = conn;
    conn = mongoose;
  }

  async.mapValues (data, function (values, name, callback) {
    var singular = pluralize.singular (name);
    var Model = conn.models[singular];

    if (!Model)
      return callback (new Error (util.format ('Model %s does not exist', singular)));

    return Model.create (values, function (err, models) {
      if (err)
        console.error ('Failed to seed ' + name);

      return callback (err, models);
    });
  }, callback);
}
