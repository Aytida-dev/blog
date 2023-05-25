const express = require("express");
// const mongoose = require("mongoose");
require("dotenv").config();
const { userModel } = require("../model/userModel");
const userRouter = express.Router();

const jwt = require("jsonwebtoken");
const { auth } = require("../middlewares/auth");


userRouter.get("/", (req, res) => {
  res.send({
    message: "user route",
  });
});

userRouter.post("/signup", async (req, res) => {
  try {
    const newUser = userModel(req.body);
    await newUser.save();
    res.send({
      message: "user signed up",
    });
  } catch (err) {
    if (err.code === 11000) {
      res.send({
        message: "User already exists",
      });
    } else {
      res.status(404).send({
        message: err.message,
      });
    }
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    let user = await userModel.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
      if (req.body.password === user.password) {
        res.send({
          message: "login successful",
          token: token,
          userDetail: user,
        });
      } else {
        res.send({
          message: "incorrect password",
        });
      }
    } else {
      res.send({
        message: "user does not exist",
      });
    }
  } catch (err) {
    res.send({
      message: err.message,
    });
  }
});

userRouter.get("/me", auth, async (req, res) => {
  try {
    res.send({
      message: "user fetched",
      user: req.user,
    });
  }
  catch (err) {
    res.status(400).send({
      message: err.message,
    });
  }
})

module.exports = { userRouter };

// "username":"ai",
//   "password":"123",
//   "email":"raj123",
//   "bio":"hii"
