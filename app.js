const express = require("express");
const { default: mongoose } = require("mongoose");
const userModel = require("./models/user");
const app = express();
const PORT = process.env.PORT || 5000;
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const auth = require("./middleware/auth");

const DBURI = "mongodb+srv://admin:admin@cluster0.rbv3k1z.mongodb.net/crudapp";

mongoose
  .connect(DBURI)
  .then((res) => console.log("Mongo DB Connected"))
  .catch((err) => console.log("DB ERROR", err));

// Body-Parser
app.use(express.json());
// MiddleWare
app.use(cookieParser());

app.get("/api/test", (request, response) => {
  response.cookie("test", "Aneeq");
  response.send("testing");
});

app.get("/api/secret", auth, (request, response) => {
  response.send("testing");
});

// Get User //63cd37c6343822379904231c
app.get("/api/user/:userid", (request, response) => {
  const { userid } = request.params;
  userModel.findById(userid, (err, data) => {
    if (err) {
      response.json({
        message: `Internal Error:${err}`,
        status: false,
      });
    } else {
      response.json({
        message: "User GET Successfully",
        data: data,
        status: true,
      });
    }
  });
});

app.post("/api/user", (request, response) => {
  const { firstName, lastName, password, email } = request.body || {};

  if (!firstName || !lastName || !email || !password) {
    response.json({
      message: "Required field is missing",
      status: false,
    });
    return;
  }

  const objToSend = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    password: password,
  };
  userModel.create(objToSend, (err, data) => {
    if (err) {
      response.json({
        message: `Internal Error:${err}`,
        status: false,
      });
    } else {
      response.json({
        message: "User Created Successfully",
        data: data,
        status: true,
      });
    }
  });
  // response.send("Create Users");
});

app.put("/api/user", (request, response) => {
  response.send("Update Users");
});

app.delete("/api/user", (request, response) => {
  response.send("Delete Users");
});

app.post("/api/signup", (request, response) => {
  console.log(request.body);

  const { firstName, lastName, password, email, phoneNumber, dob } =
    request.body || {};

  if (!firstName || !lastName || !email || !password || !phoneNumber || !dob) {
    response.json({
      message: "Required field is missing",
      status: false,
    });
    return;
  }

  const hashPassword = bcrypt.hashSync(password, 10);
  const objToSend = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    password: hashPassword,
    phone_number: phoneNumber,
    dob: dob,
  };

  // If You Want Username Unique You Can Continue With Name After Email
  userModel.findOne({ email: email }, (err, data) => {
    if (err) {
      response.json({
        message: "Internal Server Error",
        status: false,
      });
    } else {
      console.log(data, "data");
      if (data) {
        response.json({
          message: "Email Address Already Exists",
          status: false,
        });
      } else {
        userModel.create(objToSend, (err, data) => {
          if (err) {
            response.json({
              message: "Internal Server Error",
              status: false,
            });
          } else {
            response.send({
              message: "User Signup Successfully",
              status: true,
              data: data,
            });
          }
        });
      }
    }
  });
});

app.post("/api/login", (request, response) => {
  const { email, password } = request.body;
  let token;
  if ((!email, !password)) {
    response.json({
      message: "Required field is missing",
      status: false,
    });
    return;
  }

  userModel.findOne({ email: email }, (err, data) => {
    if (err) {
      response.json({
        message: "Internal Error",
        status: false,
      });
      return;
    } else {
      if (!data) {
        response.json({
          message: "Credentials Error",
          status: false,
        });
        return;
      } else {
        const comparePassword = bcrypt.compareSync(password, data.password);
        token = data.generateAuthToken();
        console.log(token);
        response.cookie("jwtToken", token, {
          expires: new Date(Date.now() + 2589200000),
          httpOnly: true,
        });

        if (comparePassword) {
          response.json({
            message: "User Successfully Login",
            status: true,
            data: data,
            token: token,
          });
        } else {
          response.json({
            message: "Credentials Error",
            status: false,
          });
        }
      }
    }
  });
});

app.listen(PORT, () =>
  console.log(`server running on http://localhost:${PORT}`)
);
