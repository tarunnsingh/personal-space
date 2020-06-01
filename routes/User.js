const express = require("express");
const userRouter = express.Router();
const passport = require("passport");
const passportCongfig = require("../passport");
const JWT = require("jsonwebtoken");
const User = require("../models/User");
const Todo = require("../models/Todo");
const keys = require("../config/keys");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(keys.GOOGLE_CLIENT_ID);

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

userRouter.post("/register", (req, res) => {
  const { username, password, role, originalName } = req.body;
  User.findOne({ username }, (err, user) => {
    if (err)
      res
        .status(500)
        .json({ message: { msgBody: "An error occured", msgError: true } });
    if (user)
      res
        .status(400)
        .json({ message: { msgBody: "Username Taken", msgError: true } });
    else {
      const newUser = new User({ username, password, role, originalName });
      newUser.save((err) => {
        if (err)
          res
            .status(500)
            .json({ message: { msgBody: "An error occured", msgError: true } });
        else
          res.status(201).json({
            message: {
              msgBody: "Account succesfully created",
              msgError: false,
            },
          });
      });
    }
  });
});

userRouter.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    if (req.isAuthenticated()) {
      const { _id, username, role, originalName } = req.user;
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
            res.status(400).json({
              isAuthenticated: false,
              user: null,
              message: {
                msgBody: "Some error occured while connecting to Google.",
              },
              msgError: true,
            });
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
