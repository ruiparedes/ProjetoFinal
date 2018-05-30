const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser')

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());       
app.use(express.urlencoded()); 

app.get('/', (req, res) => {
    res.send('Welcome to the NodeJS server')
});

app.listen(8080, () => {
    console.log('Server Listening on port 8080')
});


 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


//Database Connection

var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "bdadmin",
    password: "admin",
    database: 'db_projeto',
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");

    //Database Tables

    var UsersTb = "CREATE TABLE if not exists users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(20) NOT NULL UNIQUE, password VARCHAR(20) NOT NULL, name VARCHAR(50) NOT NULL, email VARCHAR(50) NOT NULL UNIQUE, address VARCHAR(50) NOT NULL)";
    con.query(UsersTb, function (err, result) {
        if (err) throw err;
        console.log("Table Users Created");
    });

    var CompetitionsTb = "CREATE TABLE if not exists competitions (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(20) NOT NULL UNIQUE, totalParticipants INT(2) NOT NULL, numberHelps INT(2) NOT NULL, discountPerHelp INT(2) NOT NULL, estado VARCHAR(15) NOT NULL)";
    con.query(CompetitionsTb, function (err, result) {
        if (err) throw err;
        console.log("Table Competitions Created");
    });

    var ChallengesTb = "CREATE TABLE if not exists challenges (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(20) NOT NULL UNIQUE, description VARCHAR(500) NOT NULL, link VARCHAR(100) NOT NULL UNIQUE, solution VARCHAR(100) NOT NULL)";
    con.query(ChallengesTb, function (err, result) {
        if (err) throw err;
        console.log("Table Challenges Created");
    });

    var ChallengesPerCompetitionTb = "CREATE TABLE if not exists challengesPerCompetition (id INT AUTO_INCREMENT PRIMARY KEY, competitionID INT NOT NULL, challengeID INT NOT NULL, FOREIGN KEY (competitionID) REFERENCES competitions(id), FOREIGN KEY (challengeID) REFERENCES challenges(id), maxScore INT(3) NOT NULL)";
    con.query(ChallengesPerCompetitionTb, function (err, result) {
        if (err) throw err;
        console.log("Table ChallengesPerCompetition Created");
    });

    var RegistrationsTb = "CREATE TABLE if not exists registrations (id INT AUTO_INCREMENT PRIMARY KEY, userID INT NOT NULL, competitionID INT NOT NULL, FOREIGN KEY (userID) REFERENCES users(id), FOREIGN KEY (competitionID) REFERENCES competitions(id), registrationDate DATETIME NOT NULL)";
    con.query(RegistrationsTb, function (err, result) {
        if (err) throw err;
        console.log("Table Registrations Created");
    });

    var scorePerChallengePerCompetitionTb = "CREATE TABLE if not exists scorePerChallengePerCompetition (id INT AUTO_INCREMENT PRIMARY KEY, registrationID INT NOT NULL, challengesPerCompetitionID INT NOT NULL, FOREIGN KEY (registrationID) REFERENCES registrations(id), FOREIGN KEY (challengesPerCompetitionID) REFERENCES challengesPerCompetition(id), score INT(3) NOT NULL)";
    con.query(scorePerChallengePerCompetitionTb, function (err, result) {
        if (err) throw err;
        console.log("Table scorePerChallengePerCompetition Created");
    });


    //Methods DB

    //Get Users
    const SELECT_ALL_USERS_QUERY = 'SELECT * FROM users';

    app.get('/api/users/View', (req, res) => {
        con.query(SELECT_ALL_USERS_QUERY, (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.json({
                    data: results
                })
            }
        });
    });

    //Add User

    app.post('/api/users/Add', (req, res) => {
        const { username, password, name, email, address } = req.body;
        console.log(username, password, name, email, address);
        const INSERT_USER_QUERY = `INSERT INTO users (username, password, name, email, address) VALUES('${username}', '${password}', '${name}', '${email}', '${address}' )`;
        con.query(INSERT_USER_QUERY, (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.send('Sucessfully added the user')
            }
        });
    });

    //Delete User

    app.post('/api/users/Delete', (req, res) =>{
        const id = req.body.id;
        console.log(req.body);
        const DELETE_USER_QUERY = `DELETE FROM users WHERE id = ${id}` ;
        con.query(DELETE_USER_QUERY, (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.send('Sucessfully Deleted the user')
            }
        });
    });






});