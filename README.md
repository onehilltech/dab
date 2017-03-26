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
* Current supports MongoDB via Mongoose

Getting Started
----------------

First, define your data model:

```javascript
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

Next, build the data model.

```javascript
dab.build (data, function (err, model) {
  // model is the final data model
});
```

The result will be a data model where all objects have an ```_id``` property, and 
all computed values are resolved. The returned model can also be used to seed a 
MongoDB database. Each collection in the data model will contain instances of 
Mongoose documents.

```javascript
dab.seed (model, function (err, dm) {
  // dm.users will be a collection of Mongoose documents
});
```

Next Steps
-----------------
    
See our [Wiki](https://github.com/onehilltech/blueprint/dab/wiki) for more details 
on using dab.

Need help? [Contact us](mailto:contact@onehilltech.com)
