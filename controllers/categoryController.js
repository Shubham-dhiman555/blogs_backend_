const db = require("../models");

const createcategory = async (req, res) => {
    try {
        const { name, slug } = req.body;
        const category = await db.categories.create({ name, slug });
        return res.status(201).json(category);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const getAllCategories = async (req, res) => {
    try {
        const categories = await db.categories.findAll(
            {
                include: [db.blog]
            })
        if (categories.length == 0) {
            return res.status(404).json({ error: "No users found" });
        }
        return res.status(200).json(categories);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Category ID is required" });
        }
        const category = await db.categories.findByPk(id);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        return res.status(200).json({
            message: "Category fetched successfully",
            data: category
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getBlogsByCategory = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(id)
        const category = await db.categories.findByPk(id, {
            include:
                [{ model: db.blog }]
        }
        );
        // console.log(category)
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({
            message: "Blogs fetched successfully",
            data: category
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const updateCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Category ID is required" });
        }
        const category = await db.categories.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        const { name, slug } = req.body;
        await db.categories.update({
            name: name,
            slug: slug
        },
            {
                where: { id: id }
            }
        )
        return res.status(200).json({
            message: "Category updated sucessfully",
            // data: category
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const deletecategory = async (req, res) => {
    try {
        const category = await db.categories.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ error: "category not found" });
        }
        await category.destroy();
        return res.status(200).json({ message: "category deleted" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { getAllCategories, createcategory, getBlogsByCategory, getCategoryById, updateCategoryById, deletecategory }