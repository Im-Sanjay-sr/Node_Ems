const express = require('express');
const router = express.Router();
const { renderLog , signIn , sendOtp , verifyotp ,renderVerfy } = require("../controllers/controller")


router.route("/user/login").get(renderLog).post(signIn);

router.route("/user/signUp/sendOtp/").post(sendOtp) ;

router.route("/user/signUp/verifyOtp/:email").post(verifyotp).get(renderVerfy);


module.exports = router;