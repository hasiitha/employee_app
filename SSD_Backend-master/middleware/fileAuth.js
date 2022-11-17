const cryptojs = require("crypto-js");
require("dotenv").config();

function FileAuthenticate(file,encryptedFile) {
  //encrypt the original message
  var sendingFile = cryptojs.enc.Utf8.parse(file);
  var key = cryptojs.enc.Utf8.parse("JaNdRgUkXp2s5v8y");
  var encryptedFileN = cryptojs.AES.encrypt(sendingFile, key, {
    mode: cryptojs.mode.ECB,
    padding: cryptojs.pad.ZeroPadding,
  });
  encryptedFileN = encryptedFileN.ciphertext.toString(cryptojs.enc.Hex);
  var encryptedTestFile = encryptedFileN;
  console.log("Org enc File", encryptedFile);
  console.log("After enc File", encryptedTestFile);
  if (encryptedTestFile === encryptedFile) {
    return true;
  } else {
    return false;
  }
}

module.exports = FileAuthenticate;
