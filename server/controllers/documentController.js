const Committee = require('../models/Committee');
const Meeting = require('../models/Meeting');
const Document = require('../models/Document');
const cloudinary = require('cloudinary').v2;

// 1. ENSURE DOTENV IS LOADED HERE
require('dotenv').config();

// 2. CONFIGURE CLOUDINARY EXPLICITLY
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// DEBUG: Add this temporary line to see if the keys are actually loading
console.log("Cloudinary Config Check:", {
  name: process.env.CLOUDINARY_CLOUD_NAME ? "LOADED" : "MISSING",
  key: process.env.CLOUDINARY_API_KEY ? "LOADED" : "MISSING"
});
// 1. UPLOAD AND LINK EVERYTHING
exports.uploadDocument = async (req, res) => {
  try {
    const { committee, meetingNo, date, agenda } = req.body;

    if (!committee || !meetingNo) return res.status(400).json({ message: "Committee and Meeting No are required." });
    if (!req.file) return res.status(400).json({ message: "Please attach a PDF file." });

    // STEP 1: Find or Create the Committee
    let committeeRecord = await Committee.findOne({ committee_name: committee });
    if (!committeeRecord) {
      committeeRecord = new Committee({ committee_name: committee });
      await committeeRecord.save();
    }

    // STEP 2: Find or Create the Meeting
    // We link the meeting to the committee's _id
    let meetingRecord = await Meeting.findOne({ 
      committee_id: committeeRecord._id, 
      meeting_number: meetingNo 
    });
    
    if (!meetingRecord) {
      meetingRecord = new Meeting({
        committee_id: committeeRecord._id,
        meeting_number: meetingNo,
        date: date || new Date().toISOString().split('T')[0],
        agenda_count: agenda ? agenda.split('\n').length : 0, // Rough estimate of items
        status: 'Approved'
      });
      await meetingRecord.save();
    }

    // STEP 3: Upload the File to Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    
    const cloudResult = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'auto',
      folder: 'institute_minutes'
    });

    // STEP 4: Create the Document record and link it to the Meeting
    const newDocument = new Document({
      meeting_id: meetingRecord._id,
      file_path: cloudResult.secure_url,
      file_type: req.file.mimetype,
      uploaded_by: req.user.id
    });

    await newDocument.save();

    res.status(201).json({ 
      message: "Document successfully archived and linked!",
      document: newDocument 
    });

  } catch (err) {
    console.error("❌ Relational Upload Error:", err);
    res.status(500).json({ message: "Database error: " + err.message });
  }
};

// 2. GET ALL DOCUMENTS (Populated for the Dashboard)
exports.getAllDocuments = async (req, res) => {
  try {
    // We use .populate() to pull the linked Meeting and Committee data 
    // so the React frontend still gets all the info in one package!
    const documents = await Document.find()
      .populate({
        path: 'meeting_id',
        populate: {
          path: 'committee_id',
          model: 'Committee'
        }
      })
      .sort({ upload_date: -1 });

    res.status(200).json(documents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};