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

const dab = require ('../lib');

module.exports = {
  users: dab.times (10, function (i) {
    let username = `user${i}`;
    return {username, password: username, age: dab.randomInt (21, 60)};
  }),

  comments: dab.times (10000, function (i) {
    let user = dab.ref (dab.sample (dab.get ('users')));
    return {user, comment: `This is comment ${i}`};
  }),

  likes: dab.sample (
    dab.map (
      dab.get ('users'),
      function (item) {
        return {user: item._id, comment: dab.ref (dab.sample (dab.get ('comments')))};
      }),
    10)
};
