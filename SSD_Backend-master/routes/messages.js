const express = require("express");
const router = express.Router();
const Message = require("../models/messageModel");
var MessageAuthenticate = require("../middleware/messageAuth");
var MsgValidation = require("../middleware/jwtValidation/msgValidation");
var EncryptionService = require("../service/encryptionService");
const createMessge = require("../service/messageService");

router.post("/messages", async (req, res) => {
  //encrypt original payload
  const { encryptedMsg, message, sender } = req.body;

  try {
    const result = createMessge(message, sender, encryptedMsg);

    if (result.status === 201) {
      res.json(result.obj);
    } else if (result.status === 401) {
      res.status(401).json({ message: "invalid" });
    } else {
      res.status(400).json({ message: "invalid" });
    }
  } catch (err) {
    res.status(400).json({ message: "invalid" });
  }
});

module.exports = router;
