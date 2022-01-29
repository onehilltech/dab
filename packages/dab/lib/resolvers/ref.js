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
  isString,
  isFunction,
  isPlainObject
} = require ('lodash');

module.exports = function (value) {
  async function __dabRef () {
    const result = await this.resolve (value);

    if (result === undefined)
      return undefined;

    const idKey = this.opts.id || this.backend.getPrimaryKeyForPath (this.path);

    if (isString (result)) {
      const idPath = result + '.' + idKey;
      const id = this.get (idPath);

      if (isFunction (id))
        return undefined;

      return id;
    }
    else if (isPlainObject (result)) {
      return result[idKey];
    }
  }

  Object.defineProperty (__dabRef, 'key', {
    value,
    writeable: false
  });

  return __dabRef;
};
