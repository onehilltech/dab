'use strict';

const async    = require ('async')
  , _          = require ('underscore')
  , objectPath = require ('object-path')
  , debug      = require ('debug') ('dab:phase:resolve')
  ;

function Resolver (opts, data, path) {
  if (!_.isFunction (data.get))
    data = objectPath (data);

  this._opts = opts;
  this._data = data;
  this._unresolved = {};
  this._path = path || [];
}

Resolver.prototype.getChild = function (path) {
  var childPath = this._path.slice ();

  if (path !== undefined)
    childPath.push (path);

  return new Resolver (this._opts, this._data, childPath);
};

Resolver.prototype.__defineGetter__ ('unresolved', function () {
  return this._unresolved;
});

Resolver.prototype.__defineGetter__ ('data', function () {
  return this._data;
});

Resolver.prototype.__defineGetter__ ('opts', function () {
  return this._opts;
});

Resolver.prototype.resolve = function (value, callback) {
  function resolved (child, value, callback) {
    return function (err, result) {
      if (err)
        return callback (err);

      if (!_.isEmpty (child.unresolved))
        this._unresolved = _.extend (this._unresolved, child.unresolved);

      if (result === undefined)
        this._unresolved[child.path] = value;

      return callback (null, result);
    }.bind (this);
  }

  if (_.isFunction (value)) {
    // The document docs is a function. This means we need to resolve it,
    // and run this again just in case any of the values contains a function.
    // resolved.
    async.waterfall ([
      function (callback) {
        value.call (this, callback);
      }.bind (this),

      function (result, callback) {
        this.resolve (result, callback);
      }.bind (this)
    ], callback);
  }
  else if (_.isArray (value)) {
    process.nextTick (function () {
      // We need to create a map out of the array so we can have the index
      // values for our child resolvers.
      var wrapped = value.map (function (value, index) {
        return {index: index, value: value};
      });

      async.map (wrapped, function (item, callback) {
        var resolver = this.getChild (item.index);
        resolver.resolve (item.value, resolved.call (this, resolver, value, callback));
      }.bind (this), callback);
    }.bind (this));
  }
  else if (_.isObject (value) && value.constructor === Object) {
    // We only want to map items that are hashes. Otherwise, we can assume
    // the item is an instance of an abstract data type.
    process.nextTick (function () {
      async.mapValues (value, function (value, key, callback) {
        var resolver = this.getChild (key);
        resolver.resolve (value, resolved.call (this, resolver, value, callback));
      }.bind (this), callback);
    }.bind (this));
  }
  else if (value === undefined) {
    return callback (null, value);
  }
  else if (value === null) {
    return callback (null, value);
  }
  else {
    return callback (null, value);
  }
};

Resolver.prototype.__defineGetter__ ('path', function () {
  return this._path.join ('.');
});

/**
 * Resolve the values in the data model.
 *
 * @param opts            Resolve options
 * @param data            Optional data model; if null, the value is used.
 */
function resolve (opts, data) {
  return function __resolve (value, callback) {
    var resolver = new Resolver (opts, data || value);

    resolver.resolve (value, function (err, result) {
      if (err)
        return callback (err);

      return callback (null, result, resolver.unresolved);
    });
  };
}

module.exports = resolve;
