const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const forgotpasswordSchema = new Schema({
    _id: {
        type: String,
        default: false
    },
    isactive: {
        type: Boolean,
        default: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Forgotpassword', forgotpasswordSchema)