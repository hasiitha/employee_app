const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userLoging = async (username, password) => {
  const user = await User.findOne({ username });

  if (user && (await bcrypt.compare(password, user.password))) {
    return {
      status: 200,
      obj: {
        _id: user._id,
        username: user.username,
        token: generateToken(user._id, user.role),
        role: user.role,
      },
    };
  } else {
    return { status: 400, obj: "invalid" };
  }
};

const UserRegistration = async (username, password, role) => {
  const isAvailable = await User.findOne({ username });

  if (isAvailable) {
    return { status: 400, obj: "invalid" };
  } else {
    const saltedVal = await bcrypt.genSalt(10);
    const hashedPW = await bcrypt.hash(password, saltedVal);

    const userDetails = await User.create({
      username,
      password: hashedPW,
      role,
    });

    if (userDetails) {
      return {
        status: 201,
        obj: {
          _id: userDetails._id,
          username: userDetails.username,
          role: userDetails.role,
        },
      };
    } else {
      return { status: 400 };
    }
  }
};

const generateToken = (id, role) => {
  if (role === "Admin") {
    let data = {
      permission: ["01"],
      role: "Admin",
      id: id,
    };
    return jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
  } else if (role === "Manager") {
    let data = {
      permission: ["02", "03"],
      role: "Manager",
      id: id,
    };
    return jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
  } else if (role === "Worker") {
    let data = {
      permission: ["02"],
      role: "Worker",
      id: id,
    };
    return jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
  }
};

module.exports = { userLoging, UserRegistration };
