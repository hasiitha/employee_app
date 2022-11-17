const cryptojs = require("crypto-js");
require("dotenv").config();

function FileAuthenticate(originalMessage, encryptedMessage,file,encryptedFile) {
  //encrypt the original message
  var sendingTxt = cryptojs.enc.Utf8.parse(originalMessage);
  var key = cryptojs.enc.Utf8.parse("JaNdRgUkXp2s5v8y");
  var encrypted = cryptojs.AES.encrypt(sendingTxt, key, {
    mode: cryptojs.mode.ECB,
    padding: cryptojs.pad.ZeroPadding,
  });
  encrypted = encrypted.ciphertext.toString(cryptojs.enc.Hex);
  var encryptedTest = encrypted;

  var sendingFile = cryptojs.enc.Utf8.parse(file);
//   var key = cryptojs.enc.Utf8.parse("JaNdRgUkXp2s5v8y");
  var encryptedFileN = cryptojs.AES.encrypt(sendingFile, key, {
    mode: cryptojs.mode.ECB,
    padding: cryptojs.pad.ZeroPadding,
  });
  encryptedFileN = encryptedFileN.ciphertext.toString(cryptojs.enc.Hex);
  var encryptedTestFile = encryptedFileN;

  console.log("Org enc ", encryptedMessage);
  console.log("After enc ", encryptedTest);
  console.log("Org enc File", encryptedFile);
  console.log("After enc File", encryptedTestFile);
  if (encryptedTest === encryptedMessage && encryptedTestFile === encryptedFile) {
    return true;
  } else {
    return false;
  }
}

module.exports = FileAuthenticate;
