const jwt = require("jsonwebtoken");
const authorModel = require("../models/authorModel");

const auth = async function(req, res, next) {
    let token = req.headers["x-Api-key"]
    if (!token) token = req.headers["x-api-key"]

    if (!token) { return res.status(400).send({ status: false, msg: "Token must be present in request headers" }) }

    try {
        let decodedToken = jwt.verify(token, "mahesh-rajat-blog")

    } catch (error) {
        return res.status(401).send({ status: false, msg: error.message })
    }

    authorId = req.params.authorId
    let details = await authorModel.findById(authorId)

    if (!details) {
        return res.status(401).send({ status: false, msg: "Author is not exist" })
    }

    next()
}



//<------------------------Authorization to user to only its own data----------------------->


const authorisation = async function(req, res, next) {

    let token = req.headers["x-Api-key"];
    if (!token) token = req.headers["x-api-key"];
    console.log(token)
    try {
        let decodedToken = jwt.verify(token, "mahesh-rajat-blog");
        console.log(decodedToken)
    } catch (error) {
        return res.status(500).send({ status: false, msg: "Token is Invalid" })
    }
    //userId for which the request is made. In this case message to be posted.
    let decodedToken = jwt.verify(token, "mahesh-rajat-blog");
    let authorId = req.params.authorId
        //userId for the logged-in user
    let authorLoggedIn = decodedToken.authorId

    //userId comparision to check if the logged-in user is requesting for their own data
    if (authorId != authorLoggedIn) {
        return res.send({ status: false, msg: 'Access is Denied' })
    }

    next()
}

module.exports.auth = auth
module.exports.authorisation = authorisation