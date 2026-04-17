const { array } = require("../config/multer");
const db = require("../models");

const createcomment = async (req, res) => {
    try {
        const { content, blogId, parentid } = req.body;
        // console.log(parentid)
        const userId = req.user.id;
        if (!content || !blogId) {
            return res.status(400).json({
                message: "content and blogId are required"
            });
        }
        const replycomment = await db.comments.findByPk(parentid)
        if (replycomment) {
            const comment = await db.comments.create({
                content,
                blogId,
                userId,
                // parentId: parentId || null
                parentid: parentid
            });
            const commentWithUser = await db.comments.findByPk(comment.id, {
                include: [{
                    model: db.User,
                    attributes: ['id', 'username', 'email']
                }]
            });
            const data = {
                id: commentWithUser.id,
                content: commentWithUser.content,
                blogId: commentWithUser.blogId,
                parentid: commentWithUser.parentid,
                createdAt: commentWithUser.createdAt,
                user: commentWithUser.User ? {
                    id: commentWithUser.User.id,
                    username: commentWithUser.User.username,
                    email: commentWithUser.User.email
                } : null,
                replies: []
            };
            return res.status(201).json({
                message: "Comment created successfully",
                data: data
            });
        }
        else {
            const comment = await db.comments.create({
                content,
                blogId,
                userId,
                // parentId: parentId || null
                parentid: null
            });
            const commentWithUser = await db.comments.findByPk(comment.id, {
                include: [{
                    model: db.User,
                    attributes: ['id', 'username', 'email']
                }]
            });            const data = {
                id: commentWithUser.id,
                content: commentWithUser.content,
                blogId: commentWithUser.blogId,
                parentid: commentWithUser.parentid,
                createdAt: commentWithUser.createdAt,
                user: commentWithUser.User ? {
                    id: commentWithUser.User.id,
                    username: commentWithUser.User.username,
                    email: commentWithUser.User.email
                } : null,
                replies: []
            };            return res.status(201).json({
                message: "Comment created successfully",
                data: commentWithUser
            });
        }

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

// const getCommentsTree = async (req, res) => {
//     try {
//         const { blogId } = req.params;
//         const comments = await db.comments.findAll({
//             where: { blogId, parentid: null },
//             include: [
//                 {
//                     model: db.comments,
//                     as: 'replies',
//                     include: [
//                         {
//                             model: db.comments,
//                             as: 'replies',
//                             include: [
//                                 {
//                                     model: db.comments,
//                                     as: 'replies',
//                                     include: [
//                                         {
//                                             model: db.comments,
//                                             as: 'replies',
//                                         }
//                                     ]
//                                 }
//                             ]
//                         }
//                     ]
//                 }
//             ],
//             order: [['createdAt', 'ASC']]
//         });

//         return res.status(200).json({
//             message: "Comments fetched successfully",
//             data: comments
//         });

//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// };


const getCommentsTree = async (req, res) => {
    try {
        const { blogId } = req.params;

        const comments = await db.comments.findAll({
            where: { blogId },
            include: [
                {
                    model: db.User,
                    attributes: ['id', 'username', 'email'],
                }
            ],
            // limit: 500,
            order: [['createdAt', 'ASC']],
        });

        const map = {};
        const roots = [];

        comments.forEach(c => {
            map[c.id] = {
                id: c.id,
                blogId: c.blogId,
                parentid: c.parentid,
                content: c.content,
                createdAt: c.createdAt,
                user: c.User
                    ? { id: c.User.id, username: c.User.username, email: c.User.email }
                    : null,
                replies: []
            };
        });

        comments.forEach(c => {
            if (c.parentid && map[c.parentid]) {
                map[c.parentid].replies.push(map[c.id]);
            } else {
                roots.push(map[c.id]);
            }
        });

        return res.status(200).json({
            message: "Comments fetched successfully",
            data: roots
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// try {
//     const { blogId } = req.params;
//     const comments = await db.comments.findAll({
//         where: { blogId }
//     });
//     // console.log(comments)
//     const map = {};
//     const roots = [];


//     comments.forEach(c => {
//         map[c.id] = { ...c.dataValues, replies: [] };
//     });

//     comments.forEach(c => {
//         if (c.parentid && map[c.parentid]) {
//             map[c.parentid].replies.push(map[c.id]);
//         } else {
//             roots.push(map[c.id]);
//         }
//     });
//     // console.log(roots)
//     return res.status(200).json({
//         message: "Comments fetched successfully",
//         data: roots
//     });
// } catch (error) {
//     return res.status(500).json({
//         message: "Server error",
//         error: error.message
//     });
// }
// };

const getReplies = async (req, res) => {
    try {
        const { id } = req.params;

        const replies = await db.comments.findAll({
            where: { parentid: id },
            include: [
                {
                    model: db.comments,
                    as: 'replies',
                }
            ]
        });
        return res.status(200).json({
            message: "Replies fetched successfully",
            data: replies
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.user.id;
        const comment = await db.comments.findByPk(commentId);
        // const replies = await db.comments.findAll({ where: { parentid: commentId } })
        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }
        if (comment.userId !== userId) {
            return res.status(403).json({
                message: "You are not allowed to delete this comment"
            });
        }


        await comment.destroy();
        await db.comments.destroy({
            where: { parentid: commentId }
        });


        return res.status(200).json({
            message: "Comment deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user.id;
        if (!content || content.trim() === "") {
            return res.status(400).json({
                message: "Content is required"
            });
        }

        const comment = await db.comments.findByPk(id);

        // console.log(userId);
        console.log(comment.userId)
        if (comment.userId !== userId) {
            return res.status(403).json({
                message: "You are not allowed to edit this comment"
            });
        }

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found"
            });
        }

        if (comment.userId !== req.user.id) {
            return res.status(403).json({
                message: "Not allowed to edit this comment"
            });
        }

        comment.content = content;
        await comment.save();

        return res.status(200).json({
            message: "Comment updated successfully",
            data: comment
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = { createcomment, getCommentsTree, getReplies, deleteComment, updateComment };

