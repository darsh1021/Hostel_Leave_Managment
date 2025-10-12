const Application = require("../Models/ApplicationModel");

const StoreApplication =async(req,res)=>{
    
    try{
        const info = req.body;
    console.log("Information"+info);
    if(!info)
    {
        res.send({status:401,success:false,msg:"dont't get the data"});
    }
    else
    {
        const appModel = new Application({StudentName:info.StudentName,Room_no:info.Room_no,email:info.email,ApplicationType:info.ApplicationType,start_Date:info.start_Date,end_date:info.end_date,reason:info.reason,urgancy:info.urgancy,SupportingDoc:"",Accepted:0});
        await appModel.save();
        res.send({status:200,success:true,msg:"Application Sent"});
    }
   }
   catch(err)
   {
    console.log(err);
   }
}

module.exports = {StoreApplication};