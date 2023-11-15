const router = require('express').Router();
const bcrypt = require('bcrypt');
const connection = require('../config/db');
const { validateRegister } = require('../schemaValidator');

router.post('/register', (req, res) => {
    const { error, value } = validateRegister(req.body);
    if (error) res.status(400).send(error.details.map((detail) => detail.message).join('\n'));
    const { email, password, name } = value;
    connection.query(`SELECT * FROM User WHERE Email='${email}'`, (err, result) => {
        if (result.length > 0) res.status(400).send('User already exists');
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

module.exports = app => {
    return router;
};