const express = require("express");
const router = express.Router();
const createMessge = require("../service/messageService");

router.post("/messages", async (req, res) => {
  //encrypt original payload
  const { encryptedMsg, message, sender } = req.body;

  try {
    const result = await createMessge(message, sender, encryptedMsg, req);

    if (result.status === 201) {
      res.status(201).json(result.obj);
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
