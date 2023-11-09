require('dotenv').config();

const express = require('express')
const app = express()
app.use(express.json());
const port = process.env.APP_PORT || 3000;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validateRegister, validateLogin } = require('./schemaValidator');

const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PSWD,
  database: process.env.DB_NAME,
  port: process.env._DB_PORT,
})
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to db!');
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', (req, res) => {
  const { error, value } = validateRegister(req.body);
  if (error) {
    res.status(400).send(error.details.map((detail) => detail.message).join('\n'));
  }
  const { email, password, name } = value;
  connection.query(`SELECT * FROM User WHERE Email='${email}'`, (err, result) => {
    if (result.length > 0) {
      res.status(400).send('User already exists');
    }
    else if (result.length === 0) {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) throw err;
          connection.query(`INSERT INTO User (Email, Password, Name) VALUES ('${email}', '${hash}', '${name}')`, (err, result) => {
            if (err) throw err;
            res.status(200).send('User registered successfully');
          })
        })
      })
    }
    if (err) throw err;
  })
})

app.post('/login', (req, res) => {
  const { error, value } = validateLogin(req.body);
  if (error) {
    res.status(400).send(error.details.map((detail) => detail.message).join('\n'));
  }
  const { email, password } = value;
  connection.query(`SELECT * FROM User WHERE Email='${email}'`, (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      res.status(400).send('User does not exist');
    } else {
      bcrypt.compare(password, result[0].Password, (err, result) => {
        if (err) throw err;
        if (result) {
          const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
          res.status(200).json({ accessToken: token });
        } else {
          res.status(400).send('Incorrect password');
        }
      })
    }
  })
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})