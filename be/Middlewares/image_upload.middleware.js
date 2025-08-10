const multer = require('multer');

let _imagePath;
const storage = multer.memoryStorage(
//   {
//   destination: function (req, file, cb, next) {
//     if (
//       file.mimetype == 'image/png' ||
//       file.mimetype == 'image/jpg' ||
//       file.mimetype == 'image/jpeg'
//     ) {
//       imagePath = path.join(path.dirname(__dirname), 'Images');
//       cb(null, imagePath);
//     } else {
//       //Reject image
//       callback('Image is only png/jpg/jpeg', false);
//     }
//   },
//   filename: function (req, file, cb) {
//     //const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, file.originalname);
//   },
// }
);

const upload = multer({ storage: storage });

module.exports = upload;
