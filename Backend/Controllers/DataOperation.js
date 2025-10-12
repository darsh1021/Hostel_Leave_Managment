const ApplicationModel = require("../Models/ApplicationModel");

const updateApplication=async(req,res)=>{
     console.log(req.body._id+" Data received"+req.body.accept);
     const up = await ApplicationModel.updateOne({_id:req.body._id},{$set:{Accepted:req.body.accept}});
     
     if(up)
     console.log("Acception done sucessfully"+up); 
}

module.exports = {updateApplication};