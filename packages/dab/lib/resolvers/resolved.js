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
  isFunction,
  isArray,
  isObjectLike,
  some,
  values
} = require ('lodash');

module.exports = function (value, func) {
  return function __dabResolved () {
    return this.resolve (value).then (result => {
      function resolved (value) {
        if (value === undefined || isFunction (value))
          return false;

        if (isArray (value) && some (value, v => (v === undefined || isFunction (v) || (isObjectLike (v) && !resolved (values (v))))))
          return undefined;

        return true;
      }

      return resolved (result) ? func (result) : undefined;
    });
  }
};
