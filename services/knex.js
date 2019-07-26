const knex = require('knex');
const { HEROKU_CONNECT, ENV } = require('../config');

function createKnexConnection(connection, searchPath) {
  return knex({
    client: 'pg',
    connection,
    searchPath,
    debug: ENV.IS_LOCAL_DEV
  });
}

const herkokuConnectClient = createKnexConnection(
  HEROKU_CONNECT.DB_URL,
  'salesforce'
);

module.exports = {
  createKnexConnection,
  herkokuConnectClient
};