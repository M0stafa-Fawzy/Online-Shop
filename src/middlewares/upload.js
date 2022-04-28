const multer = require("multer");

const upload = multer({
  limits: {
    fileSize: 5000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpes|png)$/)) {
      return cb(
        new Error(
          "picture format not matched , please upload jpg, jpes or png image"
        )
      );
    }
    cb(undefined, true);
  },
});

// function resizeAndRename(){
//     app.get('/api/images', async (req, res) => {
//         try {
//             const sharp = require('sharp')
//             let photo = path.join(__dirname, `../public/images/${req.query.filename}`)
//             sharp(photo).resize({ width: parseInt(req.query.width), height: parseInt(req.query.height) })
//             .toFile(path.join(__dirname, '../public/images/resized.png'))
//             res.send('done')

//         } catch (e) {
//             console.log({ error: e })
//         }
//     })
// }

module.exports = upload;
