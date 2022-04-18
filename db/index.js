const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://gednie:48GktJunyCZiBGFq@gednie.upb2i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch((err) => console.error("Cannot connect to MongoDB...", err));

/**
 * Missed Person
 */
const missedSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  location: String,
  date: { type: Date, default: Date.now() },
  physicalStatus: String,
  mentalStatus: String,
  faceDescriptor: String,
  photo: { type: String, required: true },
});

const missedPerson = mongoose.model("MissedPerson", missedSchema);

async function insertMissedPerson(personInfo) {
  const person = new missedPerson(personInfo);
  const result = await person.save();
  return result;
}

async function getMissedPersons() {
  return await missedPerson.find({});
}

/**
 * Found Person
 */
const foundSchema = new mongoose.Schema({
  name: String,
  age: Number,
  location: String,
  date: { type: Date, default: Date.now() },
  physicalStatus: String,
  mentalStatus: String,
  faceDescriptor: String,
  photo: { type: String, required: true },
});

const foundPerson = mongoose.model("FoundPerson", foundSchema);

async function insertFoundPerson(personInfo) {
  const person = new foundPerson(personInfo);
  const result = await person.save();
  return result;
}

async function getFoundPersons() {
  return await foundPerson.find({});
}

module.exports = {
  insertMissedPerson,
  getMissedPersons,
  insertFoundPerson,
  getFoundPersons,
};
