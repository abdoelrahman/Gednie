const {
  getMissedPersons,
  getFoundPersons,
  deleteMissedPerson,
  deleteFoundPerson,
  insertMatchedPerson,
} = require("../db");
const { compareFaces, sendSMS, generateShortLink } = require("../functions");

async function compareService() {
  console.log("Starting compare service ...");

  // get all missed and found
  const missedPersons = await getMissedPersons();
  const foundPersons = await getFoundPersons();

  let match = null;
  missedPersons.forEach((missed) => {
    foundPersons.forEach((found) => {
      const distance = compareFaces(
        missed.faceDescriptor.split(",").map(Number),
        found.faceDescriptor.split(",").map(Number)
      );

      if (distance <= 0.25) {
        // assign matched to variable
        match = {
          missed: missed,
          found: found,
        };
      }
    });
  });

  if (match) {
    console.log("Match found!");

    // Move data to matched
    const savedMatched = await insertMatchedPerson(match.missed, match.found);

    // Delete from missed and found
    await deleteMissedPerson(match.missed);
    await deleteFoundPerson(match.found);

    // Generate short link
    const shortLink = await generateShortLink(
      `${process.env.APP_URL}/matched/${savedMatched.id}`
    );
    console.log("Short link generated: " + shortLink);

    // Send message
    if (process.env.ENABLE_SEND_SMS === "true") {
      sendSMS(
        match.missed.contactInfo.phone,
        `We found the missed person! for details: ${shortLink}`
      );
    }

    return console.log("Match process completed.");
  }

  return console.log("No match found :(");
}

module.exports = {
  compareService,
};
