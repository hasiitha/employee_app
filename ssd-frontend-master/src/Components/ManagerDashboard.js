import React, { Component } from "react";
import axios from "axios";
import { FormControl, Button, TextField } from "@mui/material";
import CryptoJS from "crypto-js";

class ManagerDashboard extends Component {
  constructor(props) {
    const user = localStorage.getItem("username");
    super(props);

    this.state = {
      message: "",
      encryptedMsg: "",
      sender: user,
      file: "",
    };
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  handlerEncrypt = (data) => {
    let sendingTxt = CryptoJS.enc.Utf8.parse(data);
    let key = CryptoJS.enc.Utf8.parse("JaNdRgUkXp2s5v8y");
    let encrypted = CryptoJS.AES.encrypt(sendingTxt, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.ZeroPadding,
    });
    encrypted = encrypted.ciphertext.toString(CryptoJS.enc.Hex);
    //encrypted string to send

    console.log("Encrypted message : ", encrypted);
    return encrypted;
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    console.log("hadler submit fired");

    // let messagetoEncrypt = this.state.message;
    let filetoEncrypt = this.state.file;

    // console.log(messagetoEncrypt, " before encrypt message");
    console.log(filetoEncrypt, "before encrypt file");

    // let encrypted_message = this.handlerEncrypt(messagetoEncrypt);
    let encrypted_file = this.handlerEncrypt(filetoEncrypt);

    // console.log(encrypted_message, " after encrypt message");
    console.log(encrypted_file, "after encrypt file");

    const jwt = localStorage.getItem("jwtToken");

    let toSendObj = {
      // message: messagetoEncrypt,
      // encryptedMsg: encrypted_message,
      file: filetoEncrypt,
      encryptedfile: encrypted_file,
      sender: this.state.sender,
    };

    // var sendingTxt = CryptoJS.enc.Utf8.parse(this.state.message);
    // var key = CryptoJS.enc.Utf8.parse("JaNdRgUkXp2s5v8y");
    // var encrypted = CryptoJS.AES.encrypt(sendingTxt, key, {
    //   mode: CryptoJS.mode.ECB,
    //   padding: CryptoJS.pad.ZeroPadding,
    // });
    // encrypted = encrypted.ciphertext.toString(CryptoJS.enc.Hex);
    // this.state.encryptedMsg = encrypted;
    // console.log("Encrypted message : ", this.state.encryptedMsg);
    axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
    axios
      .post("http://localhost:4000/files/files", toSendObj, {})
      .then((response) => {
        console.log(response);
        alert("File sent successfully");
        window.location.reload(false);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data); // => the response payload
        }
        if (error.response.data.code === 401) {
          alert(
            "File authentication failed, someones changing your data on the way to the server"
          );
        }
        if (error.response.data.code === 404) {
          alert("File sending failed");
        }
      });
  };

  handleMessage = async (e) => {
    e.preventDefault();
    console.log("hadler message fired");

    let messagetoEncrypt = this.state.message;

    console.log(messagetoEncrypt, " before encrypt message");

    let encrypted_message = this.handlerEncrypt(messagetoEncrypt);

    console.log(encrypted_message, " after encrypt message");

    const jwt = localStorage.getItem("jwtToken");

    let toSendObj = {
      message: messagetoEncrypt,
      encryptedMsg: encrypted_message,
      sender: this.state.sender,
    };

    axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
    axios
      .post("http://localhost:4000/messages/messages", toSendObj, {})
      .then((response) => {
        console.log(response);
        alert("Message sent successfully");
        window.location.reload(false);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data); // => the response payload
        }
        if (error.response.data.code === 401) {
          alert(
            "Message authentication failed, someones changing your data on the way to the server"
          );
        }
        if (error.response.data.code === 404) {
          alert("Message sending failed");
        }
      });


  }
  uploadFile = async (e) => {
    console.log("changed");
    const file = e.target.files[0];
    let base64 = await this.convertBase64(file);
    let newbase64String = base64;

    //file is decoded through utf 8
    let matchreg = "data:text/plain;base64,";
    newbase64String = newbase64String.replace(matchreg, "");
    this.setState({
      file: newbase64String,
    });
  };

  logout() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  }

  render() {
    var role = sessionStorage.getItem("role");
    if (role === "Manager") {
      const { message } = this.state;
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <div>
            <br />
            <h2>Manager Dashboard</h2>
            <h3>Enter Message</h3>
            <form id="msgForm">
              <FormControl sx={{ width: "40ch" }} variant="outlined">
                <TextField
                  name="message"
                  id="message"
                  label="Message"
                  variant="outlined"
                  value={message}
                  onChange={this.handleChange}
                  required
                />
                <br />
                <Button variant="contained" onClick={this.handleMessage}>
                  Send Message
                </Button>
                <br />
                <Button variant="outlined" component="label">
                  Upload File
                  <input
                    type="file"
                    hidden
                    onChange={(e) => {
                      this.uploadFile(e);
                    }}
                  />
                </Button>
                <br />
                <Button variant="contained" onClick={this.handleSubmit}>
                  Send File
                </Button>
              </FormControl>
            </form>
            <br />
            <br />
            <br />
            <Button
              variant="outlined"
              color="error"
              onClick={() => this.logout()}
            >
              Logout
            </Button>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h1>Please login to continue</h1>
          <Button
            variant="outlined"
            color="error"
            onClick={() => this.logout()}
          >
            Go to login
          </Button>
        </div>
      );
    }
  }
}

export default ManagerDashboard;
