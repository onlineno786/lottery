require('dotenv').config();
const express         = require('express');
const cors            = require('cors')
const app             = express();
const morgan          = require('morgan');
const validator       = require('express-validator');
const bodyParser      = require('body-parser')
const Passport        = require("passport");

const constant        = require(__basePath + 'app/core/constant');
const mongodbService  = require(constant.path.app + 'service/mongo.service'); // MongoDB Service
const passportService = require(constant.path.app + 'service/passport.service').init(); // Passport Initilized

app.use(cors())
app.use(morgan('dev'));
app.use(validator({}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(Passport.initialize());

require(constant.path.app + 'core/routes')(app); // API Routes

app.use(express.static(__dirname + '/../public'));

// connect to database
mongodbService.connect();

app.get('*', (req, res) => {
  res.sendFile('index.html', { 'root' : 'public/app/views'});
})

module.exports = app;
