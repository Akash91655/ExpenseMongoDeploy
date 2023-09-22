const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function isStringInvalid(string) {
    if(string == undefined || string.length === 0) {
        return true;
    }
    else {
        return false;
    }
}

exports.postUserSignup = async (req,res,next) => {
    // if(!req.body.email) {
    //     throw new Error('Email is mandatory')
    // }
    console.log('Reached /user/signup route')
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        const users = await User.find();
        for(let i=0;i<users.length;i++){
            if(users[i].email==email){
                return res.status(400).json({message:"User Already Exist!",success:false});
            }
        }

        if(isStringInvalid(name) || isStringInvalid(email || isStringInvalid(password)))
        {
            return res.status(400).json({ err : "Field should not be empty"})
        }

        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            // console.log(err);
            const newUser = new User({name:name,email:email,password:hash});
            newUser.save();
            res.status(201).json({message: 'Successfully created new user'})
        })

        // const newUser = await User.create({
        //     name: name,
        //     email: email,
        //     password: password
        // })
        
        // res.status(201).json({message: 'Successfully created new user'})
    }
    
    catch(err) {
        res.status(500).json({message:err,success:false})
    }
        // res.status(201).redirect('/login/login.html')
}

function generateAccessToken(id, name, ispremiumuser){
    return jwt.sign({ userId: id, name: name, ispremiumuser: ispremiumuser} , process.env.JWT_token);
}

exports.postUserLogin = async(req,res,next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if(isStringInvalid(email)||isStringInvalid(password)) {
                return res.status(400).json({success: false, message: 'Email ID or Password is missing'})
        }

        const response = await User.findOne({ email })
        // if(response.length > 0) {
        if(response) {
            bcrypt.compare(password, response.password, (err, result)  => {
                if(err) {
                    // res.status(500).json({success: false, message: 'Something went wrong'})
                    throw new Error('Something went wrong');
                }
                if(result === true) {
                    res.status(200).json({success: true, message: 'User login successful', token: generateAccessToken(response._id, response.name, response.isPremium)})
                    console.log("User login successful")
                }
                else {
                    res.status(401).json({success: false, message: 'User not authorized'})
                    console.log("User not authorized")
                }
            })
        }
        else {
            res.status(404).json({success: false, message: 'User not found'})
            console.log("User not found")
        }
    }

        // if(email) {
        //     if(password) {
        //         res.status(201).json({message: 'User login successful'})
        //         console.log("User login successful")
        //     }
        //     else{
        //         res.status(401).json({message: 'User not authorized'})
        //         console.log("User not authorized")
        //     }
        // }
        // else {
        //     res.status(404).json({message: 'User not found'})
        //     console.log("User not found")
        // }
    catch(err) {
        res.status(500).json({success: false, message: err})
    }
}

// module.exports = {
//     postUserSignup,
//     postUserLogin,
//     generateAccessToken
// }