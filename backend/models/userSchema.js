import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
// import ms from "ms";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Name Required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Please enter a valid email address"
    ],
  },
  phone: {
    type: String,
    required: [true, "phone number is Required"],
  },
  aboutMe: {
    type: String,
    required: [true, "About me Field is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must contain at least 8 characters"],
  },
  avater: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  resume: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },

  portfolioURL: {
    type: String,
    required: true,
  },
  githubURL: String,
  linkedinURL: String,
  twitterURL: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});
// For hashing password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//for compare hashing password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Check user is already exists
userSchema.index({ email: 1 }, { unique: true });

//generate web token
userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    // expiresIn: process.env.JWT_EXPIRES,
    expiresIn: "2d",
  });
};


//For reset password

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000 * 1000;
  return resetToken;
};

export const User = mongoose.model("User", userSchema);
