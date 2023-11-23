const router = require('express').Router();
const bcrypt = require('bcrypt');
const { validateRegister } = require('../helpers/schemaValidator');
const User = require('../models/user');

router.post('/', async (req, res) => {
  try {
    const { error, value } = validateRegister(req.body);
    if (error) return res.status(400).send(error.details.map((detail) => detail.message).join('\n'));

    const { email, password, name } = value;

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user using Sequelize model
    const newUser = await User.create({
      Email: email,
      Password: hashedPassword,
      Name: name,
    });

    res.status(200).send('User registered successfully');
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;