const bcrypt = require("bcryptjs");
const pool = require("../db/db");
const jwtGenerator = require("../utils/jwtGenerator");

// GET ALL USERS
exports.getAll_users = async (req, res) => {
  pool.query("SELECT * FROM users", (error, result) => {
    if (error) throw error;
    res.status(200).json(result.rows);
  });
};

// CREATE USER
exports.create_user = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const bcryptPassword = await bcrypt.hash(password, 8);

    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES($1, $2, $3) RETURNING *",
      [name, email, bcryptPassword]
    );

    res.status(200).send(newUser.rows[0]);
  } catch (e) {
    res.status(500).send(e);
  }
};

// LOGIN USER
exports.login_user = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Invalid Credential");
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).json("Invalid Credential");
    }

    const id = user.rows[0].user_id.toString();
    const name = user.rows[0].name;
    const jwtToken = jwtGenerator({ id, name });

    const token = await pool.query(
      "INSERT INTO tokens (token, user_id) VALUES($1, $2) RETURNING *",
      [jwtToken, id]
    );
    res.send(token.rows[0]);
  } catch (err) {
    res.status(500).send("Server error");
  }
};
