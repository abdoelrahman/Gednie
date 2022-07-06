require("dotenv").config();
const express = require("express");

const { computeDescriptor, validateFaceDetected } = require("./functions");
const {
  insertFoundPerson,
  insertMissedPerson,
  getMatchedPerson,
} = require("./db");
const { compareService } = require("./services");
const isBase64 = require("is-base64");

const app = express();
app.use(express.json({ limit: "60mb" }));
app.use(express.urlencoded({ extended: true }));

/**
 * Submit and save found person's data
 */
app.post("/found", async (req, res) => {
  // Get other person's data
  const person = req.body;

  // Validate photo exist
  if (!person.photo) {
    res.status(412).send("No photo uploaded.");
    return;
  }

  // Validate photo is base64
  if (!isBase64(person.photo, { allowMime: true })) {
    res.status(412).send("Invalid photo.");
    return;
  }

  // Validate face detected in the image
  if (!(await validateFaceDetected(person.photo))) {
    res.status(412).send("No face detected.");
    return;
  }

  // Compute face descriptor from base64 photo
  person.faceDescriptor = await computeDescriptor(person.photo);

  // Save to database
  let savedPerson = await insertFoundPerson(person);

  // res.send("Found person's data saved!");
  res.status(200).send({
    message: "Found person's data saved!",
    data: savedPerson,
  });
});

/**
 * Submit and save missed person's data
 */
app.post("/missed", async (req, res) => {
  // Get other person's data
  const person = req.body;

  // Validate photo exist
  if (!person.photo) {
    res.status(412).send("No photo uploaded.");
    return;
  }

  // Validate photo is base64
  if (!isBase64(person.photo, { allowMime: true })) {
    res.status(412).send("Invalid photo.");
    return;
  }

  // Validate contact info
  if (!person.contactInfo.name || !person.contactInfo.phone) {
    res.status(412).send("Contact info (name and phone) are required!");
    return;
  }

  // Validate face detected
  if (!(await validateFaceDetected(person.photo))) {
    res.status(412).send("No face detected.");
    return;
  }

  // Compute face descriptor
  person.faceDescriptor = await computeDescriptor(person.photo);

  // Save to database
  const savedPerson = await insertMissedPerson(person);

  // Start comapre service
  compareService();

  res.status(200).send({
    message: "Missed person's data saved!",
    data: savedPerson,
  });
});

/**
 * Get matched person
 */
app.get("/matched/:id", async (req, res) => {
  res.status(200).send(await getMatchedPerson(req.params.id));
});

/*
 * home for test purposes
 */
app.get("/", (req, res) => {
  res.send("The server is up and running!");
});

const port = process.env.PORT || 80;
app.listen(port, () => {
  console.log("runing in port " + port);
});
