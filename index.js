
const mongoose = require('mongoose');
const app = require('./app');

mongoose.connect("mongodb+srv://stanislasmakengo1:0826016607makengo@cluster0.h1xmw9a.mongodb.net/?retryWrites=true&w=majority"
  ,
  {
    useNewUrlParser: true,
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log('Express server démarré sur le port ' + port);
});

// const express = require("express");
// const app = express();
// // This is your test secret API key.
// const stripe = require("stripe")('sk_test_51NniHpGOTC1tLYvbKvcaYSRgQxbI8KZ8886FRBidi7npWQMfauMWvS9Qv84DTEPuNbK1lBDqh4fwfA66LxeQy7yb00Hs9VEVDb');

// app.use(express.static("public"));
// app.use(express.json());

// const calculateOrderAmount = (items) => {
//   // Replace this constant with a calculation of the order's amount
//   // Calculate the order total on the server to prevent
//   // people from directly manipulating the amount on the client
//   return 1400;
// };

// app.post("/create-payment-intent", async (req, res) => {
//   const { items } = req.body;

//   // Create a PaymentIntent with the order amount and currency
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: items,
//     currency: "usd",
//     // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
//     automatic_payment_methods: {
//       enabled: true,
//     },
//   });

//   res.send({
//     clientSecret: paymentIntent.client_secret,
//   });
// });


// app.listen(4242, () => console.log("Node server listening on port 4242!"));