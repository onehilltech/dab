'use strict';

const async  = require ('async')
  , mongoose = require ('mongoose')
  , ObjectId = mongoose.Types.ObjectId
  , _        = require ('underscore')
  ;

function generateIds (opts) {
  var id = opts.id || '_id';

  return function (data, callback) {
    // The data is an object that maps model names to values.
    async.mapValues (data, function (docs, key, callback) {
      if (_.isArray (docs)) {
        async.map (docs, function (doc, callback) {
          // Generate an id for the document.
          if (!doc[id])
            doc[id] = new ObjectId ();

          return callback (null, doc);
        }, callback);
      }
      else if (_.isFunction (docs)) {
        return callback (null, docs);
      }
      else {
        return callback (new Error ('unsupported data type'));
      }
    }, callback);
  };
}

module.exports = generateIds;
