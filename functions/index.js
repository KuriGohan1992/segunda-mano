require('dotenv').config();
const functions = require("firebase-functions");
const axios = require("axios");
const stripeKey =
  process.env.STRIPE_SECRET_KEY || functions.config().stripe.secret;
exports.createCheckout = functions.https.onCall(async (data, context) => {
  try {
    const { amount, description } = data.data;

    if (!amount || !description) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Missing amount or description"
      );
    }

    const res = await axios.post(
      "https://api.paymongo.com/v1/checkout_sessions",
      {
        data: {
          attributes: {
            line_items: [
              {
                currency: "PHP",
                amount: amount,
                name: description,
                quantity: 1,
              },
            ],
            payment_method_types: ["qrph"],

            success_url: "https://example.com/success",
            cancel_url: "https://example.com/cancel",
          },
        },
      },
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(stripeKey + ":").toString("base64"),
          "Content-Type": "application/json",
        },
      }
    );

    return res.data.data.attributes.checkout_url;

  } catch (err) {
    console.log("PAYMONGO ERROR:", err.response?.data || err.message);

    throw new functions.https.HttpsError(
      "internal",
      "Checkout creation failed"
    );
  }
});