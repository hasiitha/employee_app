const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
var UserRegistrationValidation = require("../middleware/jwtValidation/registrationValidation");
const { userLoging, UserRegistration } = require("../service/userService");

//login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = userLoging(username, password);

    if (result.status === 200) {
      res.json(result.obj);
    } else {
      res.status(400).json({ message: "invalid" });
    }
  } catch (err) {
    res.status(400).json({ message: "invalid" });
  }

  // res.json({message: 'Login User'})
});

//create soffice user
router.post("/create", async (req, res) => {
  //jwt validation
  try {
    if (UserRegistrationValidation(req)) {
      const { username, password, role } = req.body;

      const result = UserRegistration(username, password, role);
      if (result.status === 201) {
        res.json(result.obj);
      } else {
        res.status(400).json({ message: "invalid" });
      }
    } else {
      res.status(401).json({
        code: 401,
        error: "Permission not granted",
      });
    }
  } catch (err) {
    res.status(400).json({ message: "invalid" });
  }
});

module.exports = router;
