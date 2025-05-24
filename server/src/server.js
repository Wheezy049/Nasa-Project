require('dotenv').config({ path: '../.env' }); 

const http = require("http");
const { connectToMongo } = require("./services/mongo");

const app = require("./app");

const { loadPlanetsData } = require('./models/planets.model')
const { loadLaunchData } = require('./models/launches.model');

const PORT = process.env.PORT || 8000;


const server = http.createServer(app);


async function startServer() {
   await connectToMongo();
    await loadPlanetsData();
    await loadLaunchData();
  
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}...`);
    });
  }

startServer();