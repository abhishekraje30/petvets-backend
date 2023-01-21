const express = require("express");
const router = express.Router();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); 

require("dotenv").config();

const Appointment = require("../../models/appointments.model");

router.post('/', (req, res) => {
  console.log(req)
  const user = req.body.userDetail
  const doctor = req.body.vetDetail
  const appointment = new Appointment(req.body);
  appointment.save((err, data) => {
    if (err) {
      res.status(500).json({ 'msg': 'Database Error Occured!' });
    } else {
      stripe.customers.create({
        email: user.email,
        name: user.firstName + user.lastName,
        address: {
          line1: "",
          postal_code: user.zipCode,
          city: user.city,
          state: user.state,
          country: user.country,
        }
      })
        .then(async (customer) => {
          const card_token = await stripe.tokens.create({
            card: {
              name: user.firstName + user.lastName,
              number: req.body.cardNumber,
              exp_month: req.body.cardMonth,
              exp_year: req.body.cardYear,
              cvc: req.body.cardCvv
            }
          })
          await stripe.customers.createSource(customer.id, { source: `${card_token.id}` })
          return stripe.paymentIntents.create({
            amount: doctor.consultationFee, 
            description: 'Booked Appointment',
            currency: 'INR',
            customer: customer.id
          });
        })
        .then(async (charge) => {
          await Appointment.findOneAndUpdate({ _id: appointment._id }, { $set: {paymentStatus:'succeeded', userId:user.userId, vetId:doctor.userId} });
          
          res.status(200).json({ 'status': true, 'msg': 'Success' });
        })
        .catch(async (err) => {
          await appointment.deleteOne({ _id: data._id });
          console.log("err", err)
          res.status(500).json({ 'msg': err }); 
        });
    }
  });
});

module.exports = router;
