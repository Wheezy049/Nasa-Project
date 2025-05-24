const { getAllLaunches, scheduleNewLaunch, existsLaunchWithId, abortLaunchById } = require('../../models/launches.model');

const { getPagination } = require('../../services/query');

async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);
  res.status(200).json( await getAllLaunches(skip, limit) );
}

async function httpAddNewLaunch(req, res) {
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
   await scheduleNewLaunch(launch)
   return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id);

    const existsLaunch = await existsLaunchWithId(launchId);

    if (!existsLaunch) {
        return res.status(404).json({
          error: "Launch not found",
        });
    }
    const abortedLaunch = await abortLaunchById(launchId);

    if (!abortedLaunch) {
      return res.status(400).json({
        error: "Launch not aborted",
      })
    }


    return res.status(200).json({
      ok: true,
    });
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}