const functions = require("firebase-functions");
const axios = require("axios");

exports.createCheckout = functions.https.onCall(async (data, context) => {
  try {
    const paymongoKey = process.env.PAYMONGO_SECRET_KEY;

    console.log("KEY EXISTS:", !!paymongoKey);
    console.log("REQUEST DATA:", data);

    if (!paymongoKey) {
      throw new functions.https.HttpsError(
        "internal",
        "Missing PayMongo secret key"
      );
    }

    const { amount, description } = data.data || data;

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
            Buffer.from(paymongoKey + ":").toString("base64"),
          "Content-Type": "application/json",
        },
      }
    );

    return res.data.data.attributes.checkout_url;

  } catch (err) {
    console.log("FULL ERROR:", err);
    console.log("PAYMONGO ERROR:", err.response?.data || err.message);

    throw new functions.https.HttpsError(
      "internal",
      "Checkout creation failed"
    );
  }
});