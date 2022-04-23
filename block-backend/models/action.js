const mongoose = require('mongoose');
const actionSchema=new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    wallet:{
        type:String,
        required:true
    },
    received: {
        type:Number,
        require: false,
        default: 0
    },
    sent: {
        type:Number,
        require: false,
        default: 0
    },
    epoch_number: {
        type:String,
        require: false,
    },
    date: {
        type:String,
        require: false,
    },
    from: {
        type:String,
        require: false
    },
    created_at:{
        type:Date,
        default:Date.now()
    }
});
module.exports=mongoose.model('action',actionSchema);