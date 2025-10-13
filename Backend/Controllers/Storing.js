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

const StoreQR = async (req, res) => {
  try {
    const { Student_Name, Room_no, Student_Email, start_date, end_date } = req.body;

    if (!Student_Name || !Room_no || !Student_Email || !start_date || !end_date) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Create new QR entry
    const qrData = await QRModel.create({
      Student_Name,
      Room_no,
      Student_Email,
      start_date,
      end_date
    });

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