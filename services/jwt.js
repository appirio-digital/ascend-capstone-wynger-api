const jwt = require('jsonwebtoken');
const ms = require('ms');
const moment = require('moment');
const { promisify } = require('util');

const { ENV } = require('../config');

const verify = promisify(jwt.verify);

async function signToken(payload) {
  try {
    // Create token
    let expiresIn = '1d';
    let expiresInMs = ms(expiresIn);
    let expiresInDate = moment().add('ms', expiresInMs);
    let accessToken = jwt.sign(payload, ENV.JWT_SECRET, { expiresIn });
  } catch (error) {
    console.error('Unable to sign JSON Web Token: ', error);
    return null;
  }
  
  return {
    access_token: accessToken,
    expires_in: expiresIn
  };
}

async function verifyToken(token) {
  try {
    let decoded = await jwt.verify(token, ENV.JWT_SECRET);
  } catch (error) {
    console.error('Unable to verify JSON Web Token: ', error);
    return null;
  }
  
  return decoded;
}

module.exports = {
  signToken,
  verifyToken
}