const express = require("express");
const morgan = require("morgan");
const http = require("http");
const cors = require("cors");
const app = express();
const env = require("./config/env");
var cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
var authController = require("./routes/auth-controller");
const path = require("path");
const bcrypt = require("bcrypt-inzi");
const { userModel, complainModel } = require("./model/index");

const multer = require("multer");

const storage = multer.diskStorage({
  // https://www.npmjs.com/package/multer#diskstorage
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      `${new Date().getTime()}-${file.filename}.${file.mimetype.split("/")[1]}`
    );
  },
});
var upload = multer({ storage: storage });

var socketIo = require("socket.io");
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
var io = socketIo(server);

app.use("/", express.static(path.resolve(path.join(__dirname, "./uploads"))));

io.on("connection", () => {
  console.log("socket connected");
});

app.use(morgan("dev"));
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authController);

app.use(function (req, res, next) {
  if (!req.cookies.jToken) {
    res.status(401).send("include http-only credentials with every request");
    return;
  }
  jwt.verify(
    req.cookies.jToken,
    env.SERVER_SECRET,
    function (err, decodedData) {
      if (!err) {
        const issueDate = decodedData.iat * 1000; // 1000 miliseconds because in js ms is in 16 digits
        const nowDate = new Date().getTime();
        const diff = nowDate - issueDate; // 86400,000

        if (diff > 999999999999999999) {
          // expire after 5 min (in milis)
          res.clearCookie("jToken");
          res.status(401).send("token expired");
        } else {
          var token = jwt.sign(
            {
              id: decodedData.id,
              username: decodedData.name,
              email: decodedData.email,
              role: decodedData.role,
              name: decodedData.name,
              // phoneNumber: decodedData.phoneNumber,
              // gender: decodedData.gender,
              // age: decodedData.age,
            },
            env.SERVER_SECRET
          );
          res.cookie("jToken", token, {
            maxAge: 86_400_000,
            httpOnly: true,
          });
          req.body.jToken = decodedData;
          req.headers.jToken = decodedData;
          next();
        }
      } else {
        res.status(401).send("invalid token");
      }
    }
  );
});

app.get("/profile", (req, res, next) => {
  userModel.findById(
    req.body.jToken.id,
    "name email role",
    function (err, doc) {
      if (!err) {
        res.send({
          profile: doc,
        });
      } else {
        res.status(500).send({
          message: "server error",
        });
      }
    }
  );
});

app.post("/complain", upload.any(), (req, res, next) => {
  let body = JSON.parse(req.body.dataa);
  userModel.findOne({ email: req.headers.jToken.email }, (err, user) => {
    if (!err) {
      complainModel
        .create({
          email: req.headers.jToken.email,
          name: body.anonymous ? "anonymous" : req.headers.jToken.name,

          locationText: body.locationText,
          image: req.files[0]?.filename,
          remarks: body?.message,
          status: "pending",
          latitude: body?.latitude,
          longitude: body?.longitude,
          altitude: body?.altitude,
          feedback: "null",
          issueName: body.category.name,
          // phoneNumber: req.body.jToken.phoneNumber,
        })
        .then((complain) => {
          io.emit("complain", {
            complain,
          });
          return res.status(200).send({
            message: "Your complain has been placed successfully",
            complain: complain,
          });
        })
        .catch((err) => {
          console.log("err:", err);
          res.status(500).send({
            message: "an error occured",
          });
        });
    }
  });
});

app.get("/complain", (req, res) => {
  userModel.findOne({ email: req.body.jToken.email }, (err, user) => {
    if (user) {
      complainModel.find({ email: req.body.jToken.email }, (err, complain) => {
        if (!err) {
          return res.status(200).send({
            complain,
            message: "complain got succesfully",
          });
        }
      });
    } else {
      return res.status(403).send({
        message: "no user",
      });
    }
  });
});

app.get("/all-complains", (req, res) => {
  complainModel.find({}, (err, complain) => {
    if (!err) {
      return res.status(200).send({
        message: "All Complains feteched",
        complain,
      });
    } else {
      return res.status(400).send({
        message: "Error occoured",
      });
    }
  });
});

app.get("/my-complains", (req, res) => {
  complainModel.find({ email: req.body.jToken.email }, (err, complain) => {
    if (!err) {
      return res.status(200).send({
        message: "All Complains feteched",
        complain,
      });
    } else {
      return res.status(400).send({
        message: "Error occoured",
      });
    }
  });
});

app.post("/update-complain", (req, res) => {
  complainModel.findById(req.body.id, (err, complain) => {
    if (complain) {
      complain.updateOne({ status: req.body.status }, (err, updated) => {
        if (!err) {
          io.emit("complain", "complainupdated");
          let modifiedComplain = { ...complain, status: req.body.status };
          io.emit("notification", {
            updated: modifiedComplain,
            complain,
          });
          res.status(200).send({
            message: "complain updated successfully",
          });
        } else {
          res.status(500).send({
            message: "server error",
          });
        }
      });
    } else {
      return res.status(403).send({
        message: "complain not found",
      });
    }
  });
});

app.post("/feedback-complain", (req, res) => {
  if (!req.body.id || !req.body.feedback) {
    res.send(`
    send following in json body:
    e.g:
    {
        "id" :"12323"
        "feedback":"complaint feedback"
    }
    `);
  }

  complainModel.findById(req.body.id, (err, complain) => {
    if (complain) {
      complain.updateOne({ feedback: req.body.feedback }, (err, updated) => {
        if (!err) {
          io.emit("complain", "complainupdated");
          res.status(200).send({
            message: "complain updated successfully",
          });
        } else {
          res.status(500).send({
            message: "server error",
          });
        }
      });
    } else {
      return res.status(403).send({
        message: "complain not found",
      });
    }
  });
});

app.post("/update-password", (req, res, next) => {
  if (!req.body.password || !req.body.newPassword) {
    res.send(`
        please send following in json body
        e.g
        "password" : "xxx",
        newPassword : "xxxx"
        `);
    return;
  }
  console.log("req", req.body);
  userModel.findOne({ email: req.body.jToken.email }, (err, user) => {
    if (!err) {
      bcrypt.varifyHash(req.body.password, user.password).then((isMatched) => {
        console.log("userpass,", isMatched);
        if (isMatched) {
          bcrypt.stringToHash(req.body.newPassword).then((hashPassword) => {
            user.updateOne({ password: hashPassword }, (err, updated) => {
              if (!err) {
                res.status(200).send({
                  message: "password updated successfully",
                });
              } else {
                res.status(500).send({
                  message: "server error",
                });
              }
            });
          });
        } else {
          res.status(403).send({
            message: `Old password didn't match`,
          });
        }
      });
    } else {
      res.status(501).send({
        message: "server error",
      });
    }
  });
});

app.post("/delete-complain", (req, res, next) => {
  if (!req.body.id) {
    return res.status(403).send(`
            please send email and password in json body
            e.g:
            {
                id: '123465'
            }
         `);
  }
  complainModel.findOne(
    { _id: req.body.id, email: req.body.jToken.email },
    (err, complain) => {
      if (!err) {
        complain.remove();
        io.emit("complain", "");
        return res.status(200).send({
          message: "complain deleted",
        });
      } else {
        res.status(403).send({
          message: "complain not found",
        });
      }
    }
  );
});

app.post("/logout", (req, res) => {
  res.clearCookie("jToken");
  res.send({
    message: "logout succesfully",
  });
});

server.listen(PORT, () => {
  console.log("server is listetning on PORT : " + PORT);
});
