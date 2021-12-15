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

const { flattenDeep, some, isFunction } = require ('lodash');

module.exports = function (_array) {
  return async function __dabFlattenDeep () {
    const array = await this.resolve (_array);

    if (array === undefined)
      return undefined;

    if (some (array, value => (value === undefined || isFunction (value))))
      return undefined;

    return flattenDeep (array);
  };
};
