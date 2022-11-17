const express = require('express');
const router = express.Router();
const createFile = require("../service/fileService");

router.post("/files", async (req, res) => {
  //encrypt original payload
  const { encryptedMsg, message, encryptedFile, file,sender } = req.body;

  try {
    const result = createFile(message, sender, encryptedMsg,file,encryptedFile);

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