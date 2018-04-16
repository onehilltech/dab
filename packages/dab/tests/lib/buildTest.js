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
  expect
} = require ('chai');

const {
  Types: {
    ObjectId
  }
} = require ('mongoose');

const {
  some
} = require ('lodash');

const build = require ('../../lib/build');
const dab   = require ('../../lib');

describe ('lib | build', function () {
  it ('should build objects on single iteration', function () {
    let data = {
      users: [
        {_id: dab.id (), first_name: 'Jane', last_name: 'Doe'}
      ],

      comments: [
        {user: dab.ref ('users.0'), comment: 'This is a simple comment'}
      ]
    };

    return build (data).then (result => {
      expect (result).to.have.nested.property ('users[0]._id').that.is.instanceof (ObjectId);

      expect (result.comments).to.have.length (1);
      expect (result).to.have.nested.property ('comments[0]._id').that.is.instanceof (ObjectId);
      expect (result).to.have.nested.property ('comments[0].user').that.eql (result.users[0]._id);
    });
  });

  it ('should resolve unresolved paths', function () {
    let data = {
      comments: [
        {user: dab.ref ('users.0'), comment: 'This is a simple comment'}
      ],

      users: [
        {first_name: 'Jane', last_name: 'Doe'}
      ]
    };

    return build (data).then (result => {
      expect (result).to.have.nested.property ('users[0]._id').that.is.instanceof (ObjectId);

      expect (result.comments).to.have.length (1);
      expect (result).to.have.nested.property ('comments[0]._id').that.is.instanceof (ObjectId);
      expect (result).to.have.nested.property ('comments[0].user').that.eql (result.users[0]._id);
    });
  });

  it ('should build model with composed resolvers', function () {
    let data = {
      mapped: dab.map (
        dab.times (5, function (i) { return {username: `username${i}`}; }),
        function (value) {
          value.password = value.username;
          return value;
        })
    };

    return build (data).then (result => {
      expect (result.mapped).to.have.length (5);

      for (let i = 0; i < 5; ++ i)
        expect (result).to.have.nested.property (`mapped[${i}].username`).that.equals (`username${i}`);
    });
  });

  it ('should build a model with embedded resolvers', function () {
    let data = {
      users: [
        {first_name: 'Jane', last_name: 'Doe'},
        {first_name: 'John', last_name: 'Doe'}
      ],

      comments: dab.times (5, function (i) {
        let user = dab.ref (dab.sample (this.get ('users')));
        return {user, comment: `This is comment ${i}`};
      })
    };

    return build (data).then (result => {
      // check the users
      expect (result).to.have.nested.property ('users[0]._id').that.is.instanceof (ObjectId);
      expect (result).to.have.nested.property ('users[1]._id').that.is.instanceof (ObjectId);

      // check the comments
      expect (result.comments).to.have.length (5);

      result.comments.forEach (item => {
        expect (item).to.have.deep.property ('user').that.is.instanceof (ObjectId);

        expect (some (result.users, user => user._id.equals (item.user))).to.be.true;
      });
    });
  });

  it ('should build a model with unresolved values', function () {
    let data = {
      users: dab.times (2, function (i) { return {name: `User${i}`}; }),
      comments: dab.times (5, function (i) {
        let user = dab.ref (dab.sample (dab.get ('users')));
        return {user, comment: `This is comment ${i}`};
      })
    };

    return build (data).then (result => {
      // check the users
      expect (result.users).to.have.length (2);

      for (let i = 0, stop = result.users.length; i < stop; ++ i) {
        expect (result).to.have.nested.property (`users[${i}]._id`).that.is.instanceof (ObjectId);
        expect (result).to.have.nested.property (`users[${i}].name`, `User${i}`);
      }

      // check the comments
      expect (result.comments).to.have.length (5);

      result.comments.forEach (comment => {
        expect (comment).to.have.deep.property ('user').that.is.instanceof (ObjectId);
        expect (some (result.users, user => user._id.equals (comment.user))).to.be.true;
      });
    });
  });
});