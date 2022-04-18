const crypto = require("crypto");

function handlePhotoUpload(photo, folder) {
  try {
    const photoExtension = photo.name.split(".").pop();
    const photoHashedName = crypto
      .createHash("md5")
      .update(photo + Date.now())
      .digest("hex");
    const photoPath = `./uploads/${folder}/${photoHashedName}.${photoExtension}`;
    photo.mv(photoPath);

    return photoPath;
  } catch (erorr) {
    throw erorr;
  }
}

module.exports = {
  handlePhotoUpload,
};
