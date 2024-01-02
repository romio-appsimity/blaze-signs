const router = require('express').Router();
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

const contactSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  province: { type: String, required: true },
  postalCode: { type: String, required: true, match: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/ }, 
  contactNumber: { type: String, required: true, match: /^\+\d{1,2}\s?\(\d{3}\)\s?\d{3}(-\d{4})?$/ }, 
  emailAddress: { type: String, required: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }, 
  message: { type: String, required: true },
  file: { type: Buffer, default: null }, 
  fileType: { type: String, default: null },
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;