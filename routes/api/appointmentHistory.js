const express = require('express');
const router = express.Router();

const Appointment = require('../../models/appointments.model');
const User = require('../../models/users.model');

router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;
  return Appointment.find({
    userId: userId,
    paymentStatus: 'succeeded',
  })
    .then(async (result) => {
      const detail = result.map(async (app) => {
        const vet = await User.find({ userId: app.vetId });
        const user = await User.find({ userId: app.userId });
        return {...app.toObject(), vetDetail: vet[0], userDetail: user[0]}
      });
      res.status(200).json(await Promise.all(detail));
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
});

router.get('/doctor/:vetId', async (req, res) => {
  const vetId = req.params.vetId;
  return Appointment.find({
    vetId: vetId,
    paymentStatus: 'succeeded',
  })
    .then(async (result) => {
      const detail = result.map(async (app) => {
        const vet = await User.find({ userId: app.vetId });
        const user = await User.find({ userId: app.userId });
        return {...app.toObject(), vetDetail: vet[0], userDetail: user[0]}
      });
      res.status(200).json(await Promise.all(detail));
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
});

module.exports = router;
