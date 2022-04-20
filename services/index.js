const { getMissedPersons, getFoundPersons } = require("../db");
const { compareFaces } = require("../functions");

async function compareService({person,path}) {
  console.log("Starting compare service ...");

  // get all missed and found
  
  let match = false;
  if(path ==="missed") {
      const foundPersons = await getFoundPersons();
      foundPersons.forEach((found) => {
        const distance = compareFaces(
          person.faceDescriptor.split(",").map(Number),
          found.faceDescriptor.split(",").map(Number)
          );
          
          if (distance <= 0.25) {
            match = true;
          }
        });
        
      }else if (path ==="found") {
        const missedPersons = await getMissedPersons();
        missedPersons.forEach((missed) => {
          const distance = compareFaces(
            person.faceDescriptor.split(",").map(Number),
            missed.faceDescriptor.split(",").map(Number)
            );
            
            if (distance <= 0.25) {
              match = true;
            }
          });

      }

  console.log(match ? "Match found!" : "No match found :(");
}

module.exports = {
  compareService,
};
