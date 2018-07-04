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
const resolve  = require ('../../../lib/phase/resolve');
const {
  Types: {
    ObjectId
  }
} = require ('mongoose');

const dab = require ('../../../lib');

describe ('lib | phase | resolve', function () {
  it ('should a property in an object', function () {
    let data = {
      users: [
        {_id: ObjectId (), first_name: 'Jane', last_name: 'Doe'},
        {_id: ObjectId (), first_name: 'John', last_name: 'Doe'}
      ],

      comments: [
        {_id: ObjectId (), user: dab.ref ('users.0'), comment: 'This is a simple comment'}
      ]
    };

    return resolve (data, data).then (({data, unresolved}) => {
      expect (data).to.have.nested.property ('comments.0.user').to.eql (data.users[0]._id);
      expect (unresolved).to.eql ({});
    });
  });

  it ('should resolve a function that generates an array', function () {
    let data = {
      users: [
        {_id: ObjectId (), first_name: 'Jane', last_name: 'Doe'},
        {_id: ObjectId (), first_name: 'John', last_name: 'Doe'}
      ],

      comments: dab.times (5, function (i) {
        return {_id: ObjectId ()};
      })
    };

    return resolve (data, data).then (({data, unresolved}) => {
      expect (data.comments).to.have.length (5);
      expect (unresolved).to.eql ({});
    });
  });

  it ('should resolve a static value', function () {
    return resolve ('static-value', {}).then (({data,unresolved}) => {
      expect (data).to.equal ('static-value');
      expect (unresolved).to.eql ({});
    });
  });

  it ('should resolve function composition', function () {
    let data = {
      mapped: dab.map (
        dab.times (5, function (i) { return {username: 'username' + i}}),

        function (value) {
          value.password = value.username;
          return value;
        })
    };

    return resolve (data, data).then (({data,unresolved}) => {
      expect (unresolved).to.eql ({});
      expect (data.mapped).to.have.length (5);

      for (let i = 0; i < 5; ++ i)
        expect (data.mapped[i].username).to.equal (data.mapped[i].password);
    });
  });

  it ('should have unresolved values', function () {
    let data = {
      values: dab.times (5, function (i) {
        return {value: i};
      }),

      mapped: dab.map (dab.get ('values'), function (item) {
        item.times3 = item.value * 3;
        return item;
      })
    };

    return resolve (data, data).then (({data,unresolved}) => {
      expect (unresolved).to.have.keys (['mapped']);
      expect (unresolved).to.have.nested.property ('mapped.name', '__dabMap');
    });
  });

  it ('should have unresolved values because of nested resolvers', function () {
    let data = {
      users: dab.times (2, function (i) {
        return {_id: new ObjectId (), username: `username${i}`};
      }),

      comments: dab.times (2, function (i) {
        let user = dab.ref (dab.sample (dab.get ('users')));
        return {user: user, comment: `This is comment #${i}`};
      })
    };

    return resolve (data, data).then (({data,unresolved}) => {
      expect (unresolved).to.have.keys (['comments.0.user', 'comments.1.user']);

      expect (data).to.have.nested.property ('comments.0.user').to.be.a ('function');
      expect (data).to.have.nested.property ('comments.1.user').to.be.a ('function');

      expect (data.comments).to.have.length (2);
    });
  });
});
