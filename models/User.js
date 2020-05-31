const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 6,
    max: 15,
  },
  password: {
    type: String,
    min: 6,
    required: true,
  },
  originalName: {
    type: String,
    min: 6,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
  },
  coverPhotoUrl: {
    type: String,
  },
  userIntro: {
    type: String,
    max: 2000,
  },
  createdAt: {
    type: Date,
  },
  lastUpdated: {
    type: Date,
  },
  todos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Todo",
    },
  ],
});

// Mongoose PRE Hook, this code executes right before we save. We need to hash the password before we save it to DB.
UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  bcrypt.hash(this.password, 10, (err, passwordHash) => {
    if (err) return next(err);
    this.password = passwordHash;
    next();
  });
});

UserSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) return cb(err);
    else {
      if (!isMatch) return cb(null, isMatch);
      return cb(null, this);
    }
  });
};

module.exports = mongoose.model("User", UserSchema);
