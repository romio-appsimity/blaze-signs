const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const contactRoute = require('./api/routes/contact');

const dotenv = require('dotenv'); 

const path = require("path");
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


const serverRoot = path.resolve(__dirname);
const clientBuildPath = path.join(serverRoot, '..', 'client', 'build');


if (process.env.NODE_ENV === "production") {
  app.use(express.static(clientBuildPath));


  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

app.use((req, res, next) => {
  res.status(200).json({
    message: 'API is running'
  });
});

module.exports = app;