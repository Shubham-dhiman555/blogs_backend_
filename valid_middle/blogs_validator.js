
// const createBlogValidator = (req, res, next) => {
//     const { title, slug, content, userId, categoryId, view } = req.body;
//     const errors = [];
//     //title
//     if (!title || typeof title !== 'string') {
//         errors.push({ field: 'title', message: 'Title is required and must be a string' });
//     } 

//     //slug
//     if (!slug || typeof slug !== 'string') {
//         errors.push({ fields: 'slug', message: 'Slug is required' });
//     }
//     const slugRegex = /^[a-z0-9-]+$/;
//     if (!slugRegex.test(slug)) {
//         errors.push({ fields: 'slug', message: 'Slug must contain only lowercase letters, numbers, and hyphens' });
//     }

//     //content
//     if (!content || typeof content !== 'string') {
//         errors.push({ fields: 'content', message: 'Content is required' });
//     }
//     else if (content.length < 10) {
//         errors.push({ field: 'content', message: 'Content must be at least 10 characters' });
//     }

//     //userId    //here i make correction
//     // if (userId !=req.user.id) {
//     //     errors.push({ field: 'userId', message: 'user does not exist' });
//     // }

//     //categoryId
//     if (!categoryId || isNaN(categoryId) || categoryId < 1) {
//         errors.push({ field: 'categoryId', message: 'category ID is required and must be a positive integer' });
//     }
//     if (errors.length > 0) {
//         return res.status(400).json({ errors });
//     }
//     next();
// };

const createBlogValidator = (req, res, next) => {
    const { title, slug, content, userId, categoryId, view } = req.body;
    const errors = [];

    // title
    if (!title || typeof title !== 'string') {
        errors.push({ field: 'title', message: 'Title is required and must be a string' });
    }

    // slug
    if (!slug || typeof slug !== 'string') {
        errors.push({ field: 'slug', message: 'Slug is required' }); 
    }
    const slugRegex = /^[a-z0-9-]+$/;
    if (slug && !slugRegex.test(slug)) { 
        errors.push({ field: 'slug', message: 'Slug must contain only lowercase letters, numbers, and hyphens' }); 
    }

    // content
    if (!content || typeof content !== 'string') {
        errors.push({ field: 'content', message: 'Content is required' }); 
    } else if (content.length < 10) {
        errors.push({ field: 'content', message: 'Content must be at least 10 characters' });
    }

    // categoryId
    if (!categoryId || isNaN(categoryId) || categoryId < 1) {
        errors.push({ field: 'categoryId', message: 'Category ID is required and must be a positive integer' });
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    next();
};


const validateBlogId = (req, res, next) => {
    const id = req.params.id;
    if (!id || isNaN(id) || parseInt(id) < 1) {
        return res.status(400).json({ error: 'Invalid blog ID. It must be a positive integer.' });
    }
    next();
};


module.exports = { createBlogValidator, validateBlogId }