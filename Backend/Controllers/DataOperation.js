const ApplicationModel = require("../Models/ApplicationModel");

const updateApplication = async (req, res) => {
  try {
    const { _id, accept } = req.body;

    console.log(`Data received: ID=${_id}, Accept=${accept}`);

    if (!_id || accept === undefined) {
      return res.status(400).json({ success: false, message: "Missing required fields (_id or accept)" });
    }

    // Update the specific application
    const result = await ApplicationModel.updateOne(
      { _id },
      { $set: { Accepted: accept } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (result.modifiedCount === 0) {
      return res.status(200).json({ success: true, message: "No changes made (already same value)" });
    }

    console.log("✅ Application updated successfully:", result);

    // Send success response back to frontend
    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      result
    });

  } catch (error) {
    console.error("❌ Error updating application:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating application",
      error: error.message
    });
  }
};

module.exports = { updateApplication };
