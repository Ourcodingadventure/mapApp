const mongoose = require("mongoose");
const env = require("../config/env");

mongoose.connect(env.dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("disconnected", () => {
  console.log("MONGODB disconnected");
  process.exit(1);
});

mongoose.connection.on("error", (err) => {
  console.log("MongoDB disconnected due to : " + err);
  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("App is terminating");
  mongoose.connection.close(() => {
    console.log("MONGODB disconnected");
    process.exit(0);
  });
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,

  profilePicture: String,
});

const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  createdOn: { type: Date, default: Date.now },
});

const complainSchema = mongoose.Schema({
  email: String,

  name: String,
  location: String,
  image: String,
  remarks: String,
  status: String,
  phoneNumber: String,
  altitude: Number,
  latitude: Number,
  longitude: Number,
  LocationName: String,
  feedback: String,
  issueName: String,
  createdOn: { type: Date, default: Date.now },
});

const organizationSchema = mongoose.Schema({
  name: String,
  location: String,
  image: String,
});

const userModel = mongoose.model("user", userSchema);
const otpModel = mongoose.model("otp", otpSchema);
const complainModel = mongoose.model("complain", complainSchema);
const organizationModel = mongoose.model("organization", organizationSchema);

module.exports = {
  userModel,
  //   otpModel,
  complainModel,
  // organizationModel,
};
// todo otp model organization model delete
