const router = require("express").Router();
const auth = require("../src/middlewares/auth");
const { 
  signUp,
  login,
  getProfile,
  deleteProfile,
  updateProfile,
  uploadProfilePic
} = require("../controllers/user")

router.post("/", signUp)
router.post("/login", login)
router.route("/").post(signUp).get(auth, getProfile)
.put(auth, updateProfile).delete(auth, deleteProfile)
router.post("/upload", uploadProfilePic)

module.exports = router


// function uploadProfilePicWithCloud() {
//   userRouter.post("/profile/profilepicturewithcloud",auth,uploadWithCloud.single("profilepicture"),async (req, res) => {
//   const cloudinary = require("cloudinary").v2;

//   cloudinary.config({
//     cloud_name: process.env.cloud_name,
//     api_key: process.env.api_key,
//     api_secret: process.env.api_secret,
//   });

//   cloudinary.uploader
//     .upload(req.file.path)
//     .then((d) => console.log(d))
//     .catch((e) => console.log(e));
//   res.status(200).send("upload done");
//     },
//     (error, req, res, next) => {
//       res.status(400).send(error.message);
//     }
//   );
// }

// uploadProfilePicWithCloud();