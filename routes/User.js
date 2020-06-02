const express = require("express");
const userRouter = express.Router();
const passport = require("passport");
const passportCongfig = require("../passport");
const JWT = require("jsonwebtoken");
const User = require("../models/User");
const Todo = require("../models/Todo");
const keys = require("../config/keys");
const responseHandler = require("./Errors");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(keys.GOOGLE_CLIENT_ID);

const GridFsStorage = require("multer-gridfs-storage");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const mongoose = require("mongoose");

mongoose.connect(
  keys.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("MongoDB Connected");
  }
);

const conn = mongoose.connection;

let gfs;
conn.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "songs",
  });
});

const storage = new GridFsStorage({
  url: keys.MONGODB_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "songs",
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({
  storage,
});

const signedToken = (userID) => {
  return JWT.sign(
    {
      iss: "TarunSingh",
      sub: userID,
    },
    keys.JWT_SECRET_KEY,
    { expiresIn: "1h" }
  );
};

userRouter.get("/getsong", (req, res) => {
  if (!gfs) {
    console.log("DB ERROR!");
    return res.status(501).json({
      message: { msgBody: "Could not get Songs, DB Error!" },
      msgError: true,
    });
  }
  gfs.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      res
        .status(404)
        .json({ message: { msgBody: "Songs not Found!" }, msgError: true });
    } else {
      const f = files
        .map((file) => {
          if (file.contentType === "audio/mpeg") {
            file.isSong = true;
            file.isImage = false;
          } else if (
            file.contentType === "image/jpeg" ||
            file.contentType === "image/png"
          ) {
            file.isImage = true;
            file.isSong = false;
          }
          return file;
        })
        .sort((a, b) => {
          return (
            new Date(b["uploadDate"]).getTime() -
            new Date(a["uploadDate"]).getTime()
          );
        });

      res.sendFile({ files: f });
    }
  });
});

userRouter.post(
  "/uploadsong",
  [
    passport.authenticate("jwt", { session: false }),
    upload.single("singlesong"),
  ],
  (req, res) => {
    console.log(
      "UPLOADED SONGS: ",
      res.req.file.originalname,
      res.req.file.originalName,
      res.req.file.size,
      res.req.file.uploadDate
    );
    res.status(200).json({
      message: { msgBody: "File uploaded Successfully!", msgError: false },
      info: {
        fileName: res.req.file.originalName,
        fileSize: res.req.file.size,
        fileUploadDate: res.req.file.uploadDate,
        fileType: res.req.file.contentType,
      },
    });
  }
);

userRouter.post("/register", (req, res) => {
  const { username, password, role, originalName, email } = req.body;
  User.findOne({ username }, (err, user) => {
    if (err) responseHandler(err, null, null, null, res);
    if (user) responseHandler(null, null, user, "usernameTaken", res);
    else {
      const newUser = new User({
        username,
        password,
        role,
        originalName,
        email,
      });
      newUser.save((err) => {
        if (err) responseHandler(err, "userOnSave", null, null, res);
        else responseHandler(null, null, null, "createdAcc", res);
      });
    }
  });
});

userRouter.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    if (req.isAuthenticated()) {
      const { _id, username, role, originalName, email } = req.user;
      const token = signedToken(_id);
      res.cookie("access_token", token, { httpOnly: true, sameSite: true });
      res.status(200).json({
        isAuthenticated: true,
        user: { username, role, originalName },
        message: { msgBody: "Login Succesful", msgError: false },
      });
    }
  }
);

userRouter.post("/googlelogin", (req, res) => {
  const { profileObj, tokenObj } = req.body;

  client
    .verifyIdToken({
      idToken: tokenObj.id_token,
      audience: keys.GOOGLE_CLIENT_ID,
    })
    .then((response) => {
      const { name, picture, email_verified, email } = response.payload;
      if (email_verified) {
        User.findOne({ email }).exec((err, user) => {
          if (err) {
            responseHandler(err, null, null, null, res);
          } else {
            if (user) {
              const {
                _id,
                username,
                role,
                originalName,
                coverPhotoUrl,
                userIntro,
              } = user;
              const token = signedToken(_id);
              res.cookie("access_token", token, {
                httpOnly: true,
                sameSite: true,
              });
              res.status(200).json({
                isAuthenticated: true,
                user: {
                  username,
                  role,
                  originalName,
                  coverPhotoUrl,
                  userIntro,
                },
                message: { msgBody: "Login Succesful", msgError: false },
              });
            } else {
              let password = email + tokenObj.id_token;
              let username = name.toString().toLowerCase().replace(/ /g, "");
              const newUser = new User({
                username,
                password,
                originalName: name,
                coverPhotoUrl: picture,
                email: email,
                role: "user",
              });
              newUser.save((err, creatdeduser) => {
                if (err) {
                  res.status(500).json({
                    message: {
                      msgBody: "An error occured on Saving user to DB",
                      msgError: true,
                    },
                  });
                } else {
                  const { _id } = creatdeduser;
                  const token = signedToken(_id);
                  res.cookie("access_token", token, {
                    httpOnly: true,
                    sameSite: true,
                  });
                  const {
                    username,
                    role,
                    originalName,
                    coverPhotoUrl,
                    userIntro,
                  } = creatdeduser;
                  res.status(200).json({
                    isAuthenticated: true,
                    user: {
                      username,
                      role,
                      originalName,
                      coverPhotoUrl,
                      userIntro,
                    },
                    message: { msgBody: "Login Succesful", msgError: false },
                  });
                }
              });
            }
          }
        });
      }
    });
});

userRouter.get(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.clearCookie("access_token");
    res.json({ user: { username: "", role: "" }, success: true });
  }
);

userRouter.post(
  "/todo",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const todo = new Todo(req.body);
    todo.save((err) => {
      if (err)
        res
          .status(500)
          .json({ message: { msgBody: "An error occured", msgError: true } });
      else {
        req.user.todos.push(todo);
        req.user.save((err) => {
          if (err)
            res.status(500).json({
              message: { msgBody: "An error occured", msgError: true },
            });
          else {
            res.status(200).json({
              message: { msgBody: "Succesfully added Todo", msgError: false },
            });
          }
        });
      }
    });
  }
);

userRouter.delete(
  "/todo/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findById(req.user._id, (err, document) => {
      if (err) {
        res
          .status(400)
          .json({ message: { msgBody: "User not found", msgError: true } });
      } else {
        document.todos = document.todos.filter((todo) => {
          if (todo._id !== req.params.id) return todo;
        });
        document.save();
        Todo.findByIdAndDelete(req.params.id, (err, document) => {
          if (err) {
            res
              .status(400)
              .json({ message: { msgBody: "User not found", msgError: true } });
          } else {
            res.status(200).json({
              message: { msgBody: "Successfully Deleted", msgError: false },
            });
          }
        });
      }
    });
  }
);

userRouter.get(
  "/todos",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findById(req.user._id)
      .populate("todos")
      .exec((err, document) => {
        if (err) {
          res
            .status(500)
            .json({ message: { msgBody: "An error occured", msgError: true } });
        } else {
          res.status(200).json({ todos: document.todos, authenticated: true });
        }
      });
  }
);

userRouter.get(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role === "admin") {
      res
        .status(200)
        .json({ message: { msgBody: "You are an admin.", msgError: false } });
    } else {
      res.status(401).json({
        message: { msgBody: "You are an not an admin.", msgError: true },
      });
    }
  }
);

userRouter.post(
  "/updateIntro",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // console.log(req.body);
    User.findByIdAndUpdate(
      req.user._id,
      { userIntro: req.body.introText },
      { new: true },
      (err, document) => {
        if (err) {
          return res
            .status(500)
            .json({ message: { msgBody: "An error occured", msgError: true } });
        } else {
          const { username, role, originalName, userIntro } = document;
          return res.status(200).json({
            isAuthenticated: true,
            user: { username, role, originalName, userIntro },
            message: { msgBody: "Intro Updated Succesfully", msgError: false },
          });
        }
      }
    );
  }
);

userRouter.get(
  "/authenticated",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const {
      username,
      role,
      originalName,
      userIntro,
      createdAt,
      lastUpdated,
      coverPhotoUrl,
    } = req.user;
    res.status(200).json({
      isAuthenticated: true,
      user: {
        username,
        role,
        originalName,
        userIntro,
        createdAt,
        lastUpdated,
        coverPhotoUrl,
      },
    });
  }
);

module.exports = userRouter;
