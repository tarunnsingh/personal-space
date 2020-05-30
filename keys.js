let MONGODB_URI = "";
let JWT_SECRET_KEY = "";

if (process.env.NODE_ENV === "production") {
  MONGODB_URI = process.env.MONGODB_URI;
  JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
} else {
  const keys = require("./localkeys.js");
  MONGODB_URI = keys.MONGODB_URI;
  JWT_SECRET_KEY = keys.JWT_SECRET_KEY;
}

module.exports = { MONGODB_URI, JWT_SECRET_KEY };
