const jwt = require("jsonwebtoken")
// define a function that gets executed as a middleware check
// this will verify the token sent as part of the req from the frontend
module.exports = (req, res, next) => {
    // "Bearer asgaskh3563teglkj#@%#$^"
    // second string is the token
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log("HERE" + token);
        // the decoded token has the user id and email
        // const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id},
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        // this userData will be used to bind the post creator and logged
        // in user, create the userData field which has these values
        req.userData = {email: decodedToken.email, userId: decodedToken.userId}
        next();
    } catch (error) {
        console.log("HERE1");
        res.status(401).json({ message: "Authentication Failed"});
    }
}