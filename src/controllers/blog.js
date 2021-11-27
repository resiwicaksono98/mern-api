const { validationResult } = require('express-validator')
const path = require('path')
const fs = require('fs')
const BlogPost = require('../models/blog')

exports.createBlogPost = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const err = new Error('Invalid Value')
        err.errorStatus = 400;
        err.data = errors.array()
        throw err;
    }

    if (!req.file) {
        const err = new Error('Image Harus Di Upload')
        err.errorStatus = 422;
        throw err;
    }

    const title = req.body.title
    const body = req.body.body
    const image = req.file.path

    const Posting = new BlogPost({
        title: title,
        body: body,
        image: image,
        author: {
            uid: 1,
            name: 'Resi Wicaksono'
        }
    })

    Posting.save()
        .then(result => {
            res.status(201).json({
                message: "Create Blog Post Succcess",
                data: result
            })
        })
        .catch(err => {
            console.log('err: ', err)
        });


}

exports.getAllBlogPost = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = req.query.perPage || 4;
    let totalItems;

    BlogPost.find().countDocuments()
    .then(count => {
        totalItems = count;
        return BlogPost.find()
        .skip((parseInt(currentPage) - 1) * parseInt(perPage))
        .limit(parseInt(perPage))
    })
    .then(result => {
        res.status(200).json({
            message: 'Data Blog Post Berhasil Di Panggil',
            data: result,
            total_data : totalItems,
            per_page: parseInt(perPage),
            current_page: parseInt(currentPage)
        })
    })
    .catch(err => {
        next(err)
    })
}

exports.getBlogPostById = (req, res, next) => {
    const postId = req.params.postId
    BlogPost.findById(postId)
        .then(result => {
            if (!result) {
                const error = new Error('Blog tidak ditemukan')
                error.errorStatus = 404
                throw error;
            }
            res.status(200).json({
                message: 'Data Blog Berhasil Di Panggil',
                data: result
            })
        })
        .catch(err => {
            next(err)
        })
}

exports.updateBlogPost = (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const err = new Error('Invalid Value ')
        err.errorStatus = 400;
        err.data = errors.array()
        throw err;
    }

    if (!req.file) {
        const err = new Error('Image Harus Di Upload')
        err.errorStatus = 422;
        throw err;
    }

    const title = req.body.title
    const body = req.body.body
    const image = req.file.path
    const postId = req.params.postId

    BlogPost.findById(postId)
        .then(post => {
            if (!post) {
                const err = new Error('Blog Post Tidak Ditemukan')
                err.errorStatus = 404;
                throw err;
            }

            post.title = title;
            post.body = body;
            post.image = image;

            return post.save();
        })
        .then(result => {
            res.status(200).json({
                message: 'Update Blog Success',
                data: result
            })
        })
        .catch(err => {
            next(err)
        })

    const Posting = new BlogPost({
        title: title,
        body: body,
        image: image,
        author: {
            uid: 1,
            name: 'Resi Wicaksono'
        }
    })


}

exports.deleteBlogPost = (req, res, next) => {
    const postId = req.params.postId

    BlogPost.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Blog Post Tidak Ditemukan')
                error.errorStatus = 404;
                throw error;
            }

            removeImage(post.image)
            return BlogPost.findByIdAndRemove(postId)
        })
        .then(result => {
            res.status(200).json({
                message: 'Hapus Blog Post Berhasil',
                data: result
            })

        })
        .catch(err => {
            next(err)
        })
}

const removeImage = (filePath) => {
    console.log('filePath', filePath)
    console.log('dir name', __dirname)

    filePath = path.join(__dirname, '../..', filePath)
    fs.unlink(filePath, err => console.log(err))
}