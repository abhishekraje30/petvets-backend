const express = require('express');
const router = express.Router();
const axios = require('axios');
const client = require('../elasticsearch/client');
require('log-timestamp');

const URL = `http://localhost:4000/api/users?role=doctor`;

router.get('/doctors', async function (req, res) {
  console.log('Loading Application...');
  res.json('Running Application...');

  indexData = async () => {
    try {
      console.log('Retrieving data from the API');

      const DOCTORS = await axios.get(`${URL}`, {
        headers: {
          'Content-Type': ['application/json', 'charset=utf-8'],
        },
      });

      console.log('Data retrieved!');

      results = DOCTORS.data;
      console.log('results', results);

      console.log('Indexing data...');

        results.map(
          async (results) => (
            (doctorObject = {
              userId: results.userId,
              role: results.role,
              firstName: results.firstName,
              lastName: results.lastName,
              email: results.email,
              isEmailVerified: results.isEmailVerified,
              clinicName: results.clinicName,
              clinicAddress1: results.clinicAddress1,
              clinicAddress2: results.clinicAddress2,
              yearsOfExperience: results.yearsOfExperience,
              clinicContactNo: results.clinicContactNo,
              clinicEmail: results.clinicEmail,
              consultationFee: results.consultationFee,
              status: results.status,
              endTime: results.endTime,
              startTime: results.startTime,
              specialization: results.specialization,
              clinicCity: results.clinicCity,
              profileURL:results.profileURL,
              mobile:results.mobile,
              clinicState: results.clinicState,
              clinicPincode: results.clinicPincode
            }),
            await client.index({
              index: 'doctors',
              id: results.userId,
              body: doctorObject,
              pipeline: 'petvet_data_pipeline',
            })
          )
        );
    } catch (err) {
      console.log(err);
    }

    console.log('data indexed successfully...');
  };
  indexData();
});

module.exports = router;
