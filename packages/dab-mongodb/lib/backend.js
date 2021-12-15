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

const { Backend } = require ('@onehilltech/dab');
const { mapValues, isEmpty } = require ('lodash');
const { props } = require ('bluebird');
const pluralize = require ('pluralize');
const debug = require ('debug') ('dab:mongodb');

const {
  Types: { ObjectId }
} = require ('mongoose');

module.exports = Backend.extend ({
  id: '_id',

  getPrimaryKeyForPath () {
    return this.id;
  },

  supports (conn, name) {
    const modelName = pluralize.singular (name);
    return !!conn.models[modelName];
  },

  /**
   * Generate a new id, or one based on the existing value.
   *
   * @param value
   */
  generateId (value) {
    return new ObjectId (value);
  },

  /**
   * Seed the database with the selected data.
   *
   * @param conn
   * @param data
   * @returns {*}
   */
  async seed (conn, data) {
    // We want to seed the data in the order that it appears in
    // the data set.

    return props (mapValues (data, (values, name) => {
      let singular = pluralize.singular (name);
      let Model = conn.models[singular];

      if (!Model)
        throw new Error (`Model ${singular} does not exist`);

      debug (`adding models for ${name} to database`);
      return Model.create (values);
    }));
  },

  /**
   * The the models in the listed collections.
   *
   * @param conn
   * @param models
   * @returns {Promise<void>|*}
   */
  async clear (conn, models = []) {
    if (isEmpty (conn.models))
      return Promise.resolve ();

    let promises = mapValues (conn.models, (Model, name) => {
      if (isEmpty (models) || models.includes (Model.modelName)) {
        debug (`removing models for ${name}`);
        return Model.deleteMany ({}).exec ();
      }
    });

    return props (promises);
  }
});
