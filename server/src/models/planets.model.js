const fs = require('fs');
const path = require('path');
const parse = require('csv-parser');

let habitablePlanets = []; // Reset each time we load data

function isHabitablePlanet(planet) {
  // console.log('Checking Planet:', {
  //   koi_disposition: planet['koi_disposition'],
  //   koi_insol: planet['koi_insol'],
  //   koi_prad: planet['koi_prad'],
  // });

  // if (planet.koi_disposition !== undefined && planet.koi_insol !== undefined && planet.koi_prad !== undefined) {
  //   console.log('Checking Planet:', planet);
  // } else {
  //   console.log('Some planet data is missing:', planet);
  // }
  

  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    parseFloat(planet['koi_insol']) > 0.36 &&
    parseFloat(planet['koi_insol']) < 1.11 &&
    parseFloat(planet['koi_prad']) < 1.6
  );
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    habitablePlanets = []; // Reset the array before loading new data

    const filePath = path.join(__dirname, '..', '..', 'data', 'kepler_data.csv');
    console.log('Loading planets data from:', filePath);

    fs.createReadStream(filePath)
      .pipe(
        parse({
          comment: '#',
          columns: true,
        })
      )
      .on('data', (data) => {
        // console.log('Raw Planet Data:', data);// Log every planet to check format

        if (isHabitablePlanet(data)) {
          habitablePlanets.push(data);
          console.log('Habitable Planet Found:', data); // Log only if it matches
        }
      })
      .on('error', (err) => {
        console.error('Error reading CSV:', err);
        reject(err);
      })
      .on('end', () => {
        console.log(`✅ ${habitablePlanets.length} habitable planets found!`);
        console.log('Final Habitable Planets:', habitablePlanets); // Print final array
        resolve(habitablePlanets);
      });
  });
}

function getAllPlanets() {
  return habitablePlanets;
}

module.exports = {
  loadPlanetsData,
  getAllPlanets, // Return a copy to prevent mutation
};
