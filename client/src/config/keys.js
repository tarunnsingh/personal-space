if (process.env.NODE_ENV === "production") {
  module.exports = {
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    MONGODB_URI: process.env.MONGODB_URI,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  };
} else {
  const localkeys = require("./localkeys");
  module.exports = {
    JWT_SECRET_KEY: localkeys.JWT_SECRET_KEY,
    MONGODB_URI: localkeys.MONGODB_URI,
    GOOGLE_CLIENT_ID: localkeys.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: localkeys.GOOGLE_CLIENT_SECRET,
  };
}
