const express = require('express')
const { body } = require('express-validator')

const router = express.Router()

const blogController = require('../controllers/blog')

// Router Create Post Blog
router.post('/post', [
    body('title').isLength({ min: 5 }).withMessage('Input title tidak sesuai'),
    body('body').isLength({ min: 5 }).withMessage('Input body tidak sesuai')
],
    blogController.createBlogPost)

// Route Get All Post
router.get('/posts', blogController.getAllBlogPost)

// Route Get Post By Id
router.get('/post/:postId', blogController.getBlogPostById)

// Route Update Post Blog
router.put('/post/:postId', [
    body('title').isLength({ min: 5 }).withMessage('Input title tidak sesuai'),
    body('body').isLength({ min: 5 }).withMessage('Input body tidak sesuai')
], blogController.updateBlogPost)

// Route Delete Post
router.delete('/post/:postId', blogController.deleteBlogPost)

module.exports = router