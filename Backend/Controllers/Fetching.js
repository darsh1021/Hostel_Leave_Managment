const Application = require('../Models/ApplicationModel');
const QRModel = require('../Models/QRdata');

const getApplications = async(req,res)=>{
 
    const {accept} = req.query; 
    console.log("Request came to server"+accept);

    const application = await Application.find({Accepted:accept}).lean();

    if(application)
    console.log(application);
   else
    console.log("Application is empty");

    res.json({success:true,data:application});
 
}
const getApplicationsEmail = async(req,res)=>{
 
    const {email,accept} = req.query; 
    console.log(email);

    const application = await Application.find({email:email,Accepted:accept}).lean();
    
    if(application)
    res.json({success:true,data:application});
 
}

const getQr = async(req,res) =>{
    
    const{email} = req.query;
    console.log("request reached to get qr" + email);
    const data =await QRModel.find({smail:email}).lean();
    
        console.log(data);
    if(data)
    {
        res.json({sccess:true,data:data});
    }
}

module.exports = {getApplications,getApplicationsEmail,getQr};