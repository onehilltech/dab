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

const resolve = require ('./phase/resolve');

const {
  get,
  set,
  isEmpty,
  mapValues,
  transform
} = require ('lodash');

const debug = require ('debug') ('dab:build');

const BluebirdPromise = require ('bluebird');

const DEFAULT_MAX_ITERATIONS = 10;

class Builder {
  constructor (opts = {}) {
    this._maxIters = get (opts, 'maxIters', DEFAULT_MAX_ITERATIONS);
    this._opts = opts;
  }

  build (data) {
    this._iteration = 1;

    return resolve (data, data, this._opts)
      .then (({data, unresolved}) => this._resolve (data, unresolved));
  }

  _resolve (snapshot, unresolved) {
    if (isEmpty (unresolved))
      return snapshot;

    if (this._iteration > this._maxIters)
      return Promise.reject (new Error ('We have reached the max iterations'));

    debug (`iteration ${this._iteration} complete`);

    // Attempt to resolve all the unresolved values.
    ++ this._iteration;

    debug (`resolving ${Object.keys (unresolved).length} values`);

    const pending = mapValues (unresolved, (value, key) => resolve (value, snapshot, this._opts, key));

    return BluebirdPromise.props (pending).then (resolved => {
      const remaining = transform (resolved, (remaining, value, key) => {
        const {data, unresolved} = value;

        if (data) {
          set (snapshot, key, data);
        }

        if (!isEmpty (unresolved)) {
          Object.assign (remaining, unresolved);
        }
      }, {});

      return this._resolve (snapshot, remaining);
    });
  }
}

/**
 * Build a dab data model
 *
 * @param data          Dab data model
 * @param opts          Build options
 */
function build (data, opts = {}) {
  if (!opts.backend)
    throw new Error ('You must provide a backend options.');

  let builder = new Builder (opts);
  return builder.build (data);
}

module.exports = build;
