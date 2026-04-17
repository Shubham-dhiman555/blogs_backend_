const db = require("../models");
const fs = require('fs');
const path = require('path');

const postblog = async (req, res) => {
  try {
    const { title, slug, content, categoryId, view } = req.body;

    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    const userId = req.user.id;


    const image = req.files && req.files.length > 0
      ? req.files.map(file => ({ path: file.path.replace(/\\/g, '/') }))
      : null;

    const blog = await db.blog.create({
      title,
      slug,
      content,
      image,
      userId,
      categoryId: parseInt(categoryId),
      view
    });

    return res.status(201).json(blog);
  } catch (error) {
    console.error("FULL ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
};

const getAllblogs = async (req, res) => {
  try {
    const Blogs = await db.blog.findAll(
      {
        include: [
          db.User,      // associated User
          db.categories,  // associated Category (not categories)
          db.likes      // associated Like (not likes)
        ]
      }
    );
    if (Blogs.length == 0) {
      return res.status(404).json({ error: "No blog found" });
    }
    return res.status(200).json(Blogs);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const getblogById = async (req, res) => {
  try {
    const blog = await db.blog.findByPk(req.params.id, {
      include: [
        // {
        //   model: db.User,
        //   attributes: ["id", "username"]
        // },
        {
          model: db.likes,
          attributes: ["id", "userId"]
        },
        {
          //  "parentId"
          model: db.comments,
          attributes: ["id", "content", "userId"],
          include: [
            {
              model: db.User,
              attributes: ["id", "username"]
            }
          ]
        }
      ]
    });



    if (!blog) {
      return res.status(404).json({ error: "blog not found" });
    }

    // const viewerId = req.user?.id;

    // if (viewerId && viewerId !== blog.userId) {
    //   blog.view += 1;
    //   await blog.save();
    // }

    // console.log(blog.likes.length)

    return res.status(200).json({
      // ...blog.toJSON(),
      blog,
      totalLikes: blog.likes.length
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await db.blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const { title, slug, content, userId, categoryId, view } = req.body;

    if (!title || title.trim().length < 3) {
      return res.status(400).json({
        message: "Title must be at least 3 characters long"
      });
    }

    if (!content || content.trim().length < 10) {
      return res.status(400).json({
        message: "Content must be at least 10 characters long"
      });
    }

    let images = blog.image || [];
    console.log("RAW image from DB:", JSON.stringify(images));

    if (req.files && req.files.length > 0) {

      // ["uploads/xxx.jpg"]
      if (images.length > 0) {
        images.forEach(img => {
          try {
            //handles all 3 formats
            const imagePath = typeof img === "string" ? img : img.path || img.url;

            if (!imagePath) {
              console.log("Skipping undefined image path");
              return;
            }

            const normalizedPath = imagePath.replace(/\\/g, '/'); //  fix backslashes
            // console.log("normalizedPath",normalizedPath)
            const fullPath = path.resolve(normalizedPath);
            // console.log(fullPath)

            if (fs.existsSync(fullPath)) {
              fs.unlinkSync(fullPath);
              console.log(` Deleted: ${normalizedPath}`);
            } else {
              console.log(` Not found, skipping: ${normalizedPath}`);
            }
          } catch (err) {
            console.log(` Failed to delete image:`, err.message);
          }
        });
      }

   // [{ path: "uploads/xxx.jpg" }]
      images = req.files.map(file => ({
        path: file.path.replace(/\\/g, '/')
      }));

      console.log(" New images saved:", images);
    }

    await blog.update({
      title,
      slug,
      content,
      userId,
      categoryId,
      view,
      image: images
    });

    res.status(200).json({
      message: "Blog updated successfully",
      data: blog
    });

  } catch (error) {
    console.error(" Update blog error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteblog = async (req, res) => {
  try {
    const blog = await db.blog.findByPk(req.params.id);
    const comment = await db.comments.findOne({ where: { blogId: req.params.id } })
    // const userId=req.user.id;
    if (!blog) {
      return res.status(404).json({ error: "blog not found" });
    }
    await blog.destroy();
    await comment.destroy()

    return res.status(200).json({ message: "blog deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

const getBlogUser = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await db.blog.findOne({
      where: { id },
      include: [
        {
          model: db.User,
          attributes: ['id', 'username', 'email']
        }
      ]
    });
    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }
    res.status(200).json({
      user: blog.User
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const getBlogCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.blog.findOne({
      where: { id },
      include: [
        {
          model: db.categories,
          attributes: ['id', 'name'] // only what you need
        }
      ]
    });

    if (!result) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    res.status(200).json({
      category: result.category
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

const getblogcomments = async (req, res) => {
  try {
    const { id } = req.params;
    const existingBlog = await db.blog.findByPk(id);
    if (!existingBlog) {
      return res.status(404).json({
        message: 'Blog not found'
      });
    }

    const blogComments = await db.comments.findAll({
      where: { blogId: id },
      include: [
        {
          model: db.User,
          attributes: ['id', 'username', 'email']
        }
      ]
    });
    res.status(200).json({
      message: 'Blog comments fetched successfully',
      totalcomments: blogComments.length,
      data: blogComments
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = { postblog, getAllblogs, getblogById, updateBlog, deleteblog, getBlogUser, getBlogCategory, getblogcomments };










