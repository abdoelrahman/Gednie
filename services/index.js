const { getMissedPersons, getFoundPersons } = require("../db");
const { compareFaces } = require("../functions");

async function compareService() {
  console.log("Starting compare service ...");

  // get all missed and found
  const missedPersons = await getMissedPersons();
  const foundPersons = await getFoundPersons();

  let match = false;
  missedPersons.forEach((missed) => {
    foundPersons.forEach((found) => {
      const distance = compareFaces(
        missed.faceDescriptor.split(",").map(Number),
        found.faceDescriptor.split(",").map(Number)
      );

      if (distance <= 0.25) {
        match = true;
      }
    });
  });

  console.log(match ? "Match found!" : "No match found :(");
}

module.exports = {
  compareService,
};
