const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const Users = require("../models/user");
const Products = require("../models/product");
const auth = require("../src/middlewares/auth");
const { upload, uploadWithCloud } = require("../src/middlewares/upload");
const userRouter = new express.Router();
// const mongoose = require('mongoose')
// const jwt = require('jsonwebtoken')
// const db = require('../src/db/sql')

function Singnup() {
  userRouter.post("/users", async (req, res) => {
    try {
      const user = new Users(req.body);
      const token = await user.generateAuthToken();
      await user.save();
      res.status(201).send({ user, token });
    } catch (e) {
      res.status(400).send(e);
    }
  });
}

Singnup();

function login() {
  userRouter.post("/login", async (req, res) => {
    try {
      const user = await Users.findUser(req.body.email, req.body.password);
      const token = await user.generateAuthToken();
      res.status(200).send({ user, token });
    } catch (e) {
      res.status(400).send(e);
    }
  });
}

login();

function logout() {
  userRouter.post("/logout", auth, async (req, res) => {
    try {
      // remove the requested token
      // token.token --> the counter.the token itself not _id
      req.user.tokens = req.user.tokens.filter((token) => {
        return token.token !== req.token;
      });
      await req.user.save();
      res.send();
    } catch (e) {
      res.status(500).send(e);
    }
  });
}

logout();

function logoutAll() {
  userRouter.post("/logoutAll", auth, async (req, res) => {
    try {
      req.user.tokens = [];
      await req.user.save();
      res.status(200).send();
    } catch (e) {
      res.status(500).send(e);
    }
  });
}

logoutAll();

function getProfile() {
  userRouter.get("/users/profile", auth, async (req, res) => {
    try {
      res.status(200).send(req.user);
    } catch (e) {
      res.status(500).send(e);
    }
  });
}

getProfile();

function deleteProfile() {
  userRouter.delete("/users/profile", auth, async (req, res) => {
    try {
      await Users.findByIdAndDelete(req.user._id);
      res.status(200).send();
    } catch (e) {
      res.status(500).send(e);
    }
  });
}

deleteProfile();

function updateProfile() {
  userRouter.patch("/users", auth, async (req, res) => {
    // const user = await Products.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true})

    const keys = Object.keys(req.body);
    const allowsUpdates = ["name", "email", "phoneNumber", "password"];
    //ckeck weather every key is exsited in allows array or not
    //every member in keys array must pass the exam
    // that it is existed in allow updates
    const valid = keys.every((update) => allowsUpdates.includes(update));
    if (!valid) {
      return res.status(500).send("invalid updates");
    }
    try {
      keys.forEach((update) => {
        req.user[update] = req.body[update];
      });
      await req.user.save();
      res.status(200).send(req.user);
    } catch (e) {
      res.status(400).send(e);
    }
  });
}
updateProfile();

// it may be upload.array('my str', 15 => num of photos)
function uploadProfilePic() {
  userRouter.post(
    "/profile/profilepicture",
    auth,
    upload.single("profilepicture"),
    async (req, res) => {
      const pic = await sharp(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();
      req.user.profile_picture = pic;
      await req.user.save();
      res.status(200).send();
    },
    (error, req, res, next) => {
      res.status(400).send(error.message);
    }
  );
}

uploadProfilePic();

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

// userRouter.get('/profile/profilepicture', auth, async (req, res) => {
//     try{
//         if(!req.user.profile_picture){
//             return res.status(404).send()
//         }
//         res.set('Content-Type', 'image/png')
//         res.status(200).send(req.user.profile_picture)
//     }catch(e){
//     res.status(400).send(e)
//     }
// })

function deleteProfilePicture() {
  userRouter.delete("/profile/profilepicture", auth, async (req, res) => {
    try {
      req.user.profile_picture = undefined;
      await req.user.save();
      await res.status(200).send(req.user);
    } catch (e) {
      res.status(500).send(e);
    }
  });
}

deleteProfilePicture();

function getProfilePic() {
  userRouter.get("/profile/profilepicture/:id", async (req, res) => {
    try {
      const user = await Users.findById(req.params.id);

      if (!user || !user.profile_picture) {
        throw new Error();
      }

      res.set("Content-Type", "image/png");
      res.status(200).send(user.profile_picture);
    } catch (e) {
      res.status(400).send(e);
    }
  });
}

getProfilePic();

function uploadmultiPic() {
  userRouter.post(
    "/uploadtest",
    auth,
    upload.single("profilepicture"),
    async (req, res) => {
      const photo = await sharp(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();
      req.user.photos = req.user.photos.concat({ photo });
      await req.user.save();
      res.status(200).json();
    },
    (error, req, res, next) => {
      res.status(400).send({ error: error.message });
    }
  );
}

uploadmultiPic();

function deleteSpecificPicture() {
  userRouter.delete("/deletetest/:id", auth, async (req, res) => {
    try {
      // delete all photos
      // req.user.photos.splice(0, req.user.photos.length)
      req.user.photos = req.user.photos.filter((photo) => {
        return photo._id.toString() !== req.params.id;
      });
      await req.user.save();
      await res.status(200).json(req.user.photos.length);
    } catch (e) {
      res.status(500).send(e);
    }
  });
}

deleteSpecificPicture();

module.exports = userRouter;
