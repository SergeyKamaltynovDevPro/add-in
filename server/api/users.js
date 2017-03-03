var faker = require('faker');
module.exports = function generateUsers() {
  let users = [];
  for (let id = 0; id < 20; id++) {
      users.push({
      "id": id,
      "email": faker.internet.email(),
      "createdAt" : faker.date.past(),
      "createdBy" : faker.internet.email(),
      "firstName": faker.name.firstName(),
      "lastName": faker.name.lastName(),
      "jobTitle": faker.name.jobTitle(),
      "phoneNumber": faker.phone.phoneNumber,
      "name": faker.internet.userName(),
      "avatar": faker.image.people(32,32)
    })
  }
  return users
}();
