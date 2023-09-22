const forgotPasswordmodel = require('../models/password');
const User = require('../models/user');

const Sib = require('sib-api-v3-sdk');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

require('dotenv').config();

const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY;

const id = uuid.v4();
const tranEmailApi = new Sib.TransactionalEmailsApi()

const forgotPassword = async(req,res,next) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({email});
        if(user.email == email) {
            // const id = uuid.v4();
            // const forgotpasswordcreate = await forgotpasswordmodel
            // .create({ id, active: true, userId: user[0].id })
            // const tranEmailApi = new Sib.TransactionalEmailsApi()
            const sender = {
                email: process.env.EMAIL,
            }
            console.log(sender);
            console.log(process.env.API_KEY);
            const receivers = [
                {
                    email: email,
                },
            ]
            await tranEmailApi.sendTransacEmail ({
                    sender,
                    to: receivers,
                    subject: 'Forgot Password Testing',
                    htmlContent: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password </a>`,
                })
            const newforgotpassword = new forgotpasswordmodel({_id:id,isactive:true,userId:user._id})
            newforgotpassword.save();
            return res.status(200).json({message: 'Link to reset password sent to your mail', success: true});
        }
    }
    catch(err) {
        console.log(JSON.stringify(err))
        return res.status(405).json({message : "Failed", success : false})
    }
}

const resetpassword = async (req,res,next) => {
    const id = req.params.id;
    try {
    const forgotPasswordReq = await forgotpasswordmodel.findById(id);
        if(forgotPasswordReq._id == id && forgotPasswordReq.isactive==true) {
            await forgotpasswordmodel.findByIdAndUpdate({_id:id},{isactive: false})
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e) {
                                            e.preventDefault();
                                            console.log("called")
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                    </html>`
            )
            res.end();
        }
        } catch (err) {
             console.error(JSON.stringify(err));
             res.status(500).json({ message: 'Failed to reset password', error: err });
        }
    };
    

const updatepassword = async(req,res,next) => {
    try {
        const {newpassword} = req.query;
        const {resetpasswordid} = req.params;
        const forgot = await forgotpasswordmodel.findById(resetpasswordid);
        const user = await User.findById(forgot.userId);
                if(user) {
                    const saltRounds = 10;
                        bcrypt.hash(newpassword, saltRounds, async function(err, hash) {
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            await User.findByIdAndUpdate({_id:user._id},{ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfully update the new password'})
                            })
                        })
                }
                else {
                    return res.status(404).json({ error: 'No user Exists', success: false})
                }
    }
    catch(err) {
        return res.status(403).json({ err, success: false } )
    }
}
module.exports = {
    forgotpassword,
    resetpassword,
    updatepassword
}