const crypto = require("crypto");

const faceapi = require("face-api.js");
const canvas = require("canvas");
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

async function handlePhotoUpload(photo, folder) {
  try {
    const photoExtension = photo.name.split(".").pop();
    const photoHashedName = crypto
      .createHash("md5")
      .update(photo + Date.now())
      .digest("hex");
    const photoPath = `./uploads/${folder}/${photoHashedName}.${photoExtension}`;
    await photo.mv(photoPath);

    return photoPath;
  } catch (erorr) {
    throw erorr;
  }
}

async function computeDescriptor(photoPath) {
  try {
    const img = await canvas.loadImage(photoPath);
    await faceapi.nets.faceRecognitionNet.loadFromDisk("weights");
    return await faceapi.computeFaceDescriptor(img);
  } catch (error) {
    throw error;
  }
}

function compareFaces(descriptor1, descriptor2) {
  return faceapi.euclideanDistance(descriptor1, descriptor2);
}

async function validateFaceDetected(photoPath) {
  try {
    const img = await canvas.loadImage(photoPath);
    await faceapi.nets.tinyFaceDetector.loadFromDisk("weights");
    return (await faceapi.tinyFaceDetector(img)).length ? true : false;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  handlePhotoUpload,
  computeDescriptor,
  compareFaces,
  validateFaceDetected,
};
