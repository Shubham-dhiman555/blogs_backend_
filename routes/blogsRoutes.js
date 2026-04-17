const express = require("express");
const router = express.Router();
const { getAllblogs, postblog, getblogById, updateBlog, deleteblog, getBlogLikes, getBlogUser, getBlogCategory, getblogcomments } = require("../controllers/blogsController.js");
// ,postcomments
const upload = require('../config/multer');
const { verifyToken } = require("../valid_middle/jwt_middleware.js")
const { createBlogValidator, validateBlogId } = require("../valid_middle/blogs_validator.js")

router.post("/blogs", verifyToken, upload.array('image', 10), createBlogValidator, postblog);
router.get("/blogs", getAllblogs);
router.get("/blogs/:id", validateBlogId, getblogById);
router.delete("/blogs/:id", verifyToken, deleteblog);
router.put("/blogs/:id",upload.array('image', 10), verifyToken, updateBlog);
// router.get("/blogs/:id/likes", getBlogLikes);
router.get("/blogs/:id/user", getBlogUser);
router.get("/blogs/:id/category", getBlogCategory);
router.get("/blogs/:id/comments", getblogcomments);


// router.post("/comments/:id/blogs",verifyToken,postcomments);


module.exports = router;