// Dependancies
const multer = require("multer");
const slugify = require("slugify");

const storage = multer.diskStorage({
  destination: "./src/media",
  filename: (request, file, nameFile) => {
    nameFile(
      null,
      `${slugify(request.body.name.toLowerCase() + Date.now())}.${
        file.originalname.split(".")[1]
      }`
    );
  },
});

// Initialize upload variable
const upload = multer({ storage });

module.exports = upload;
