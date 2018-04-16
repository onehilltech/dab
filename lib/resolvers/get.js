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
  isFunction
} = require ('lodash');

const debug = require ('debug') ('dab:get');

module.exports = function (path) {
  return function __dabGet () {
    let value = this.get (path);

    // If the result of get is a function, then that means the value has not
    // be resolved up to this point. We need to return undefined so the resolver
    // can include this this in the unresolved set.
    debug (`getting path ${path}`);

    if (isFunction (value))
      value = undefined;

    return value;
  }
};
