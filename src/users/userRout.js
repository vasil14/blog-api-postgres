const express = require("express");
const router = new express.Router();
const userController = require("./userController");
const validInfo = require("../middleware/validinfo");

// GET ALL USERS
router.get("/users", userController.getAll_users);

// CREATE USER
router.post("/create", validInfo, userController.create_user);

// LOGIN USER
router.post("/login", validInfo, userController.login_user);

module.exports = router;
