'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');

const bodyParser = require('body-parser');
//const { User, Course } = require('./models');
const routes = require('./routes');
// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// setup body parser which will give body back as proper JSON
app.use(bodyParser.json());

// allow cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, DELETE");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
});

// setup routes
app.use('/api', routes);

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});


// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  //Global logic for Sequelize Errors 
  if(err.name === 'SequelizeValidationError'){
      err.status = 400;
      //console.log(err);
  } else if(err.name === 'SequelizeUniqueConstraintError'){
      err.status = 400
      err.message = `${err.errors[0].path} has already been used.`
  };
  res.status(err.status || 500).json({
    message: err.message,
    error: {...err},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
