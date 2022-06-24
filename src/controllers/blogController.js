const { count } = require("console")
const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel")
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')


//<--------------------------------------------Creating Blog------------------------------------------------->

const createBlog = async function(req, res) {
    try {
        let data = req.body
        let authorId = req.body.authorId
        const { title, body, tags, category, subCategory } = data
        let a = await authorModel.findById(authorId).select({ _id: 1 })
        console.log(a)

        if ((data.authorId) == null) {
            return res.status(400).send({ status: false, msg: "Invalid Request" })
        }

        if (typeof(title) !== `string`) {
            return res.status(400).send({ status: false, msg: "Title is not valid" })
        }
        if (typeof(body) !== `string`) {
            return res.status(400).send({ status: false, msg: "Body is not valid" })
        }

        if (!mongoose.Types.ObjectId.isValid(authorId)) {
            return res.status(404).send({ status: false, msg: "Author ID is not valid." })
        }

        if (typeof(tags) !== `object`) {
            return res.status(400).send({ status: false, msg: "Tags are not valid" })
        }
        if (typeof(category) !== 'string') {
            return res.status(400).send({ status: false, msg: "Category is not valid" })
        }
        if (typeof(subCategory) !== `object`) {
            return res.status(400).send({ status: false, msg: "Sub-Category is not valid" })
        }

        if (a == null) {
            return res.status(400).send({ status: false, msg: "Author ID doesn't exist's." })
        }


        // The blog is created. 

        let saveData = await blogModel.create(data)
        return res.status(201).send({ status: true, data: saveData })

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}


//<--------------------------------------------Update Blog------------------------------------------------->

const updateBlog = async function(req, res) {

    let data = req.params.blogId
    const { title, body, tags, subCategory } = req.body

    // Edge Case 1 :- If the blog Id entered by user is not valid.

    if (!mongoose.Types.ObjectId.isValid(data)) {
        return res.status(404).send({ status: false, msg: "Blog ID is not valid." })
    }

    let b = await blogModel.findById(data).select({ _id: 1, isDeleted: 1 })

    // Edge Case 2 :- If the blog Id entered by user is not exists.

    if (b == null) {
        return res.status(400).send({ status: false, msg: "Blog document doesn't exists." })
    }

    // Blog document successfully updated

    let result = await blogModel.findOneAndUpdate({ _id: data }, {
        title: title,
        body: body,
        $addToSet: { tags: tags, subCategory: subCategory }, //$addToSet :- is basically used to add any element in the array type only for one time
        //$push is used as we can add elemetents in the array for multiple number of times.
        isPublished: true,
        publishedAt: Date.now()
    }, { new: true })

    return res.status(200).send({ status: true, data: result })

}


//<--------------------------------------Delete Blog by Path Parameters---------------------------------------->

const deleteBlogByParams = async function(req, res) {
    try {
        let data = req.params.blogId

        // Edge Case 1 :- If the blog Id entered by user is not valid.

        if (!mongoose.Types.ObjectId.isValid(data)) {
            return res.status(404).send({ status: false, msg: "Blog ID is not valid." })
        }

        let b = await blogModel.findById(data).select({ _id: 1, isDeleted: 1 })

        // Edge Case 2 :- If the blog Id entered by user is not exists.

        if (b == null) {
            return res.status(400).send({ status: false, msg: "Blog document doesn't exists." })
        }

        // Edge Case 3 :- If the blog Id entered by user is already deleted.

        if (b.isDeleted == true) {
            return res.status(400).send({ status: false, msg: "Blog already deleted" })
        }

        // Blog document successfully deleted.

        let a = await blogModel.updateOne({ _id: data, isDeleted: false }, { isDeleted: true, deletedAt: Date.now() })
        return res.status(200).send({ status: true, data: a })

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}


//<--------------------------------------------Delete Blog by Query Parameters------------------------------------------------->

const deleteBlogByQuery = async function(req, res) {
    const { category, authorId, isPublished, tags, subCategory } = req.query

    if (!(category || authorId || isPublished || tags || subCategory)) {
        return res.status(400).send({ status: false, msg: "Kindly enter any value" })
    }

    if (!mongoose.Types.ObjectId.isValid(authorId)) {
        return res.status(404).send({ status: false, msg: "Blog ID is not valid." })
    }

    let b = await blogModel.findById(authorId).select({ _id: 1, isDeleted: 1 })

    if (b == null) {
        return res.status(400).send({ status: false, msg: "Blog document doesn't exists." })
    }

    // if (b.isDeleted == true) {
    //     return res.status(400).send({ status: false, msg: "Blog already deleted" })
    // }


    const d = await blogModel.updateMany({
        $or: [{ category: category },
            { authorId: authorId },
            { tags: { $in: [tags] } },
            { subCategory: { $in: [subCategory] } }
        ]
    }, { isDeleted: true, deletedAt: Date.now() })

    return res.status(200).send({ status: true, data: d })
}




module.exports.createBlog = createBlog
module.exports.updateBlog = updateBlog
module.exports.deleteBlogByParams = deleteBlogByParams
module.exports.deleteBlogByQuery = deleteBlogByQuery