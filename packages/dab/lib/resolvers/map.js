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

const {
  isArray,
  isPlainObject,
  mapValues
} = require ('lodash');

const BluebirdPromise = require ('bluebird');

module.exports = function (values, func) {
  return function __dabMap () {
    return this.resolve (values).then (result => {
      if (result === undefined)
        return undefined;

      if (isArray (result)) {
        let mapped = result.map ((item, index, collection) => func.call (this, item, index, collection));
        return Promise.all (mapped);
      }
      else if (isPlainObject (result)) {
        let mapped = mapValues (result, (value, key, obj) => func.call (this, value, key, obj));
        return BluebirdPromise.props (mapped);
      }
      else {
        return Promise.reject (new Error ('values is an invalid type'));
      }
    });
  }
};
