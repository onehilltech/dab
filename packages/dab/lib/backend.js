const { BaseObject } = require ('base-object');

module.exports = BaseObject.extend ({
  /// Human readable name for the backend.
  name: null,

  /**
   * Test if the backend supports a model.
   *
   * @param Model
   */
  supportsModel (Model) {

  },

  /**
   * Generate the id for a model.
   *
   * @param value
   */
  generateId (value) {

  },

  /**
   * Seed the database with the set of models.
   *
   * @param conn
   * @param models
   */
  seed (conn, models) {

  }
});
