const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const sequelize = require('./db');
const Course = require('./course');
const User = require('./user');

//MODEL ASSOCIATIONS
User.hasMany(Course);
Course.belongsTo(User, { constraints: false });

//VALIDATE CONNECTION AND SYNCRONIZE MODELS
sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
    }).then(()=>{
      
      sequelize.sync()
          .then(()=>{
            console.log('Models have been synced.')
          });
      return 
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err);
    });

module.exports = { sequelize, User, Course }