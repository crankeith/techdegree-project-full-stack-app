const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const sequelize = require('./db')

class Course extends Model {}
Course.init({
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true
        }
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true
        }
    },
    estimatedTime: {
        type: Sequelize.STRING,
        allowNull: true
    },
    materialsNeeded: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Course'
});

module.exports = Course;