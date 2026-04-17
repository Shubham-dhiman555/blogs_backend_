const express = require("express");
const router = express.Router();
const { getUsersById, registerUser, loginUser, getuserblog,blogsLikeByUser,getCurrentUser } = require("../controllers/userController");
const { validateCreateUser, validateUserId, validateloginuser } = require("../valid_middle/user_validator")
const { verifyToken } = require("../valid_middle/jwt_middleware.js")

router.post("/users/register", validateCreateUser, registerUser);
router.post("/users/login", validateloginuser, loginUser);
router.get("/users/me",verifyToken, getCurrentUser);
router.get("/users/me/blogs", verifyToken, getuserblog);
router.get("/users/me/likes",verifyToken,blogsLikeByUser);
router.get("/users/:id", verifyToken, getUsersById); //we can get other user by id.
// router.get("/users/:id/like", getUserLikes);

// router.get("/users/alluser",verifyToken, getAllUsers);
// router.delete("/users/:id",validateUserId,deleteUser);
// router.put("/users/:id",validateUserId,updateUser);

module.exports = router;