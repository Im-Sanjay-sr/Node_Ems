const multers = require("multer");

const storage = multers.diskStorage({
    destination: function (req, file, callback) {
      callback(null, "./assets/uploads/");
    },
    filename: function (req, file, callback) {
      callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
    },
  });
  
  var upload = multers({
    storage: storage,
  }).single("avatar");
  
  module.exports = { upload };