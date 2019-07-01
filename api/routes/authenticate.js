const auth = require('basic-auth');
const User = require('../models/user');
const bcrypt = require('bcryptjs');


/**
 * Express middleware function that authenticates the user's basic auth credentials and returns a sequelize object of the user
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

const authenticate = (req, res, next) => {
    const userCreds = auth(req);
    if(userCreds){
        const { name, pass } = userCreds;
        User.findOne({
            where: {
                emailAddress: name
            }
        }).then( user => {
            if(user){
                //validate password
                if(bcrypt.compareSync(pass, user.password)){
                    req.authenticatedUser = user;
                    next();
                } else {
                    console.log('incorrect password');
                    throw new Error();
                }
            } else {
                console.log('incorrect username');
                throw new Error();
            }
        }).catch(err => {
            err.message = "Not authenticated";
            err.status = 401;
            next(err);
        })
    } else {
            const err = new Error("Not authenticated");
            err.status = 401;
            next(err);
    }
}

module.exports = authenticate;