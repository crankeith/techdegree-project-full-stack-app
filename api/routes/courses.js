const router = require('express').Router();
const { Course, User } = require('../models');
const authenticate = require('./authenticate');

//COURSE ERRORS
//403
const error403 = new Error('You cannot edit this course.')
error403.status= 403;

//404
const error404 = new Error('Course does not exist')
error404.status = 404;

//COURSE ROUTES
// Returns a list of courses (including the user that owns each course)
router.get('/', (req, res, next) => {
    Course.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        include: [{
            model: User,
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt']
            }
        }]    
    })
        .then( courses => {
            res.json({
                count: courses.length,
                courses: courses
            });
        })
        .catch(err => {
            next(err)
        })
});

// Creates a course, sets the Location header to the URI for the course, and returns no content
router.post('/', authenticate, (req, res, next) => {
    const { title, description, estimatedTime, materialsNeeded } = req.body;

    Course.create(
        { 
            title, description, materialsNeeded, estimatedTime,
            UserId: req.authenticatedUser.id
        }
    ).then((course) => {
        res.status(201).json(course);
    }).catch(err => {
        next(err);
    })
});

// Returns a course (including the user that owns the course) for the provided course ID
router.get('/:id', (req, res, next) => {
    Course.findOne({
        where: {
            id: req.params.id
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        include: [{
            model: User,
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt']
            }
        }]    
    })
        .then( course => {
            //Check to see if course exists
            if(course){
                res.json(course);
            } else {
                throw error404;
            }
        })
        .catch(err => {
            next(err)
        })
});

// Updates a course and returns no content
router.put('/:id', authenticate, (req, res, next) => {

    const { title, description, estimatedTime, materialsNeeded } = req.body;
    Course.findOne({
        where: {
            id: req.params.id
        },
        include: [{
            model: User,
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt']
            }
        }] 
    })
        .then( course => {
            //Check to see if course exists
            if(course){
                // Check to see if the user owns the course
                if( course.User.id === req.authenticatedUser.id){
                    course.update({ 
                        title, description, estimatedTime, materialsNeeded
                    })
                        .then(() => {
                            res.status(200).end();
                        })
                        .catch( err => {
                            next(err);
                        })
                } else {
                    throw error403;
                }
            } else {
                throw error404;
            }
        })
        .catch(err => {
            next(err)
        })
});

// Deletes a single course and returns no content
router.delete('/:id', authenticate, (req, res) => {

    Course.findOne({
        where: {
            id: req.params.id
        },
        include: [{
            model: User,
            attributes: {
                exclude: ['password', 'createdAt', 'updatedAt']
            }
        }]  
    })
        .then( course => {
            //Check to see if course exists
            if(course){
                // Check to see if the user owns the course
                if( course.User.id === req.authenticatedUser.id){
                    course.destroy({ force: true })
                        .then(() => {
                            res.status(200).end();
                        })
                        .catch( err => {
                            next(err);
                        })
                } else {
                    throw error403;
                }
            } else {
                throw error404;
            }
        })
        .catch(err => {
            next(err)
        })
});

module.exports = router;
