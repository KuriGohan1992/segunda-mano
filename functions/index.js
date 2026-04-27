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

    const { 
      userId,
      sellerId,
      listingId,
      amount,
      listingName,
      address,
      specificAddress,
      createdAt,
      description,
      orderId 
    } = data.data;
    // const { amount, description, orderId } = data;
    console.log("Order: ", orderId)

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

            metadata: {
              orderId: orderId,
              userId: userId,
              sellerId: sellerId,
              listingId: listingId,
              amount: amount,
              listingName: listingName,
              address: address,
              specificAddress: specificAddress,
            }
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

const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

exports.paymongoWebhook = functions.https.onRequest(async (req, res) => {
  try {
    const event = req.body;

    console.log("FULL EVENT:", JSON.stringify(event, null, 2));

    const eventType = event.data?.attributes?.type;

    if (eventType === "checkout_session.payment.paid") {
      const attributes = event.data?.attributes?.data?.attributes;
      const metadata = attributes?.metadata || {};

      let orderId = attributes?.metadata?.orderId;

      // fallback (VERY IMPORTANT)
      if (!orderId && attributes?.payments?.length > 0) {
        orderId = attributes.payments[0]?.metadata?.orderId;
      }

      if (!orderId) {
        console.log("No orderId found");
        return res.sendStatus(200);
      }

      const orderRef = db.collection("orders").doc(orderId);

      const existing = await orderRef.get();
      if (existing.exists && existing.data().paymentStatus === "PAID") {
        console.log("Already processed");
        return res.sendStatus(200);
      }

      await orderRef.set({
        userId: metadata.userId,
        sellerId: metadata.sellerId,
        listingId: metadata.listingId,
        amount: metadata.amount ? metadata.amount / 100 : 0,
        paymentStatus: "PAID",
        deliveryStatus: "PLACED",
        paymentMethod: "ONLINE",
        listingName: metadata.listingName,
        address: metadata.address,
        specificAddress: metadata.specificAddress,
        isCompleted: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        paidAt: admin.firestore.FieldValue.serverTimestamp(),
        sellerReceivedPayment: false,
      }, { merge: true });
      // await db.collection("orders").doc(orderId).set({
      //   userId,
      //   sellerId,
      //   listingId,
      //   amount: amount/100,
      //   paymentStatus: "PAID",
      //   deliveryStatus: "PLACED",
      //   paymentMethod: "ONLINE",
      //   listingName,
      //   address,
      //   specificAddress,
      //   isCompleted,
      //   createdAt,
      //   paidAt: admin.firestore.FieldValue.serverTimestamp(),
      // });
      
      // const orderDoc = await db.collection("orders").doc(orderId).get();
      // const orderData = orderDoc.data();
      if (!metadata.listingId) {
        console.log("Missing listingId in metadata");
        return res.sendStatus(200);
      }
       
      await db.collection("listings")
        .doc(metadata.listingId)
        .update({
          available: false,
        });

    }

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});