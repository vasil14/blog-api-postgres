const jwt = require("jsonwebtoken");
require("dotenv").config();

function jwtGenerator(data) {
  const { id, name } = data;
  const payload = {
    user: {
      id: id,
      autor: name,
    },
  };

  return jwt.sign(payload, process.env.jwtSecret);
}

module.exports = jwtGenerator;
