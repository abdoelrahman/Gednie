require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");

const {
  handlePhotoUpload,
  computeDescriptor,
  validateFaceDetected,
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

  // Validate face detected in the image
  if (!(await validateFaceDetected(photoPath))) {
    res.status(412).send("No face detected.");
    return;
  }

  // Get other person's data
  const person = JSON.parse(req.body.data);
  person.photo = photoPath;

  // Compute face descriptor
  person.faceDescriptor = await computeDescriptor(photoPath);

  // Save to database
  const result =await insertFoundPerson(person);

  compareService({person:result,path:"found"});

  res.send("Found person's data saved!");
});

/**
 * Submit and save missed person's data
 */
app.post("/missed", async (req, res) => {
  // Validate photo exist
  console.log(req.body)
  if (!req.files) {
    res.status(412).send("No photo uploaded.");
    return;
  }
  console.log(req.files)

  // Upload photo
  const photoPath = await handlePhotoUpload(req.files.photo, "missed");

  // Validate face detected
  if (!(await validateFaceDetected(photoPath))) {
    res.status(412).send("No face detected.");
    return;
  }

  // Get other person's data
  const person = JSON.parse(req.body.data);
  console.log('person >>>' ,person);
  person.photo = photoPath;
  // Compute face descriptor
  person.faceDescriptor = await computeDescriptor(photoPath);

  // Save to database
  const result=  await insertMissedPerson(person);
 
  compareService({person:result,path:"missed"});

  res.send("Missed person's data saved!");
});

/*
 * home for test purposes
 */
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/form.html");
});

const port = process.env.PORT || 300;
app.listen(port, () => {
  console.log("runing in port" + port);
});
