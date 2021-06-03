const express = require("express");
const router = express.Router();
const uuidv1 = require("uuid/v1");
const { isSignedin, isAuthenticated } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

router.param("userId", getUserById);

const Razorpay = require("razorpay");
const { response } = require("express");

var razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

router.post(
  "/payments/order/:userId",
  isSignedin,
  isAuthenticated,
  async (req, res) => {
    const amount = req.body.amount;
    const payment_capture = 1;
    const currency = "INR";

    const options = {
      amount: (amount * 100).toString(),
      currency,
      receipt: uuidv1(),
      payment_capture,
    };
    try {
      const response = await razorpay.orders.create(options);
      console.log(response);
      res.json({
        id: response.id,
        currency: "INR",
        amount: response.amount,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

router.post("/payment/verification", (req, res) => {
  console.log('andar aaye')
  const secret = "uAK5Xlbk6VVLrpNvLGMgn3fT86YB3ORT";

  const crypto = require("crypto");
  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");
  console.log(digest, req.headers["x-razorpay-signature"]);

  if (digest === req.headers["x-razorpay-signature"]) {
    console.log("request is legit");
    res.json({ status: ok });
  } else {
    
  }
});

module.exports = router;