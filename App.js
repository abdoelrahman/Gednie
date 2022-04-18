const express = require("express");
const fileUpload = require("express-fileupload");

const {
  handlePhotoUpload,
  computeDescriptor,
  compareFaces,
} = require("./functions");
const { insertFoundPerson, insertMissedPerson } = require("./db");
const { compareService } = require("./services");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    createParentPath: true,
  })
);

/**
 * Submit and save found person's data
 */
app.post("/found", async (req, res) => {
  // Validate photo exist
  if (!req.files) {
    res.status(412).send("No photo uploaded.");
    return;
  }

  // Upload photo
  const photoPath = await handlePhotoUpload(req.files.photo, "found");

  // Get other person's data
  const person = req.body;
  person.photo = photoPath;

  // Compute face descriptor
  person.faceDescriptor = await computeDescriptor(photoPath);

  // Save to database
  await insertFoundPerson(person);

  res.send("Found person's data saved!");
});

/**
 * Submit and save missed person's data
 */
app.post("/missed", async (req, res) => {
  // Validate photo exist
  if (!req.files) {
    res.status(412).send("No photo uploaded.");
    return;
  }

  // Upload photo
  const photoPath = await handlePhotoUpload(req.files.photo, "missed");

  // Get other person's data
  const person = req.body;
  person.photo = photoPath;

  // Compute face descriptor
  person.faceDescriptor = await computeDescriptor(photoPath);

  // Save to database
  await insertMissedPerson(person);

  compareService();

  res.send("Missed person's data saved!");
});

/*
 * home for test purposes
 */
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/form.html");
});

const port = process.env.port || 300;
app.listen(port, () => {
  console.log("runing in port" + port);
});
