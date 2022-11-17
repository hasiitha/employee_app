const FileModel = require("../models/fileModel");
var FileAuthenticate = require("../middleware/fileAuth");
var FileValidation = require("../middleware/jwtValidation/fileValidation");
var EncryptionService = require("../service/encryptionService");

const createFile = async (message, sender, encryptedMsg, request,file,encryptedFiles) => {
  var encryptedMsg = EncryptionService(message);
  var encryptedFile = EncryptionService(file);
  var encryptedSender = EncryptionService(sender);

  const fileDetails = new FileModel({
    message: encryptedMsg,
    encryptedMsg: encryptedMsg,
    file: encryptedFile,
    encryptedFile: encryptedFiles,
    sender: encryptedSender,
  });

  if (FileValidation(request)) {
    //Message authentication
    if (FileAuthenticate(message, encryptedMsg,file,encryptedFiles)) {
      try {
        const message = await fileDetails.save();
        return {
          status: 201,
          obj: message,
        };
      } catch (err) {
        return {
          status: 400,
          obj: {
            code: 400,
            error: err.message,
          },
        };
      }
    } else {
      return {
        status: 401,
        obj: {
          code: 401,
          error: "File authentication failed",
        },
      };
    }
  } else {
    return {
      status: 401,
      obj: {
        code: 401,
        error: "Permission not granted",
      },
    };
  }
};

module.exports = createFile;
