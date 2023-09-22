const User = require('../models/user');
const e = require('express');

const getUserLeaderBoard = async (req,res,next) => {
    try {
        const userAggregatedExpense = await User.find().sort({totalExpense:'desc'});;
        res.status(200).json(userAggregatedExpense);
    }
    catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
}

module.exports = {
    getUserLeaderBoard
}