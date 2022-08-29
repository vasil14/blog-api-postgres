const jwt = require("jsonwebtoken");
const pool = require("../db/db");
require("dotenv").config();

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.jwtSecret);

    const user = await pool.query("SELECT * FROM users WHERE user_id= $1", [
      decoded.user.id,
    ]);

    req.user = decoded.user;
    req.token = token;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = auth;
