const http = require('http');


const app = require('./app');

const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

server.listen(PORT, (error) => {
  if (error) {
    console.error("Error starting the server:", error);
  } else {
    console.log(`Server is running on port ${PORT}`);
  }
});