const express = require('express');
const router = express.Router();
const Contact = require('../model/contact');
const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

const maxFileSize = 2 * 1024 * 1024; 
const maxFileCount = 5;

const fileFilter = (req, file, cb) => {
  if (file.size > maxFileSize) {
    return cb(new Error('File size exceeds the maximum limit (2MB).'));
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: maxFileSize, files: maxFileCount },
}).array("file", maxFileCount);

router.post('/contacts', async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size exceeds the maximum limit (2MB).' });
      } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ error: 'Too many files uploaded. Maximum allowed: ' + maxFileCount });
      }
      return res.status(500).json({ error: 'Internal server error.' });
    }
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

   

    try {
      const files = req.files ? req.files.map(file => ({
        data: file.buffer,
        type: file.mimetype.split('/')[1],
      })) : [];

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
        file:files
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
});

router.get("/:id/file", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found.' });
    }

    res.contentType(contact.fileType);
    res.send(contact.file);
  } catch (error) {
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

router.get('/pdf', (req, res) => {
  try {
    const pdfPath = path.join(__dirname, '..', 'public', 'BlazeSigns-CompanyProfile.pdf');
    res.setHeader('Content-Disposition', `attachment; filename=BlazeSigns-CompanyProfile.pdf`);
    res.contentType('application/pdf');
    res.sendFile(pdfPath);
  } catch (error) {
    console.error('Error sending PDF:', error);
    res.status(500).send('Internal Server Error');
  }
});




module.exports = router;


