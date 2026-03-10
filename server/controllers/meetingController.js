const Meeting = require('../models/Meeting');
const cloudinary = require('cloudinary').v2;
require('dotenv').config(); // Make sure dotenv is loaded so it can read your .env file

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

exports.createMeeting = async (req, res) => {
  try {
    const { committee, meetingNo, date, agenda } = req.body;
    
    if (!committee || !meetingNo) return res.status(400).json({ message: "Committee and Meeting No are required." });
    if (!req.file) return res.status(400).json({ message: "Please attach a PDF file." });

    // 1. Convert the RAM buffer into a base64 string that Cloudinary can read
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    // 2. Upload to Cloudinary
    console.log("☁️ Uploading to Cloudinary...");
    const cloudResult = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'auto', // Auto handles PDFs well
      folder: 'institute_minutes' // Creates a neat folder in your Cloudinary account
    });

    console.log("✅ Cloudinary Upload Success! URL:", cloudResult.secure_url);

    // 3. Save to MongoDB using the Cloudinary Web URL instead of a local filename
    const newMeeting = new Meeting({
      committee,
      meetingNo,
      date: date || new Date().toISOString().split('T')[0],
      agenda,
      fileName: cloudResult.secure_url, // WE NOW STORE THE FULL WEB LINK HERE
      uploadedBy: req.user.id
    });

    await newMeeting.save();
    res.status(201).json(newMeeting);
  } catch (err) {
    console.error("❌ Error:", err); 
    res.status(500).json({ message: "Upload error: " + err.message });
  }
};

exports.getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ createdAt: -1 });
    res.status(200).json(meetings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};