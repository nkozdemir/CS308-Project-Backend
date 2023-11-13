require('dotenv').config();

const express = require('express')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validateRegister } = require('./schemaValidator');
const mysql = require('mysql2');

const app = express()
app.use(express.json());
const port = 3000;

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PSWD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
})
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to db!');
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const songData = [
  {
    userid: 1,
    songid: 1,
  },
  {
    userid: 1,
    songid: 2,
  },
  {
    userid: 1,
    songid: 3,
  },
  {
    userid: 2,
    songid: 2,
  },
  {
    userid: 2,
    songid: 3,
  },
]

app.get('/usersong', authenticateToken, (req, res) => {
  res.json(songData.filter((data) => data.userid === req.user.UserID));
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

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  })
}

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})