const Application = require("../Models/ApplicationModel");
const QRModel = require("../Models/QRdata");

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

const StoreQR = async (req, res) => {
  try {
    const { Student_Name, Room_no, smail, start_date, end_date } = req.body;
    console.log("Qr data :"+ Student_Name, Room_no, smail, start_date, end_date);
    // Create new QR entry
    const qrData = new QRModel({
      Student_Name,
      Room_no,
      smail,
      start_date,
      end_date
    });
     
    await qrData.save();
    console.log("QR data stored:", qrData);

    res.status(201).json({
      success: true,
      message: "QR data stored successfully (auto-deletes after 2h)",
      data: qrData
    });
  } catch (error) {
    console.error("Error storing QR data:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



module.exports = {StoreApplication,StoreQR};