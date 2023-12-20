const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const contactRoute = require('./api/routes/contact');

const dotenv = require('dotenv'); 


dotenv.config();


const dbConnectionString = process.env.DB_CONNECTION_STRING;

mongoose.connect(dbConnectionString);

mongoose.connection.on('error', (error) => {
  console.log('Connection failed:', error);
});

mongoose.connection.on('connected', () => {
  console.log('Connected with database..');
});

const app = express();



app.use(cors());
app.use(bodyParser.json());


app.use('/contact', contactRoute);


app.use((req, res, next) => {
  res.status(200).json({
    message: 'API is running'
  });
});

module.exports = app;