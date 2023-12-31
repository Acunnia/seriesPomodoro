const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, minLength: 3 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
    bio: { type: String },
    registerDate: { type: Date, default: Date.now },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reply" }],
    topics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
    isBanned: { type: Boolean, default: false },
  },
  { collection: "users" }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas cifradas
userSchema.methods.comparePassword = async function (_password) {
  return bcrypt.compare(_password.toString(), this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
