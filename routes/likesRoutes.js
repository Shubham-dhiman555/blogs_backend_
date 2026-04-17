const express = require("express");
const router = express.Router();

const { likeBlog, unlikeBlog, getBlogLikes, getUserLikes, Likeandunlike } = require("../controllers/likesController.js");
const { verifyToken } = require("../valid_middle/jwt_middleware.js")

// router.get("/likes", getAlllikes);
// router.post("/likes", createlikes);

// router.post("/blogs/:id/like",verifyToken,likeBlog);
// router.delete("/blogs/:id/unlike",verifyToken,unlikeBlog);
router.post("/blogs/:id/like", verifyToken, Likeandunlike);
router.get("/blogs/:id/likes", getBlogLikes);
// router.get("/users/:id/likes", getUserLikes);

module.exports = router;