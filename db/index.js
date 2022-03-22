const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/gedny")
  .then(() => {
    console.log("Connected to MongoDB...");
  })
  .catch(err => console.error("Cannot connect to MongoDB...", err));

/**
 * Missed Person
 */
const missedSchema = new mongoose.Schema({
  name: {type: String, required: true},
  age: Number,
  location: String,
  date: { type: Date, default: Date.now() },
  physicalStatus: String,
  mentalStatus: String,
  photo: {type: String, required: true}
});

const missedPerson = mongoose.model("MissedPerson", missedSchema);

async function insertMissedPerson(personInfo) {
  const person = new missedSchema(personInfo);
  const result = await person.save();
  return result;
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
  photo: {type: String, required: true}
});

const foundPerson = mongoose.model("FoundPerson", foundSchema);

async function insertFoundPerson(personInfo) {
  const person = new foundPerson(personInfo);
  const result = await person.save();
  return result;
}

module.exports = {
  insertMissedPerson,
  insertFoundPerson
};



