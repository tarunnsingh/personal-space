const GridFsStorage = require("multer-gridfs-storage");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const mongoose = require("mongoose");
const keys = require("./config/keys");

mongoose.connect(
  keys.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("MongoDB Connected");
    console.log();
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

module.exports = { upload, gfs };
