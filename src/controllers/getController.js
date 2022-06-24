const blogModel = require("../models/blogModel")

const blogs = async(req, res) => {
    try {

        let { authorId, category, tags, subCategory } = req.query

        if (!(authorId || category || tags || subCategory)) {
            return res.status(400).send({ status: false, msg: "Kindly enter any value" })
        }

        let final = await blogModel.find({
            $or: [{ authorId: authorId }, { category: category }, {
                tags: { $in: tags },
                subCategory: { $in: subCategory }
            }],
            isDeleted: false,
            isPublished: true
        })
        if (final) {
            return res.status(200).send({ status: true, data: final })
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