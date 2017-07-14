//Node modules dependencies
require('dotenv').config();
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
//add debug
const debug = require('debug')(`repostars:${path.basename(__filename).split('.'[0])}`);
//add mongoose
const mongoose = require('mongoose');
//add expressLayouts
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
//other dependencies
//const dburl
const index = require('./routes/index');
//change to route auth
const auth = require('./routes/auth');


//add the conection of the routes and as connected "normal returns a promis we
//add dbURL that we declared prev"
mongoose.connect(process.env.MONGO_DB_URL).then( () => debug('DB Connected!'));

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//add the route of the layout
app.set('layout', 'layout/main');

//add the use of expressLayouts
app.use(expressLayouts);

//add
require('./passport/github');
app.use(passport.initialize());
app.use(passport.session());

// favicon placed uncommenting favicon
app.use(favicon(path.join(__dirname, 'public', 'images/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/auth', auth);
// app.use('/login', auth);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {title:'ERROR PAGE'});
});

module.exports = app;
