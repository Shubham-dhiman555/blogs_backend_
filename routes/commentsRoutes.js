const express = require("express");
const router = express.Router();

const { createcomment, getCommentsTree, getReplies, deleteComment,updateComment } = require("../controllers/commentsController.js");
const { verifyToken } = require("../valid_middle/jwt_middleware.js")

// // router.get("/likes", getAlllikes);
// // router.post("/likes", createlikes);

router.post("/comments",verifyToken, createcomment);
router.get("/comments/blog/:blogId", getCommentsTree);
router.get("/comments/:id/replies", getReplies);
router.put("/comments/:id", verifyToken, updateComment);
router.delete("/comments/:id",verifyToken, deleteComment);

module.exports = router;