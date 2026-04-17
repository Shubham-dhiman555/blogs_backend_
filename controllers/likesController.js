const db = require("../models");

// const getAlllikes = async (req, res) => {
//     try {
//         const likes = await db.likes.findAll(
//             {
//                 include: [
//                     db.User,      // associated User 
//                 ]
//             }
//         );
//         if (likes.length == 0) {
//             return res.status(404).json({ error: "No likes" });
//         }
//         return res.status(200).json(likes);
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// }


// const createlikes = async (req, res) => {
//     try {
//         const { userId, blogId } = req.body;
//         const likes = await db.likes.create({ userId, blogId });
//         return res.status(201).json(likes);
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// }



// check

// const likeBlog = async (req, res) => {
//     try {
//         const userId = req.user.id;     // from token
//         const blogId = req.params.id;   // from URL

//         const data = await db.likes.findOne({
//             where: {
//                 userId: userId,
//                 blogId: blogId
//             }
//         });

//         if (data) {
//             return res.status(400).json({
//                 message: "You already liked this blog"
//             });
//         }

//         const newLike = await db.likes.create({
//             userId: userId,
//             blogId: blogId
//         });

//         res.status(201).json({
//             message: "Blog liked",
//             data: newLike
//         });

//     } catch (error) {
//         res.status(500).json({
//             message: "Server error",
//             error: error.message
//         });
//     }
// };

// const unlikeBlog = async (req, res) => {
//     try {
//         const userId = req.user.id;      // get from payload from token.
//         const blogId = req.params.id;    // blog id from URL
//         // console.log(userId)
//         // console.log(blogId)
   
//         const like = await db.likes.findOne({
//             where: { userId, blogId }
//         });

//         if (!like) {
//             return res.status(404).json({
//                 message: "You have not liked this blog"
//             });
//         }

//         await like.destroy();

//         res.status(200).json({
//             message: "Blog unliked successfully"
//         });

//     } catch (error) {
//         res.status(500).json({
//             message: "Server error",
//             error: error.message
//         });
//     }
// };


const Likeandunlike = async (req, res) => {
    try {
        const userId = req.user.id;
        const blogId = req.params.id;

        const existingLike = await db.likes.findOne({
            where: { userId, blogId }
        });
        if (existingLike) {
            await existingLike.destroy();

            return res.status(200).json({
                message: "Blog unliked successfully",
                liked: false
            });
        }
        const newLike = await db.likes.create({
            userId,
            blogId
        });

        return res.status(201).json({
            message: "Blog liked",
            liked: true,
            data: newLike
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getBlogLikes = async (req, res) => {
    try {
        const blogId = req.params.id;

        const allLikes = await db.likes.findAll({
            where: { blogId },
            include: [
                {
                    model: db.User,
                    attributes: ['id', 'username']
                }
            ]
        });

        const count = allLikes.length;
        const users = allLikes.map(like => like.User);
        res.status(200).json({
            blogId,
            totalLikes: count,
            users
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// const getUserLikes = async (req, res) => {
//     try {
//         const userId = req.params.id;

//         const userLikes = await db.likes.findAll({
//             where: { userId },
//             include: [
//                 {
//                     model: db.blog,
//                     attributes: ['id', 'title', 'slug', 'createdAt']
//                 }
//             ]
//         });

//         if (userLikes.length === 0) {
//             return res.status(404).json({
//                 message: "User has not liked any blogs"
//             });
//         }

//         const likedBlogs = userLikes.map(like => like.blog);
//         res.status(200).json({
//             userId,
//             totalLiked: likedBlogs.length,
//             blogs: likedBlogs
//         });

//     } catch (error) {
//         res.status(500).json({
//             message: "Server error",
//             error: error.message
//         });
//     }
// };
                          // getUserLikes
module.exports = { getBlogLikes,Likeandunlike };

                // likeBlog, unlikeBlog,