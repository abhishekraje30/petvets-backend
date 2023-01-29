const express = require('express');
const client = require('../elasticsearch/client');
const { Client } = require('@elastic/elasticsearch');
const router = express.Router();

const User = require('../../models/users.model');

router.get('/results', async (req, res) => {
  const doctor = req.query.doctor;
  const city = req.query.city;
  const category = req.query.category;
  let users = [];

  if (category && city) {
    users = await User.find({
      role: 'doctor',
      status: 'approved',
      $and: [
        { specialization: category },
        { clinicCity: city }
      ],
    }).lean();
  } else if (doctor && city) {
    users = await User.find({
      role: 'doctor',
      status: 'approved',
      $and: [
        { firstName: doctor },
        { clinicCity: city }
      ],
    }).lean();
  } else if (doctor && category) {
    users = await User.find({
      role: 'doctor',
      status: 'approved',
      $and: [
        { firstName: doctor },
        { specialization: category }
      ],
    }).lean();
  } else if (doctor && category && city) {
    users = await User.find({
      role: 'doctor',
      status: 'approved',
      $and: [
        { firstName: doctor },
        { specialization: category },
        { clinicCity: city }
      ],
    }).lean();
  } 
  else {
    users = await User.find({
      role: 'doctor',
      status: 'approved',
      $or: [
        { specialization: category },
        { clinicCity: city },
        { firstName: doctor },
      ],
    }).lean();
  }
  const result = {
    user: users,
    totalPages: Math.floor(users.length/9)
  }
  res.status(200).json(result);
  // async function sendESRequest() {
  //   const body = await client.search({
  //     index: 'doctors',
  //     body: {
  //       size: 300,
  //       query: {
  //         bool: {
  //           must: [
  //             {
  //               term: { status: 'approved' },
  //               // term: { firstName: { query: doctor } },
  //             },
  //             {
  //               "match_all": {}
  //             }
  //           ],
  //           filter: [{
  //             // { term: { firstName: doctor } },
  //              term: { clinicCity: city } ,
  //              term: { specialization: category }
  //             // {
  //             //   multi_match: {
  //             //     query: '*',
  //             //     fields: ['firstName', 'clinicCity', 'specialization'],
  //             //   },
  //             },
  //           ],
  //         },
  //       },
  //     },
  //   });

  //   if (body.hits.hits.length) {
  //     body.hits.hits.forEach((data) => {
  //       result.push(data._source);
  //     });
  //   }

  //   res.json(result);
  // }
  // sendESRequest();
});

module.exports = router;
