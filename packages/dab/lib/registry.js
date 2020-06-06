let registry = {};

/**
 * Register a backend with the system.
 *
 * @param name
 * @param backend
 */
function register (name, backend) {
  if (!!registry[name])
    throw new Error (`The backend ${name} has already been registered`);

  registry[name] = backend;
}

module.exports = register;
