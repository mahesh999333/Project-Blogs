const authorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken")
const createAuthor = async function(req, res) {
    try {
        let data = req.body
        const { fname, lname, title, emailId, password } = data

        if (!(fname && lname && title && emailId && password)) {
            return res.status(400).send({ status: false, msg: "Please enter all the details." })
        }
        let duplicate = await authorModel.findOne({ emailId: data.emailId })

        if (duplicate) {
            res.status(400).send({ status: false, msg: "Email Id is already registered." })
        }

        if ((title != 'Mr') && (title != 'Mrs') && (title != 'Miss')) {
            return res.status(400).send({ status: false, msg: "Please enter the correct title (Mr, Mrs, Miss)" })
        }

        if (typeof(fname) !== 'string') {
            return res.status(400).send({ status: false, msg: "First name is not valid" })
        }
        if (typeof(lname) !== 'string') {
            return res.status(400).send({ status: false, msg: "Last name is not valid" })
        }
        if (typeof(emailId) !== 'string') {
            return res.status(400).send({ status: false, msg: "Email is not valid" })
        }
        if (typeof(password) !== 'string') {
            return res.status(400).send({ status: false, msg: "Password is not valid" })
        }

        let saveData = await authorModel.create(data)

        if (!saveData) {
            return res.status(400).send({ status: false, msg: "Data is not created" })
        }

        res.status(201).send({ status: true, data: saveData })

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

const login = async(req, res) => {
    try {
        let username = req.body.emailId
        let password = req.body.password
        
        
        if(!username || !password){
            return res.status(400).send({status:false, msg:"Please Enter email id and password both."})
        }
        let authorEmailId = await authorModel.findOne({ emailId: username }).select({ emailId: 1 })
        let authorPassword = await authorModel.findOne({ emailId: username }).select({ password: 1 }) // storing password as well as _id
        
        
        if(!authorEmailId){
            return res.status(404).send({status:false, msg:"Please enter correct email."})
        }
        

        if (password !== authorPassword.password) {
            return res.status(400).send({ status: false, msg: "Email Id and password are not matched, Please enter correct password." })
        }

        let token = jwt.sign({ authorId: authorEmailId._id.toString(), batch: "Radon" }, //payload
            "mahesh-rajat-blog" //secret key
        );
        res.setHeader("x-api-key", token)
        res.status(201).send({ status: true, data: token })

    } catch (error) {
        console.log(error.data)
        res.status(500).send({ status: false, msg: error.message })
    }
}


module.exports.createAuthor = createAuthor
module.exports.login = login