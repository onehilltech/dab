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

const { drop } = require ('lodash');

module.exports = function (array, n) {
  return function __dabDrop () {
    return Promise.all ([
      this.resolve (array),
      this.resolve (n)
    ]).then (([array, n]) => {
      if (array === undefined || n === undefined)
        return undefined;

      return drop (array, n);
    });
  };
};
