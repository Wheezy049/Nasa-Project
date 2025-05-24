const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");
const planets = require("./planets.mongo");

// We'll keep track of the planets in memory
// let habitablePlanets = [];

const HABITABLE_CRITERIA = {
  DISPOSITION: ["CONFIRMED"],
  INSOLATION_MIN: 0.36,
  INSOLATION_MAX: 1.11,
  PLANET_RADIUS_MAX: 1.6,
};

function isHabitablePlanet(planet) {
  return planet.disposition === "CONFIRMED" && 
         planet.insolation >= HABITABLE_CRITERIA.INSOLATION_MIN && 
         planet.insolation <= HABITABLE_CRITERIA.INSOLATION_MAX && 
         planet.radius <= HABITABLE_CRITERIA.PLANET_RADIUS_MAX;
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, "..", "..", "data", "kepler_data.csv");
    
    fs.createReadStream(filePath)
      .on("error", (error) => {
        console.error(`Error opening file: ${error.message}`);
        reject(error);
      })
      .pipe(
        parse({
          comment: "#",
          columns: true,
          skipEmptyLines: true,
          trim: true,
        })
      )
      .on("data", async (data) => {
        const planet = {
          kepler_name: data.kepler_name || data.kepoi_name,
          disposition: data.koi_disposition,
          insolation: parseFloat(data.koi_insol),
          radius: parseFloat(data.koi_prad)
        };
        
        if (isHabitablePlanet(planet)) {
          // habitablePlanets.push(planet);
          savePlanet(planet)
          }
        }
      )
      .on("end", async () => {
        const countPlanets = (await getAllPlanets()).length;
        console.log(`Found ${countPlanets} habitable planets!`);
        resolve();
      });
  });
}

 async function getAllPlanets() {
  return await planets.find({});
}

async function savePlanet(planet) {
 try {
   await planets.updateOne({
             kepler_name: planet.kepler_name
           }, {
             kepler_name: planet.kepler_name
           }, {
             upsert: true
           }
       );
 } catch (error) {
   console.error(`Error saving planet ${planet.kepler_name}: ${error.message}`);
   throw error;
 }
}

module.exports = {
  getAllPlanets,
  loadPlanetsData
};