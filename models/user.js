const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  hashedPassword: {
    type: String,
    required: true
  },
  created: { type: Date, default: Date.now },
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    delete returnedObject.hashedPassword;
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;

