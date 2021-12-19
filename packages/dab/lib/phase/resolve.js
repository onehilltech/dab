/*
 * Copyright (c) 2018 One Hill Technologies, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

const { props } = require ('bluebird');

const {
  isFunction,
  isArray,
  isEmpty,
  isPlainObject,
  extend,
  mapValues,
  get,
  some
} = require ('lodash');

class Resolver {
  constructor (opts, data, path = []) {
    this._opts = opts;
    this._data = data;
    this.unresolved = {};
    this._path = path;
    this._genIds = opts.genIds || false;

    Object.defineProperty (this, 'data', {
      get () { return this._data; }
    });

    Object.defineProperty (this, 'opts', {
      get () { return this._opts; }
    });

    Object.defineProperty (this, 'path', {
      get () { return this._path.join ('.') }
    });

    Object.defineProperty (this, 'backend', {
      get () { return this._opts.backend }
    });
  }

  get (path, defaultValue) {
    return get (this._data, path, defaultValue);
  }

  getChild (path, opts) {
    let parts = this._path.slice ();

    if (path !== undefined)
      parts.push (path);

    return new Resolver (opts || this._opts, this._data, parts);
  }

  async resolve (value) {
    function resolved (resolver, original) {
      return function (result) {
        // Add the unresolved values from the child resolver to our resolver.
        if (this !== resolver && !isEmpty (resolver.unresolved))
          extend (this.unresolved, resolver.unresolved);

        // The the result is undefined, then we need to add it to our collection
        // of unresolved values.
        if (result === undefined)
          this.unresolved[resolver.path] = original;

        return result;
      }
    }

    if (isFunction (value)) {
      // The value is a function. Let's call the function with the resolver as it
      // context. The result of the function can be a value or another Promise.
      // Either way, we need to resolve the return value, then resolve the result.

      const ret = await value.call (this);
      const result = resolved (this, value).call (this, ret);

      return this.resolve (result);
    }
    else if (isArray (value)) {
      // We need to resolve each value in the array. For each value, we need to create
      // a new resolver since each item in the array has a different path based on its
      // index value (e.g., item[0], item[1], ..., item[n]).

      const mapped = value.map (async (item, index) => {
        const childOpts = extend ({}, this._opts, { genIds: true });
        const resolver = this.getChild (index, childOpts);

        const ret = await resolver.resolve (item);
        const result = resolved (resolver, item).call (this, ret);

        return result !== undefined ? result : item;
      });

      return Promise.all (mapped);
    }
    else if (isPlainObject (value)) {
      // We only want to map items that are hashes. Otherwise, we can assume
      // the item is an instance of an abstract data type. Also, let's make sure
      // that the item has an _id.
      let id = this.backend.getPrimaryKeyForPath (this.path);

      if (this._genIds && value[id] === undefined)
        value[id] = this.backend.generateId (null, this.path);

      const mapping = mapValues (value, async (value, key) => {
        const childOpts = extend ({}, this._opts, {genIds: true});
        const resolver = this.getChild (key, childOpts);

        const ret = await resolver.resolve (value);
        const result = resolved (resolver, value).call (this, ret);

        return result !== undefined ? result : value;
      });

      return props (mapping);
    }
    else {
      return value;
    }
  }

  isUnresolved (value) {
    return value === undefined ||
      isFunction (value) ||
      (isArray (value) && some (value, val => this.isUnresolved (val))) ||
      (isPlainObject (value) && some (Object.values (value), val => this.isUnresolved (val)));
  }
}

/**
 * Resolve the values in the data model.
 */
async function resolve (value, data, opts = {}, path = null) {
  let resolver = new Resolver (opts, data, path ? path.split ('.') : []);

  const result = await resolver.resolve (value);
  return { data: result, unresolved: resolver.unresolved };
}

module.exports = resolve;
