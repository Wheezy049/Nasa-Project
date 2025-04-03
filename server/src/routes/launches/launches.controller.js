const { getAllLaunches, addNewLaunch, existsLaunchWithId, abortLaunchById } = require('../../models/launches.model');

function httpGetAllLaunches(req, res) {
  res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
  const launch = req.body;

  const requiredFields = ["mission", "rocket", "launchDate", "target"];

  for (const field of requiredFields) {
     if (!launch[field]) {
        return res.status(400).json({
            error: `Missing ${field} field`,
        });
     }
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
     return res.status(400).json({
        error: "Invalid launch date",
     });
    }
   addNewLaunch(launch)
   return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id);
    if (!existsLaunchWithId(launchId)) {
        return res.status(404).json({
          error: "Launch not found",
        });
    }
    const abortedLaunch = abortLaunchById(launchId);
    return res.status(200).json(abortedLaunch);
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}