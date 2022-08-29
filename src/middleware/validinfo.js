const validator = require("validator");

const validInfo = async (req, res, next) => {
  const { name, password, email } = req.body;

  // if (!name.length) {
  //   return res.status(400).send("Name is required!");
  // }

  const newEmail = email.trim().toLowerCase();

  if (!validator.isEmail(newEmail.toLowerCase())) {
    return res.status(400).send("Email is invalid!");
  }

  const newPassword = password.trim().toLowerCase();

  if (newPassword.length < 7) {
    return res.status(400).send("Password is to short!");
  } else if (newPassword.includes("password")) {
    return res.status(400).send('Password cannot contain "password"');
  }

  if (req.path === "/create") {
    if (![email, name, password].every(Boolean)) {
      return res.json("Missing Credentials");
    }
  } else if (req.path === "/login") {
    if (![email, password].every(Boolean)) {
      return res.json("Missing Credentials");
    }
  }
  next();
};

module.exports = validInfo;
