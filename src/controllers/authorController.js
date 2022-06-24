const authorModel = require("../models/authorModel")
const validator = require('validator');
const jwt = require('jsonwebtoken')

const createAuthor = async function(req, res) {
    try {

        const { fname, lname, title, emailId, password } = req.body

        if (!(fname && lname && title && emailId && password)) {
            return res.status(400).send({ status: false, msg: "Please enter all the details." })
        }

        if (typeof(fname) !== "string" || !validator.isAlpha(fname)) {
            return res.status(400).send({ status: false, msg: "First name is not valid" })
        }
        if (typeof(lname) !== "string" || !validator.isAlpha(lname)) {
            return res.status(400).send({ status: false, msg: "Last name is not valid" })
        }

        if ((title != 'Mr') && (title != 'Mrs') && (title != 'Miss')) {
            return res.status(400).send({ status: false, msg: "Please enter the correct title (Mr, Mrs, Miss)" })
        }

        if (typeof(emailId) !== "string" || !validator.isEmail(emailId)) {
            return res.status(400).send({ status: false, mgs: "Email Id is in incorrect format." })
        }

        let duplicate = await authorModel.findOne({ emailId: emailId })
        if (duplicate) {
            return res.status(400).send({ status: false, msg: "Email Id is already registered." })
        }

        if (typeof(password) !== "string") {
            return res.status(400).send({ status: false, msg: "Password is not in correct format" })
        }

        if (!validator.isStrongPassword(password)) {
            return res.status(400).send({ status: false, msg: "Kindly use atleast one uppercase alphabets, numbers and special characters for strong password." })
        }

        let duplicatePassword = await authorModel.findOne({ password: password })
        if (duplicatePassword) {
            return res.status(400).send({ status: false, msg: "Password is very common, try to use different password." })
        }

        let saveData = await authorModel.create(data)

        if (!saveData) {
            return res.status(400).send({ status: false, msg: "Data is not created" })
        }

        res.status(201).send({ status: true, data: saveData })

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

const login = async(req, res) => {
    try {
        let username = req.body.emailId
        let password = req.body.password
       

        if (!username || !password) {
            return res.status(400).send({ status: false, msg: "Please Enter email id and password both." })
        }
        let author = await authorModel.findOne({ emailId: username }).select({ emailId: 1, password: 1 })
        let authorEmailId = author.emailId
        let authorPassword = author.password
        
        if (!authorEmailId) {
            return res.status(404).send({ status: false, msg: "Please enter correct email." })
        }

        if (password !== authorPassword) {
            return res.status(400).send({ status: false, msg: "Email Id and password are not matched, Please enter correct password." })
        }

        let token = jwt.sign({ authorId: authorEmailId._id.toString(), batch: "Radon" }, //payload
            "mahesh-rajat-blog" //secret key
        );
        res.setHeader("x-api-key", token)
        res.status(200).send({ status: true, data: token })

    } catch (error) {
        console.log(error.data)
        res.status(500).send({ status: false, msg: error.message })
    }
}


module.exports.createAuthor = createAuthor
module.exports.login = login