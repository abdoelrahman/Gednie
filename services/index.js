const { getMissedPersons, getFoundPersons } = require("../db");
const { compareFaces } = require("../functions");

async function compareService({person,path}) {
  console.log("Starting compare service ...");

  // get all missed and found
  let match = false;
  let obj;
  if(path ==="missed") {
      const foundPersons = await getFoundPersons();
      foundPersons.forEach((found) => {
        const distance = compareFaces(
          person.faceDescriptor.split(",").map(Number),
          found.faceDescriptor.split(",").map(Number)
          );
          
          if (distance <= 0.25) {
            match = true;
           obj = found;
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
             obj = missed;
            }
          });

      }

  console.log(match ? "Match found!" : "No match found :(");
  return (match ?{number:obj.contactNumber} : {message:'no mantch found'})
}
async function validateExistPersonService({person,path}) {
  console.log("Starting validation service ...");

  // get all missed and found
  // console.log('person111111 :>> ', person);
  
  let match = false;
  let obj;
  if(path ==="found") {
      const foundPersons = await getFoundPersons();
      foundPersons.forEach((found) => {
        const distance = compareFaces(
          person.faceDescriptor.map(Number),
          found.faceDescriptor.split(",").map(Number)
          );
          
          if (distance <= 0.25) {
            match = true;
           obj = found;
          }
        });
        
      }else if (path ==="missed") {
        const missedPersons = await getMissedPersons();
        missedPersons.forEach((missed) => {
          const distance = compareFaces(
            person.faceDescriptor.map(Number),
            missed.faceDescriptor.split(",").map(Number)
            );
            
            if (distance <= 0.25) {
              match = true;
             obj = missed;
            }
          });

      }

  console.log(match ? "already Exist!" : "first time :(");
  return match;
}


module.exports = {
  compareService, getMissedPersons, getFoundPersons,validateExistPersonService
};
