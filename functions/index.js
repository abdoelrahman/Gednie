const crypto = require("crypto");
const Vonage = require("@vonage/server-sdk");

const faceapi = require("face-api.js");
const canvas = require("canvas");
const { default: axios } = require("axios");
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

function sendSMS(to, text) {
  const vonage = new Vonage({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET,
  });

  const from = "Gednie";

  vonage.message.sendSms(from, to, text, (err, responseData) => {
    if (err) {
      console.log(err);
    } else {
      if (responseData.messages[0]["status"] === "0") {
        console.log("SMS Message sent successfully.");
      } else {
        console.log(
          `Message failed with error: ${responseData.messages[0]["error-text"]}`
        );
      }
    }
  });
}

async function generateShortLink(url) {
  try {
    const encodedUrl = encodeURIComponent(url);
    const result = await axios.get(
      `https://cutt.ly/api/api.php?key=${process.env.CUTTLY_API_KEY}&short=${encodedUrl}`
    );

    if (result.data.url.status === 7) return result.data.url.shortLink;

    return `Error with status:${result.data.url.status}`;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  handlePhotoUpload,
  computeDescriptor,
  compareFaces,
  validateFaceDetected,
  sendSMS,
  generateShortLink,
};
