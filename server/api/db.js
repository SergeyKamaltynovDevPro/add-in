var generateUsers = require('./users');
var faker = require('faker');
let path = () => ({
  'users': generateUsers
})

module.exports = path;
