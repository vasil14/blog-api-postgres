const express = require("express");
const router = new express.Router();
const postController = require("./postController");
const auth = require("../middleware/auth");

// GET ALL POSTS
router.get("/posts", postController.get_posts);

// CREATE POST
router.post("/post", auth, postController.create_post);

// GET POSTS WITH COMMENTS AND REPLIES
router.get("/posts/comments/replies", postController.postsCommentsReplies);

// UPDATE POST
router.patch("/post/:id/update", auth, postController.update_post);

module.exports = router;
