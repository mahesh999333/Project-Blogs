const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController')
const blogController = require('../controllers/blogController.js')
const getController = require('../controllers/getController.js')
const middlewareAuth = require('../middleware/middleware.js')

//Create Author
router.post("/author", authorController.createAuthor)


//Author Login
router.post("/login", authorController.login)


//Create Blog
router.post("/blogs", blogController.createBlog)


//Get Blogs (With Authentication)
router.get("/blogs", middlewareAuth.auth, getController.blogs)


//Update Blogs (With Authentication and Authorization)
router.put("/blogs/:blogId/:authorId", middlewareAuth.auth, middlewareAuth.authorisation, blogController.updateBlog)


//Delete Blogs By Path Parameters (With Authentication and Authorization)
router.delete("/blogs/:blogId", middlewareAuth.auth, middlewareAuth.authorisation, blogController.deleteBlogByParams)


//Delete Blogs By Query Parameters (With Authentication and Authorization)
router.delete("/blogs", blogController.deleteBlogByQuery)






router.post("/login/:authorId", middlewareAuth.auth)
router.post("/m/:authorId", middlewareAuth.authorisation)

module.exports = router;