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
  filter
} = require ('lodash');

module.exports = function (values, func) {
  return function __dabFilter () {
    return this.resolve (values).then (result => {
      if (result === undefined)
        return undefined;

      let filtered = filter (result, (value, key) => func.call (this, value, key));
      return Promise.all (filtered);
    });
  };
};
