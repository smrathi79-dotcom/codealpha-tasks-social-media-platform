const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

console.log("🔥 Auth routes file loaded successfully!");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    console.log("Register Error:", err);
    res.status(500).json(err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  console.log("⚡ Login API hit received!");
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json("User not found");
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).json("Wrong password");
    }

    res.status(200).json(user);
  } catch (err) {
    console.log("Login Error Details:", err); // <-- Ithu exact error-a terminal-la print pannum
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;