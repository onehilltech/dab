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
  sample,
  sampleSize
} = require ('lodash');

module.exports = function (values, n = 1) {
  return function __dabSample () {
    let pending = [
      this.resolve (values),
      this.resolve (n)
    ];

    return Promise.all (pending).then (([values, n]) => {
      if (values === undefined || n === undefined)
        return undefined;

      return n === 1 ? sample (values) : sampleSize (values, n);
    });
  }
};
