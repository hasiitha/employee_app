require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
var cors = require("cors");
const bodyParser = require("body-parser");
const https = require("https");
const fs = require("fs");
require("dotenv").config();

const options = {
  key: fs.readFileSync("./Certificates/localhost-key.pem"), // Replace with the path to your key
  cert: fs.readFileSync("./Certificates/localhost.pem"), // Replace with the path to your certificate
};

app.use(cors());
app.use(bodyParser.json({ extended: false }));

let PORT = process.env.PORT;

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", (error) => console.log("Connected to DB.."));

app.use(cors());
app.use(express.json());

//setting routes
const userRouter = require("./routes/users");
app.use("/users", userRouter);

const messageRouter = require("./routes/messages");
app.use("/messages", messageRouter);

const fileRouter = require("./routes/files");
app.use("/files", fileRouter);

let server = app.listen(PORT, () => {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Server Started on port ", port, host);
});

module.exports = server;
