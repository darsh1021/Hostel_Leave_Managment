const mongoose = require('mongoose');

const QR = new mongoose.Schema({

    Student_Name:{
         type:String,
         required:true
    },
    Room_no:{
        type:String,
        required:true
    },
    Student_Email:{
        type:String,
        required:true
    },
    start_date:{
        type:Date,
        required:true
    },
    end_date:{
        type:Date,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:'2h'
    }
});

const QRModel = mongoose.model('QRModel',QR);
module.exports = QRModel;