/*
 * Copyright (c) 2020 One Hill Technologies, LLC
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
  chunk,
  isFunction,
  some
} = require ('lodash');

module.exports = function (_array, _size = 1) {
  return async function __dabChunk () {
    const [array, size] = await Promise.all ([
      this.resolve (_array),
      this.resolve (_size)
    ]);

    if (array === undefined || size === undefined)
      return undefined;

    if (some (array, value => (value === undefined || isFunction (value))))
      return undefined;

    return chunk (array, size);
  };
};
