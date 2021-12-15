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
  pick
} = require ('lodash');

module.exports = function (_value, _paths) {
  return async function __dabPick () {
    const [value, paths] = await Promise.all ([
      this.resolve (_value),
      this.resolve (_paths)
    ]);

    if (value === undefined || paths === undefined)
      return undefined;

    return pick (value, paths);
  }
};
