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

const { props } = require ('bluebird');

module.exports = function (values, func) {
  return async function __dabMap () {
    const result = await this.resolve (values);

    if (result === undefined)
      return undefined;

    if (isArray (result)) {
      return Promise.all (result.map ((...arguments) => func.call (this, ...arguments)));
    }
    else if (isPlainObject (result)) {
      return props (mapValues (result, (...arguments) => func.call (this, ...arguments)));
    }
    else {
      throw new Error (`the map function does not support ${typeof values} types`);
    }
  }
};
