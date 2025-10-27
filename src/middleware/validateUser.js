// const bcrypt = require("bcryptjs");
const { Person, Post } = require("../models/models");

const validateUserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: `email and password required` });

    const user = await Person.findOne({ email });
    if (!user) return res.status(401).json({ message: `invalid credential` });
    const passwordMatch = await user.matchPassword(password);
    if (!passwordMatch)
      return res.status(401).json({ message: "invalid credential" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ message: `error occured ${err.message}` });
  }
};

const validateUserSignUp = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username)
      return res
        .status(400)
        .json({ message: `username,email and password  required` });
    const user = await Person.findOne({ email });
    if (user) return res.status(409).json({ message: "user already existed" });

    next();
  } catch (err) {
    return res.status(500).json({ message: `error occured ${err}` });
  }
}; 

module.exports = { validateUserLogin, validateUserSignUp };