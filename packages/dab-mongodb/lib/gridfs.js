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
  GridFSBucket
} = require ('mongodb');

const mime = require ('mime-types');
const fs = require ('fs');
const path = require ('path');

let identity = x => x;

module.exports = function (file, db, bucketName, finish = identity) {
  return async function __dabGridFS () {
    return new Promise ((resolve, reject) => {
      const bucket = new GridFSBucket (db, {bucketName});
      const contentType = mime.lookup (file);
      const opts = {contentType};
      const name = path.basename (file);

      let upload = bucket.openUploadStream (name, opts);

      fs.createReadStream (file)
        .pipe (upload)
        .once ('error', reject)
        .once ('finish', () => resolve (finish (upload)));
    });
  };
};
