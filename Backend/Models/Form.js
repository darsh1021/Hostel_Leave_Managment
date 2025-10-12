const { required } = require("joi");
const mongoose = require("mongoose");

const FormSchema =new mongoose.Schema({
    s_name : {
       type : String,
       required : true
    },
    department : {
        type:String,
        required : true
    },
    division : {
        type:String,
        required : true
    },
    r_no:{
        type:String,
        required : true
    },
    s_phone:{
         type:String,
        required : true
    },
    p_phone:{
         type:Number,
        required : true
    },
    p_email:{
        type:String,
        required:true
    },
    address:{
         type:String,
        required : true
    },
    photo_url:{
        type:String,
        default:'https:'
    },
    application:{
        type:Number,
        default:0
    },

});

const Form =  mongoose.model('Form',FormSchema);

module.exports = Form; 