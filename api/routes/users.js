const router = require('express').Router();
const { User } = require('../models');
const authenticate = require('./authenticate')

router.get('/', authenticate, (req, res) => {
    //remove password response
    delete req.authenticatedUser.dataValues.password;

    res.json(req.authenticatedUser)
});

router.post('/', (req, res, next) => {
    const { firstName, lastName, emailAddress, password } = req.body;

    //Create User in DB ( password is automatically hashed by Model )
    User.create({ firstName, lastName, emailAddress, password })
        .then(() => {
            //Set Location header to root and status to 201
            res.location('/').status(201).end();
        })
        .catch( err => {
            next(err);
        });

});

module.exports = router;
