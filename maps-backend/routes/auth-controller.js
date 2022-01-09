const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcrypt-inzi");
const jwt = require("jsonwebtoken");
const { userModel } = require("../model/index");
const env = require("../config/env");

const app = express.Router();

app.post("/signup", (req, res) => {
  const { error } = validateUser(req.body);
  console.log(req);
  if (error) return res.status(400).send(error.details[0].message);
  userModel.findOne({ email: req.body.email }, (err, data) => {
    if (!err && !data) {
      bcrypt.stringToHash(req.body.password).then((hashPassword) => {
        var newUser = new userModel({
          name: req.body.name,
          email: req.body.email,
          password: hashPassword,
          role: "user",
        });

        newUser.save((err, data) => {
          if (!err) {
            console.log("user created");
            res.status(200).send({
              message: "Signed up succesfully",
            });
          } else {
            console.log("Could not save due to: " + err);
            res.status(500).send("error is =>>" + err);
          }
        });
      });
    } else if (err) {
      res.status(500).send({
        message: "Database error",
      });
    } else {
      res.status(409).send({
        message: "User already exists",
      });
    }
  });
});

app.post("/login", (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(403).send(`
            please send email and password in json body
            e.g:
            {
            email : "abc@gmail.com",
            password: "1234",
            }
         `);
    return;
  }
  userModel.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      res.status(503).send({
        message: "an error occured " + JSON.stringify(err),
      });
    } else if (!user && req.body.googleLogin) {
      var newUser = new userModel({
        name: req.body.name,
        email: req.body.email,
        password: "dummy",
        role: "user",
      });
      newUser.save((err, data) => {
        if (!err) {
          var token = jwt.sign(
            {
              // id: user._id,
              name: req.body.name,
              email: req.body.email,
              username: req.body.name,
              role: "user",
            },
            env.SERVER_SECRET
          );

          res.cookie("jToken", token, {
            maxAge: 86_400_000,
            httpOnly: true,
          });

          return res.status(200).send({
            message: "signed in succesfully",
            user: {
              name: req.body.name,
              email: req.body.email,
              username: req.body.name,
              role: "user",
            },
            token: token,
          });
        } else {
          return res.status(400).send({
            message: "An error occured",
          });
        }
      });
    } else if (user) {
      bcrypt.varifyHash(req.body.password, user.password).then((isMatched) => {
        if (isMatched || req.body.googleLogin) {
          var token = jwt.sign(
            {
              id: user._id,
              email: user.email,
              username: user.name,
              password: user.password,
              role: user.role,
              name: user.name,
            },
            env.SERVER_SECRET
          );

          res.cookie("jToken", token, {
            maxAge: 86_400_000,
            httpOnly: true,
          });

          res.status(200).send({
            message: "signed in succesfully",
            user: {
              email: user.email,
              username: user.name,
              role: user.role,
            },
            token: token,
          });
        } else {
          res.status(409).send({
            message: "Password not matched",
          });
        }
      });
    } else {
      res.status(409).send({
        message: "User not found",
      });
    }
  });
});

const validateUser = (req) => {
  const schema = Joi.object({
    name: Joi.string().required().min(2),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
  });
  const { error, value } = schema.validate(req);
  return { error, value };
};

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

module.exports = app;
