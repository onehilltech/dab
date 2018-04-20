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

const pluralize = require ('pluralize');

const {
  transform
} = require ('lodash');

const debug = require ('debug') ('dab:seed');

function seed (conn, data) {
  // We want to seed the data in the order that it appears in
  // the data set.
  return transform (data, (promise, values, name) => {
    let singular = pluralize.singular (name);
    let Model = conn.models[singular];

    if (!Model)
      return promise.then (() => Promise.reject (new Error (`Model ${singular} does not exist`)));

    debug (`creating models for ${name} in database`);
    return promise.then (() => Model.create (values));
  }, Promise.resolve ());
}

module.exports = seed;
