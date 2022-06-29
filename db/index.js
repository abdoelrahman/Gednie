const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose
  .connect(process.env.DB_CONNECTION)
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
  photo: { type: String, required: true },
  faceDescriptor: String,
  contactInfo: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relationship: { type: String },
  },
});

const missedPerson = mongoose.model("MissedPerson", missedSchema);

async function insertMissedPerson(personInfo) {
  const person = new missedPerson(personInfo);
  const result = await person.save();
  return result;
}

async function deleteMissedPerson(person) {
  return await missedPerson.deleteOne({ id: ObjectId(person.id) });
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
  photo: { type: String, required: true },
  faceDescriptor: { type: String, required: true },
  contactInfo: {
    name: { type: String },
    phone: { type: String },
  },
});

const foundPerson = mongoose.model("FoundPerson", foundSchema);

async function insertFoundPerson(personInfo) {
  const person = new foundPerson(personInfo);
  const result = await person.save();
  return result;
}

async function deleteFoundPerson(person) {
  return await foundPerson.deleteOne({ id: ObjectId(person.id) });
}

async function getFoundPersons() {
  return await foundPerson.find({});
}

/**
 * Matched
 */
const MatchedSchema = new mongoose.Schema({
  missedInfo: Object,
  foundInfo: Object,
});

const matchedPerson = mongoose.model("MatchedPerson", MatchedSchema);

async function insertMatchedPerson(missed, found) {
  const person = new matchedPerson({
    missedInfo: missed,
    foundInfo: found,
  });
  const result = await person.save();
  return result;
}

async function getMatchedPerson(id) {
  return await matchedPerson.findById(ObjectId(id));
}

module.exports = {
  insertMissedPerson,
  deleteMissedPerson,
  getMissedPersons,
  insertFoundPerson,
  deleteFoundPerson,
  getFoundPersons,
  insertMatchedPerson,
  getMatchedPerson,
};
