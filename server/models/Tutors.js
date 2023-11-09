const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const tutorSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email",
    ],
  },
  skill: [String],
  rate: {
    type: Number,
  },
  password: { type: String, required: true },
});

// Custom validator to check the password requirements
tutorSchema.path("password").validate(function (value) {
  if (value.length < 8) {
    throw new Error("Password must be at least 8 characters long.");
  }

  if (!/[A-Z]/.test(value)) {
    throw new Error("Password must contain at least one uppercase letter.");
  }

  if (!/[0-9]/.test(value)) {
    throw new Error("Password must contain at least one number.");
  }

  return true;
});

// Pre-save hook to hash the password before saving
tutorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to check the password
tutorSchema.methods.checkPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Tutors = model("Tutors", tutorSchema);

module.exports = Tutors;
