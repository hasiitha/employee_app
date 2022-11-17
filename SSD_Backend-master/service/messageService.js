const MessageModel = require("../models/messageModel");
var MessageAuthenticate = require("../middleware/messageAuth");
var MsgValidation = require("../middleware/jwtValidation/msgValidation");
var EncryptionService = require("../service/encryptionService");

const createMessge = async (message, sender, encrypteMsg, request) => {
  return new Promise(async (resolve, reject) => {
    var encryptedMsg = EncryptionService(message);
    var encryptedSender = EncryptionService(sender);

    console.log(message, sender, encryptedMsg);

    const messagesDetails = new MessageModel({
      message: encryptedMsg,
      encryptedMsg: encrypteMsg,
      sender: encryptedSender,
    });

    if (MsgValidation(request)) {
      //Message authentication
      if (MessageAuthenticate(message, encrypteMsg)) {
        try {
          const message = await messagesDetails.save();
          resolve({
            status: 201,
            obj: message,
          });
        } catch (err) {
          reject({
            status: 400,
            obj: {
              code: 400,
              error: err.message,
            },
          });
        }
      } else {
        reject({
          status: 401,
          obj: {
            code: 401,
            error: "Message authentication failed",
          },
        });
      }
    } else {
      reject({
        status: 401,
        obj: {
          code: 401,
          error: "Permission not granted",
        },
      });
    }
  });
};

module.exports = createMessge;
