const MessageModel = require("../models/messageModel");
var MessageAuthenticate = require("../middleware/messageAuth");
var MsgValidation = require("../middleware/jwtValidation/msgValidation");
var EncryptionService = require("../service/encryptionService");

const createMessge = async (message, sender, encryptedMsg, request) => {
  var encryptedMsg = EncryptionService(message);
  var encryptedSender = EncryptionService(sender);

  const messagesDetails = new MessageModel({
    message: encryptedMsg,
    encryptedMsg: encryptedMsg,
    sender: encryptedSender,
  });

  if (MsgValidation(request)) {
    //Message authentication
    if (MessageAuthenticate(message, encryptedMsg)) {
      try {
        const message = await messagesDetails.save();
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
          error: "Message authentication failed",
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

module.exports = createMessge;
