const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const keys = require("./keys");
const cookieParser = require("cookie-parser");
const path = require("path");

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || keys.MONGO_URI;

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(morgan("tiny"));

mongoose.connect(
  MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("DB Connected");
  }
);

const userRouter = require("./routes/User");
app.use("/user", userRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("Server started on port ", PORT);
});
