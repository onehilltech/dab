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
  mapValues,
  isEmpty
} = require ('lodash');

const debug = require ('debug')('dab:clear');
const BluebirdPromise = require ('bluebird');

function clear (conn, models = []) {
  if (isEmpty (conn.models))
    return Promise.resolve ();

  let promises = mapValues (conn.models, (Model, name) => {
    if (isEmpty (models) || models.includes (Model.modelName)) {
      debug (`removing models for ${name}`);
      return Model.remove ({}).exec ();
    }
  });

  return BluebirdPromise.props (promises);
}

module.exports = clear;
