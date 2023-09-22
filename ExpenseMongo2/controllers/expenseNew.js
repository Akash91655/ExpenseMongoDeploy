const Expense = require('../models/expense');
const User = require('../models/user');
const AWS = require('aws-sdk');
const UserServices = require('../services/userservices');
const S3Service = require('../services/S3service')

function uploadToS3(data, filename) {
    const BUCKET_NAME = 'expensetrackernew';
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    let s3bucket = new AWS.S3( {
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET
    })

        var params = {
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: data,
            ACL: 'public-read'
        }

        return new Promise((resolve, reject) => {
            s3bucket.upload(params, (err, s3response) => {
                if(err) {
                    console.log('Something went wrong');
                    reject(err);
                }
                else {
                    resolve(s3response.Location);
                }
            })
        })
}

exports.getExpense = async(req,res,next)=>{
    try{
        const page =Number (req.params.page);
        const rows =Number(req.params.rows);
        let totaItems = await Expense.find({userId:req.user._id})
        .then(result=>{
            res.status(200).json({
                allExpense:result,
                currentPage:page,
                hasNextPage:(rows*page)<(result.length),
                nextPage:(page+1),
                hasPreviousPage:(page>1),
                previousPage:(page-1),
                lastPage:(Math.ceil((result.length)/rows)),
                success:true
            });
        })
        .catch(err=>{
            console.log(err)
        })
         
    }catch(err){
        console.log('get user is failed',JSON.stringify(err))
        res.status(500).json({error:err,success:false})
    }
}

exports.addExpense = async(req,res,next)=>{
    try{
        const expense = req.body.exp;
        const category = req.body.cat;
        const description = req.body.desc;
        if(expense==undefined||expense.length===0){
            return res.status(400).json({success:false,message:"Amount is Mandatory"});
        }
        const newExpense = new Expense({amount:expense,description:description,category:category,userId:req.user});
        newExpense.save();
        const totalexp = Number(req.user.totalExpense) + Number(expense);
        await User.findByIdAndUpdate({_id:req.user._id},{totalExpense:totalexp});
        res.status(201).json({newExpense:[newExpense]});
    }catch(err){
        res.status(500).json({success:false,error:err})
    }
}

exports.deleteExpense = async(req,res,next)=>{
    try{
        if(req.params.id == 'undefined'){
            console.log("ID is Missing");
            return res.status(400).json({success:false,message:"ID is Missing"})
        }
        const userIdNew = req.params.id;
       
        const expdata = await Expense.find({_id:userIdNew});
        
        const totalexp = req.user.totalExpense - expdata[0].amount;
        
        await User.findByIdAndUpdate({_id:req.user._id},{totalExpense:totalexp});
       
        await Expense.findByIdAndRemove(userIdNew);
        res.status(200).json({success:true,message:"Deletion Done"})
    }
    catch(err){
        res.status(500).json({success:false,error:err})
    }
}

exports.downloadExpense = async(req,res,next) => {
    try {
        const userId = req.user._id;
        const expenses = await Expense.find({userId: userId});
        console.log(expenses);
        const stringifiedExpenses = JSON.stringify(expenses);

        // const userId = req.user.id;

        const fileName = `Expense${userId}/${new Date()}.txt`;
        const fileURl = await S3Service.uploadToS3(stringifiedExpenses, fileName);
        console.log(fileURl);
        res.status(200).json({ fileURl, success: true});
    }
    catch(err) {
        console.log(err);
        res.status(500).json({fileURl: '', success: false, err: err})
    }
}