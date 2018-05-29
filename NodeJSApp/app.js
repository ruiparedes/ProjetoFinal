var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



//Database Connection

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "bdadmin",
  password: "admin",
  database : 'db_projeto',
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

//Database Tables

var UsersTb = "CREATE TABLE if not exists users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(20) NOT NULL, password VARCHAR(20) NOT NULL, name VARCHAR(50) NOT NULL, email VARCHAR(50) NOT NULL, address VARCHAR(50) NOT NULL)";
con.query(UsersTb, function(err, result){
if(err) throw err;
console.log("Table Users Created");
});

var CompetitionsTb = "CREATE TABLE if not exists competitions (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(20) NOT NULL, totalParticipants INT(2) NOT NULL, numberHelps INT(2) NOT NULL, discountPerHelp INT(2) NOT NULL, estado VARCHAR(15) NOT NULL)";
con.query(CompetitionsTb, function(err, result){
if(err) throw err;
console.log("Table Competitions Created");
});

var ChallengesTb = "CREATE TABLE if not exists challenges (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(20) NOT NULL, description VARCHAR(500) NOT NULL, link VARCHAR(100) NOT NULL, solution VARCHAR(100) NOT NULL)";
con.query(ChallengesTb, function(err, result){
if(err) throw err;
console.log("Table Challenges Created");
});

var ChallengesPerCompetitionTb = "CREATE TABLE if not exists challengesPerCompetition (id INT AUTO_INCREMENT PRIMARY KEY, competitionID INT NOT NULL, challengeID INT NOT NULL, FOREIGN KEY (competitionID) REFERENCES competitions(id), FOREIGN KEY (challengeID) REFERENCES challenges(id), maxScore INT(3) NOT NULL)";
con.query(ChallengesPerCompetitionTb, function(err, result){
if(err) throw err;
console.log("Table ChallengesPerCompetition Created");
});

var RegistrationsTb = "CREATE TABLE if not exists registrations (id INT AUTO_INCREMENT PRIMARY KEY, userID INT NOT NULL, competitionID INT NOT NULL, FOREIGN KEY (userID) REFERENCES users(id), FOREIGN KEY (competitionID) REFERENCES competitions(id), registrationDate DATETIME NOT NULL)";
con.query(RegistrationsTb, function(err, result){
if(err) throw err;
console.log("Table Registrations Created");
});

var scorePerChallengePerCompetitionTb = "CREATE TABLE if not exists scorePerChallengePerCompetition (id INT AUTO_INCREMENT PRIMARY KEY, registrationID INT NOT NULL, challengesPerCompetitionID INT NOT NULL, FOREIGN KEY (registrationID) REFERENCES registrations(id), FOREIGN KEY (challengesPerCompetitionID) REFERENCES challengesPerCompetition(id), score INT(3) NOT NULL)";
con.query(scorePerChallengePerCompetitionTb, function(err, result){
if(err) throw err;
console.log("Table scorePerChallengePerCompetition Created");
});




});







module.exports = app;
