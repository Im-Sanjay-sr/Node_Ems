const user = require("../models/user");
const otps = require("../models/otp");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const session = require("express-session");
const JwtToken = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// Configuration for Gmail
let config = {
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
};

let transporter = nodemailer.createTransport(config);

//Sending Otp function

const SendOtpVerification = async (email, res, req, name, password) => {
  try {
    const otpCode = `${Math.floor(1000 + Math.random() * 9000)}`;

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Verify Your Email",
      html: `<p> Enter <b>${otpCode}</b> in the app to verify your email address and complete the verification proccess`,
    };

    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otpCode, saltRounds);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newOtpVerifocation = new otps({
      otp: hashedOTP,
      name,
      email,
      password: hashedPassword,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    await newOtpVerifocation.save();
    await transporter.sendMail(mailOptions);

    req.session.message = {
      type: "info",
      info: "Email has been send to your email please check your mail",
    };
    res.redirect("/user/signUp/verifyOtp/" + email);
  } catch (error) {
    console.log(error);
  }
};

// rendering login page

const renderLog = (req, res) => {
  res.status(200).render("signup");
};
// rendering otpverify page

const renderVerfy = (req, res) => {
  res.render("otp");
};

const signIn = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  //
  console.log(req.body);
  //
  const excitingUser = await user.find({
    email,
  });

  if (!email || !password) {
    res.json({
      status: "Failed",
      message: "Please fill up all the field",
    });
  } else {
    if (excitingUser.length > 0) {
      const savedPassword = excitingUser[0].password;
      const verified = await bcrypt.compare(password, savedPassword);

      if (verified) {
        let resp = {
          id: excitingUser[0].id,
          email: excitingUser[0].email,
        };

        let token = JwtToken.sign(resp, process.env.MY_Token, {
          expiresIn: "5h",
        });

        res.cookie("token", token, {
          httpOnly: true,
        });

        req = {
          type: "success",
          info: "You are successfully logged in",
        };

        res.redirect("/employees/dashboard");
      } else {
        req.session.message = {
          type: "danger",
          info: "Wrong password or email",
        };
        res.redirect("/user/login");
      }
    } else {
      req.session.message = {
        type: "warning",
        info: "You dont jave an account with this mail please sign up",
      };
      res.redirect("/user/login");
    }
  }
};
const sendOtp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      res.json({
        status: "Failed",
        message: "Please fill up all fields",
      });
    } else {
      const userVerificationrecord = await otps.find({
        email,
      });

      const userRecords = await user.find({
        email,
      });

      if (userRecords.length > 0) {
        req.session.message = {
          type: "info",
          info: "You already have an account with this mail please login",
        };
        res.redirect("/user/login");
      } else {
        if (userVerificationrecord.length > 0) {
          const { expiresAt } = userVerificationrecord[0];
          if (expiresAt < Date.now()) {
            await otps.deleteMany({ email });
            SendOtpVerification(email, res, req, name, password);
          } else {
            req.session.message = {
              type: "info",
              info: "Email already been send to your email please check your mail",
            };
            res.redirect("/user/signUp/verifyOtp/" + email);
          }
        } else {
          SendOtpVerification(email, res, req, name, password);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const verifyotp = async (req, res) => {
  const { otp1, otp2, otp3, otp4 } = req.body;

  const email = req.params.email;

  const typedOtp = `${otp1}${otp2}${otp3}${otp4}`;
  console.log(typedOtp);

  const userOtprecord = await otps.find({
    email,
  });

  if (userOtprecord.length > 0) {
    const { name, email, password } = userOtprecord[0];
    const newUser = new user({
      name,
      email,
      password,
    });

    const { expiresAt } = userOtprecord[0];
    const { otp } = userOtprecord[0];

    if (expiresAt > Date.now()) {
      const verified = await bcrypt.compare(typedOtp, otp);
      console.log(verified);
      if (verified) {
        await newUser.save();
        await otps.deleteMany({ email });

        req.session.message = {
          type: "success",
          info: "You are succeffuly registered please singn in",
        };

        res.redirect("/user/login");
      } else {
        req.session.message = {
          type: "danger",
          info: "Invalid Otp please check your inbox",
        };

        res.redirect("/user/signUp/verifyOtp/" + email);
      }
    }
  }
};
module.exports = { renderLog, signIn, sendOtp, verifyotp, renderVerfy };
