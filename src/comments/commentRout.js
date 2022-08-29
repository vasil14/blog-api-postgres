const express = require("express");
const router = new express.Router();
const commentController = require("./commentController");
const auth = require("../middleware/auth");

// CREATE COMMENT
router.post("/post/:id/comment", auth, commentController.create_comment);

// CREATE REPLY
router.post("/comment/:id/reply", auth, commentController.create_reply);

// GET ALL COMMENTS
router.get("/comments", commentController.get_comments);

// GET ALL REPLIES
router.get("/replies", commentController.get_replies);

module.exports = router;
