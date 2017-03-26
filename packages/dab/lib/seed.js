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

    if (Model)
      return Model.create (values, callback);
    else
      return callback (new Error (util.format ('model %s does not exist', singular)));
  }, callback);
}
