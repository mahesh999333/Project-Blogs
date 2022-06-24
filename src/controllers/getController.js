const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel")


const blogs = async(req, res) => {
    try {

        let result = {}
        let { authorId, category, tags, subCategory } = req.query

        if (!(authorId || category || tags || subCategory)) {
            return res.status(400).send({ status: false, msg: "Kindly enter any value" })
        }

        if (authorId != undefined)
            result.authorId = authorId
        if (category != undefined)
            result.category = category
        if (tags != undefined)
            result.tags = tags
        if (subCategory != undefined)
            result.subCategory = subCategory
        try {
            console.log(result)
            let final = await blogModel.find({
                $and: [{ authorId: authorId }, { category: category }, {
                    tags: { $in: tags },
                    subCategory: { $in: subCategory }
                }],
                isDeleted: false,
                isPublished: true
            })

            console.log(final)

            return res.status(200).send({ status: true, data: final })

        } catch (error) {
            res.status(500).send({ status: false, msg: error.message })
        }

        let blog = await blogModel.find({
            isDeleted: false,
            isPublished: true
        })
        if (blog === null) {
            return res.status(404).send({ status: false, msg: "Document Not Found" })
        }

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports.blogs = blogs