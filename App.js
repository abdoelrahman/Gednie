const express = require("express");
const fileUpload = require("express-fileupload");

const { handlePhotoUpload } = require("./functions");
const { insertFoundPerson, insertMissedPerson } = require("./db");

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
app.post("/found", (req, res) => {
  // Validate photo exist
  if (!req.files) {
    res.status(412).send("No photo uploaded.");
    return;
  }

  // Upload photo
  const photoPath = handlePhotoUpload(req.files.photo, "found");

  // Get other person's data
  const person = req.body;
  person.photo = photoPath;

  // Save to database
  insertFoundPerson(person);

  res.send("Found person's data saved!");
});

/**
 * Submit and save missed person's data
 */
app.post("/missed", (req, res) => {
  // Validate photo exist
  if (!req.files) {
    res.status(412).send("No photo uploaded.");
    return;
  }

  // Upload photo
  const photoPath = handlePhotoUpload(req.files.photo, "missed");

  // Get other person's data
  const person = req.body;
  person.photo = photoPath;

  // Save to database
  insertMissedPerson(person);

  res.send("Missed person's data saved!");
});

/*
 * home for test purposes
 */
app.use("/", (req, res) => {
  res.sendFile(__dirname + "/form.html");
});

const port = process.env.port || 300;
app.listen(port, () => {
  console.log("runing in port" + port);
});
