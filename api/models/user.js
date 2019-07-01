const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const sequelize = require('./db')
const bcrypt = require('bcryptjs');

class User extends Model {}
User.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true
        }
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true
        }
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true
        }
    },
    emailAddress: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true,
            notNull: true,
            notEmpty: true
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true
        },
        set(val) {
            if(val){
                this.setDataValue("password", bcrypt.hashSync(val, bcrypt.genSaltSync(10)))
            } else { 
                return null
            }
        }
    }
}, {
    sequelize,
    modelName: 'User'
});

module.exports = User;