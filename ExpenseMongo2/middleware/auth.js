const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = (req,res,next) => {
    try {
        const token = req.header('Authorization');  
        console.log(token);
        const user = jwt.verify(token, process.env.JWT_token); // decrypt userId
        // console.log(user);
        console.log('userId >>>>>>', user.userId);
        User.findById(user.userId)
        .then(user => {
            console.log(JSON.stringify(user));
            req.user = user;    /// Very Very Important
            next();
        })
        .catch(err =>  { throw new Error(err)})
    }
    catch(err) {
        console.log(err);
        return res.status(401).json({success: false})
    }
}

module.exports = {
    authenticate
}