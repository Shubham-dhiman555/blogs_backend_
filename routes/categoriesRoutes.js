const express = require("express");
const router = express.Router();

const { getAllCategories, createcategory, getBlogsByCategory, getCategoryById, updateCategoryById, deletecategory } = require("../controllers/categoryController.js");

router.get("/categories", getAllCategories)
router.get("/categories/:id", getCategoryById)
router.get("//categories/:id/blogs", getBlogsByCategory)
router.post("/categories", createcategory)
router.put("/categories/:id", updateCategoryById)
router.delete("/categories/:id", deletecategory)
module.exports = router;