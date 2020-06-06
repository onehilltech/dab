dab
=====

A complex data builder that uses simple definitions

[![npm version](https://img.shields.io/npm/v/@onehilltech/dab.svg)](https://www.npmjs.com/package/@onehilltech/dab)
[![Build Status](https://travis-ci.org/onehilltech/dab.svg?branch=master)](https://travis-ci.org/onehilltech/dab)
[![Dependencies](https://david-dm.org/onehilltech/dab.svg)](https://david-dm.org/onehilltech/dab)
[![Coverage Status](https://coveralls.io/repos/github/onehilltech/dab/badge.svg?branch=master)](https://coveralls.io/github/onehilltech/dab?branch=master)

Features
--------

* Build data models from data definitions to seed databases
* Compute data values based on other parts of the data model
* Supports [MongoDB](https://www.mongodb.com/) via [Mongoose](http://mongoosejs.com/) 
* Plays nicely with [faker.js](https://github.com/Marak/faker.js)

Getting Started
----------------

First, define your data model.

```javascript
// demo.js

const dab = require ('@onehilltech/dab');

var data = {
  users: [
    {first_name: 'John', last_name: 'Doe'},
    {first_name: 'Jane', last_name: 'Doe'}
  ],
  
  family: [
    {user1: dab.ref ('users.0'), user2: dab.ref ('users.1'), relationship: 'spouse'}
  ]
};
```

Direct Integration
---------------------

Next, build the data model. 

```javascript
// client.js

const backend = require ('@onehilltech/dab-mongodb');

dab.build (data, { backend }).then (models => {
  // model is the final data model  
});
```

You must provide a target backend for the build. In the example above, the target backend 
is [MongoDB](https://www.mongodb.com/). The result will be a data model where all objects 
have an ```_id``` property, and all computed values are resolved. The returned model can also 
seed a [MongoDB](https://www.mongodb.com/) database. Each collection in the data model 
will contain instances of [Mongoose](http://mongoosejs.com/) documents.

```javascript
// client.js

dab.seed (models, conn, { backend }).then (models => {
  // models will be MongoDB models
});
```

Command-line Usage
---------------------

It is possible to generate a dab model from the command-line:

    dab build <dabfile>
    
You can even seed a database from the command-line:

    dab seed --connection <CONNECTION> <dabfile>

Next Steps
-----------------
    
See our [Wiki](https://github.com/onehilltech/dab/wiki) for more details 
on using dab.

Need help? [Contact us](mailto:contact@onehilltech.com)
