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

const {expect} = require ('chai');
const mongoose = require ('mongoose');

const {
  Types: {
    ObjectId
  }
} = mongoose;

const path     = require ('path');
const gridfs   = require ('../../../../lib/resolvers/gridfs');

const file = path.resolve ('./tests/data/dab.jpg');

describe ('lib | resolvers | gridfs', function () {
  let conn = mongoose.createConnection ();

  before (function () {
    return conn.openUri ('mongodb://localhost/dab_tests', {useNewUrlParser: true});
  });

  after (function () {
    return conn.close ();
  });

  it ('should add a file to GridFS', function () {
    let context = {
      resolve (values) {
        return Promise.resolve (values);
      }
    };

    return gridfs (file, conn.db, 'images').call (context).then (upload => {
      expect (upload).to.have.property ('id').to.be.instanceof (ObjectId);
    });

  });
});
