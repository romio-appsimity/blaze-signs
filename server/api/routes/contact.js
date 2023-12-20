const express = require('express');
const router = express.Router();
const Contact = require('../model/contact');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
}).single("file");

router.post('/contacts', upload, async (req, res) => {
  const {
    companyName,
    firstName,
    lastName,
    address,
    city,
    province,
    postalCode,
    contactNumber,
    emailAddress,
    message,
  } = req.body;


  if (!companyName || !firstName || !lastName || !emailAddress) {
    return res.status(400).json({ error: 'Please fill in all required fields.' });
  }
  try {
   

    const newContact = new Contact({
      companyName,
      firstName,
      lastName,
      address,
      city,
      province,
      postalCode,
      contactNumber,
      emailAddress,
      message,
    });

    const savedContact = await newContact.save();

    res.status(201).json({
      success: true,
      message: 'Contact submitted successfully.',
      contact: savedContact,
      serverMessage: 'Thank you for contacting us. We will get back to you soon!',
    });
  } catch (error) {
    console.error('Error submitting contact:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

router.get('/download-brochure', (req, res) => {
  const filePath = path.join(__dirname, './BlazeSigns-CompanyProfile.pdf');
  res.download(filePath, 'Blaze Signs -Company Profile.pdf', (err) => {
    if (err) {
      console.error('Error downloading brochure:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});

router.get('/view-brochure', (req, res) => {
  const brochurePath = path.join(__dirname, 'BlazeSigns-CompanyProfile.pdf');

  fs.stat(brochurePath, (err, stat) => {
    if (err) {
      console.error('Error reading PDF file:', err);
      return res.status(500).send('Internal Server Error');
    }

    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const file = fs.createReadStream(brochurePath, { start, end });
      const headers = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'application/pdf',
      };

      res.writeHead(206, headers);
      file.pipe(res);
    } else {
      const headers = {
        'Content-Length': fileSize,
        'Content-Type': 'application/pdf',
      };

      res.writeHead(200, headers);
      fs.createReadStream(brochurePath).pipe(res);
    }
  });
});

module.exports = router;


