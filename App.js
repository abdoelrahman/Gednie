require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require('cors')

const {
  handlePhotoUpload,
  computeDescriptor,
  validateFaceDetected,
} = require("./functions");
const { insertFoundPerson, insertMissedPerson } = require("./db");
const { compareService, getMissedPersons, getFoundPersons, validateExistPersonService } = require("./services");
const { stringify } = require("nodemon/lib/utils");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(
  fileUpload({
    createParentPath: true,
  })
);

/**
 * Submit and save found person's data
 */
 app.get('/found',async (req,res)=>{
   const paths = []
   const foundPersons = await getFoundPersons()
 await res.send(foundPersons)
 })
 app.get('/missed',async (req,res)=>{
   const paths = []
   const missedPersons = await getMissedPersons()
 await res.send(missedPersons)
 })
app.get(`/getFound/`, async (req, res) => {
  const id = req.query.id;
  let person = ''
  console.log('id>>>',id)
  const foundPersons = await getFoundPersons()
   await foundPersons.map(p=>
    {
      console.log( JSON.stringify(p.photo)) 
      console.log(id)
      if(JSON.stringify(p.photo) === `${id}`){

        person =  p.photo
      }
    })
    await  res.download(person)    

   });
app.get(`/getMissed/`, async (req, res) => {
  const id = req.query.id;
  let person = ''
  console.log('id>>>',id)
  const missedPersons = await getMissedPersons()
   await missedPersons.map(p=>
    {
      console.log( JSON.stringify(p.photo)) 
      console.log(id)
      if(JSON.stringify(p.photo) === `${id}`){

        person =  p.photo
      }
    })
    await  res.download(person)    

   });
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
  console.log(req.files)
  
  // Get other person's data
  
  const person = JSON.parse(req.body.data);

  person.photo = photoPath;

  // Compute face descriptor
  person.faceDescriptor = await computeDescriptor(photoPath);
  if((await validateExistPersonService({person:person,path:"found"}))){
    res.status(412).send({message:"already exists"})
    return;
  }
  // Save to database
  const result =await insertFoundPerson(person);


  const compareResult =await  compareService({person:result,path:"found"});

  res.send(compareResult);
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
  person.photo = photoPath;
  // Compute face descriptor
  person.faceDescriptor = await computeDescriptor(photoPath);
  if((await validateExistPersonService({person:person,path:"missed"}))){
    res.status(412).send({message:"already exists"})
    return;
  }
  // Save to database
  const result=  await insertMissedPerson(person); 
  const compareResult =await compareService({person:result,path:"missed"});

  res.send(compareResult);
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
