const express = require('express');
const router = express.Router();

const User = require('../../models/users.model');

router.get('/', async (req, res) => {
  let role = req.query.role;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;
  const page = req.query.page ? parseInt(req.query.page) : 0;
  try {
    const result = {
      user: await User.find({ role: role }).limit(pageSize).skip(pageSize * page).lean(),
      totalPages : pageSize ? Math.floor(await User.find({ role: role }).count()/pageSize) : 0
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get('/userrole', async (req, res) => {
  let role = req.query.role;
  try {
    const users = await User.find({ role: role }).lean();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const userDetails = await User.find({
      userId: userId,
    }).lean();
    delete userDetails._id;
    delete userDetails.__v;
    res.status(200).json(userDetails[0]);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.post('/', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(200).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

router.put('/:userId', async (req, res) => {
  const body = req.body;
  const userId = req.params.userId;
  try {
    let userDetails = await User.findOne({
      userId: userId,
    }).lean();
    userDetails = {
      ...userDetails,
      ...body,
    };
    await User.updateOne({ userId: userId }, userDetails);
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.patch('/:userId', async (req, res) => {
  try {
    await User.findOneAndUpdate({ _id: req.params.userId }, { $set: req.body });
    res.status(200).json({ message: 'Profile updated' });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

module.exports = router;
