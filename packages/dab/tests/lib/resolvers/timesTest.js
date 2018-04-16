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
const times = require ('../../../lib/resolvers/times');

describe ('lib | resolvers | times', function () {
  it ('should generate 5 users', function () {
    let context = {
      resolve (values) { return Promise.resolve (values); }
    };

    function computeEmail (i) {
      return {email: `tester${i}@no-reply.com`};
    }

    return times (5, computeEmail).call (context).then (data => {
      expect (data).to.have.length (5);

      for (let i = 0; i < data.length; ++ i)
        expect (data[i]).to.have.property ('email', `tester${i}@no-reply.com`);
    });
  });
});
