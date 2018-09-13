const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser');
var dateFormat = require('dateformat');
var moment = require('moment');
fileUpload = require('express-fileupload');
var fs = require('fs-extra');
var mv = require('mv');

var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '.zip');
    }
});


var upload = multer({ storage: storage }).single('file');


const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


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


//Connect to Mysql database
var mysql = require('mysql');

var conVul = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "bdadmin",
    password: "admin",
    database: 'db_vulnerable',
});

conVul.connect(function (err) {
    if (err) throw err;
    console.log("Connected to MySQL Vuln!");

    //MySQL Tables Creation

    var UsersTb = "CREATE TABLE if not exists users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(20) NOT NULL UNIQUE, password VARCHAR(20) NOT NULL, name VARCHAR(50) NOT NULL, email VARCHAR(50) NOT NULL UNIQUE, address VARCHAR(50) NOT NULL)";
    conVul.query(UsersTb, function (err, result) {
        if (err) throw err;
        console.log("Table Users Created in MySQL Vuln");
    });

    var BankAccountTb = "CREATE TABLE if not exists bankAccount (id INT AUTO_INCREMENT PRIMARY KEY, accountNumber INT(5) NOT NULL, amount INT(7) NOT NULL, userID INT NOT NULL, FOREIGN KEY (userID) REFERENCES users(id))";
    conVul.query(BankAccountTb, function (err, result) {
        if (err) throw err;
        console.log("Table BankAccount Created in MySQL Vuln");
    });


    var BankTransfersTb = "CREATE TABLE if not exists bankTransfers (id INT AUTO_INCREMENT PRIMARY KEY, moneyTransfered INT(7) NOT NULL, originAccount INT NOT NULL, FOREIGN KEY (originAccount) REFERENCES bankAccount(id), destinyAccount INT NOT NULL, FOREIGN KEY (destinyAccount) REFERENCES bankAccount(id))";
    conVul.query(BankTransfersTb, function (err, result) {
        if (err) throw err;
        console.log("Table BankTransfers Created in MySQL Vuln");
    });


    //MySQL Tables Methods

    // USER METHODS -------------------------------------------------------------------------------------------------------------------------------------

    //Get Users

    app.get('/api-vulnerable/CSRF/:amount/:receptorAccount', (req, res) => {

        var amount = req.params.amount;
        var receptorAccount = req.params.receptorAccount;
        console.log(amount);
        console.log(receptorAccount);

        if (receptorAccount == 7432 && amount == 1000) {
            console.log("The CSRF Attack was executed successfully!");
            return res.status(200).json({
                message: 'Attack was successful!'
            })
        }
        else {
            console.log("The CSRF Attack failed");
            return res.status(400).json({
                message: 'Attack failed!'
            })
        }

    })


    app.get('/api-vulnerable/users/View', (req, res) => {
        const SELECT_ALL_USERS_QUERY = 'SELECT * FROM users';
        conVul.query(SELECT_ALL_USERS_QUERY, (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.json({
                    users: results
                })
            }
        });
    });

    app.post('/api-vulnerable/users/Login', (req, res) => {
        const { username, password } = req.body;
        console.log(username, password);
        const LOGIN_VULN_USERS_QUERY = `SELECT username, password from users where username = '${username}' and (password = '${password}')`;
        console.log(LOGIN_VULN_USERS_QUERY);
        conVul.query(LOGIN_VULN_USERS_QUERY, (err, results) => {
            if (results.length != 0 && username == 'admin') {
                console.log("Login Realizado: " + results.length);
            }
            else {
                console.log("Falha no Login: " + results.length);
            }
        })
    });



    //Add User

    app.post('/api-vulnerable/users/Add', (req, res) => {
        const { username, password, name, email, address } = req.body;
        console.log(username, password, name, email, address);
        const INSERT_USER_QUERY = `INSERT INTO users (username, password, name, email, address) VALUES('${username}', '${password}', '${name}', '${email}', '${address}' )`;
        conVul.query(INSERT_USER_QUERY, (err, results) => {
            if (err) {
                console.log("Error Ocurred", err);
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                })
            }
            else {
                console.log("User added:", results);
                res.send({
                    "code": 200,
                    "success": "user registered sucessfully"
                });
            }
        });
    });


    // Account METHODS -------------------------------------------------------------------------------------------------------------------------------------

    //Get Accounts
    const SELECT_ALL_BANKACCOUNTS_QUERY = 'SELECT bankAccount.id, accountNumber, amount, name FROM bankAccount, users WHERE bankAccount.userID = users.id';

    app.get('/api-vulnerable/bankAccount/View', (req, res) => {
        conVul.query(SELECT_ALL_BANKACCOUNTS_QUERY, (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.json({
                    Accounts: results
                })
            }
        });
    });

    //Add Account

    app.post('/api-vulnerable/bankAccount/Add', (req, res) => {
        const { accountNumber, amount, userID } = req.body;
        console.log(accountNumber, amount, userID);
        const INSERT_ACCOUNT_QUERY = `INSERT INTO bankAccount (accountNumber, amount, userID) VALUES(${accountNumber},${amount}, ${userID})`;
        conVul.query(INSERT_ACCOUNT_QUERY, (err, results) => {
            if (err) {
                console.log("Error Ocurred", err);
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                })
            }
            else {
                console.log("Account added:", results);
                res.send({
                    "code": 200,
                    "success": "Account created sucessfully"
                });
            }
        });
    });


    // bankTransfers METHODS -------------------------------------------------------------------------------------------------------------------------------------

    //Get bankTransfers
    const SELECT_ALL_BANKTRANSFERS_QUERY = 'SELECT * FROM bankTransfers';

    app.get('/api-vulnerable/transfers/View', (req, res) => {
        conVul.query(SELECT_ALL_BANKTRANSFERS_QUERY, (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.json({
                    Transfers: results
                })
            }
        });
    });

    //Add bankTransfers

    app.post('/api-vulnerable/transfers/Add', (req, res) => {
        const { moneyTransfered, originAccount, destinyAccount } = req.body;
        console.log(moneyTransfered, originAccount, destinyAccount);
        const INSERT_BANKTRANSFER_QUERY = `INSERT INTO bankTransfers (moneyTransfered, originAccount, destinyAccount) VALUES(${moneyTransfered},${originAccount}, ${destinyAccount})`;
        conVul.query(INSERT_BANKTRANSFER_QUERY, (err, results) => {
            if (err) {
                console.log("Error Ocurred", err);
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                })
            }
            else {
                console.log("Transfer added:", results);
                res.send({
                    "code": 200,
                    "success": "Transfer added sucessfully"
                });
            }
        });
    });

});

//---------------------------------------------------------------------------------

var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "bdadmin",
    password: "admin",
    database: 'db_projeto',
});

setInterval(inicialFunction, 1000);

//1ª Função
function inicialFunction() {
    var goCheckCompetitionData = checkCompetitionDate();
    goCheckCompetitionData.then(function (result) {
        var competitions = result;
        doLoopThroughCompetitions(competitions);

    })
}

//2ª Função
function checkCompetitionDate() {
    return new Promise(function (resolve, reject) {
        const SELECT_ALL_COMPETITIONS_QUERY = 'SELECT * FROM competitions';
        con.query(SELECT_ALL_COMPETITIONS_QUERY, (err, results) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(results);
            }
        });
    })
}

//3ª Função
async function doLoopThroughCompetitions(competitions) {
    for (var i in competitions) {
        if ((competitions[i].endDate <= Date.now()) && competitions[i].statusID == 2) {
            await closeCompetition(competitions[i].id);
        }
    }
}

function checkParticipantsPlaces(competitionClosed) {
    return new Promise(function (resolve, reject) {
        const SELECT_PARTICIPANTS_ORDERBY_FinalScore_FinalTime = `SELECT id, finalScore, finalTime from registrations where competitionID = ${competitionClosed} ORDER BY finalScore DESC, finalTime ASC`;
        con.query(SELECT_PARTICIPANTS_ORDERBY_FinalScore_FinalTime, (err, participantsOrderBy) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(participantsOrderBy);
            }
        })
    })

}

//4ª Função
function closeCompetition(competitionToClose) {
    return new Promise(function (resolve, reject) {
        const ALTER_COMPETITION_STATE_QUERY = `UPDATE competitions SET statusID = 4 WHERE id = ${competitionToClose}`;
        con.query(ALTER_COMPETITION_STATE_QUERY, (err, competitionAltered) => {
            if (err) {
                console.log(err);
            }
            else {
                var goCheckCompetitionChallenges = checkCompetitionChallenges(competitionToClose);
                goCheckCompetitionChallenges.then(function (competitionChallenges) {
                    var selectedChallenges = competitionChallenges;
                    var competitionParticipants = checkAllParticipants(competitionToClose);
                    competitionParticipants.then(function (participants) {
                        var allParticipants = participants;
                        doLoopThroughParticipantsAndChallenges(allParticipants, selectedChallenges, competitionToClose);
                    })

                })


            }
        })
    })
}

//5ª Função
function checkCompetitionChallenges(competitionID) {
    return new Promise(function (resolve, reject) {
        const SELECT_ALL_COMPETITION_CHALLENGES_QUERY = `SELECT * from ChallengesPerCompetition where competitionID = ${competitionID}`;
        con.query(SELECT_ALL_COMPETITION_CHALLENGES_QUERY, (err, competitionChallenges) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(competitionChallenges);
            }
        })
    })
}

//6ª Função
function checkAllParticipants(competitionID) {
    return new Promise(function (resolve, reject) {
        const SELECT_ALL_PARTICIPANTS_QUERY = `SELECT * FROM registrations where competitionID = ${competitionID}`;
        con.query(SELECT_ALL_PARTICIPANTS_QUERY, (err, participants) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(participants);
            }
        })
    })

}

//7ª Função
async function doLoopThroughParticipantsAndChallenges(participants, challenges, competitionToClose) {
    for (var participant in participants) {
        let finalParticipantScore = 0
        let finalParticipantTime = 0;
        for (var challenge in challenges) {
            await checkParticipantScoreChallenge(participants[participant].id, challenges[challenge].id).then(function (participantScoreOnChallenge) {
                if (participantScoreOnChallenge.length != 0) {
                    finalParticipantScore += participantScoreOnChallenge[0].score;
                    if (finalParticipantTime < participantScoreOnChallenge[0].time) {
                        finalParticipantTime = participantScoreOnChallenge[0].time;
                        var ms = finalParticipantTime;
                        var days, hours, mnts, seconds;
                        seconds = Math.floor(ms / 1000);
                        mnts = Math.floor(seconds / 60);
                        seconds = seconds % 60;
                        hours = Math.floor(mnts / 60);
                        mnts = mnts % 60;
                        days = Math.floor(hours / 24);
                        hours = hours % 24;
                        var timeInDays = days + " day(s) " + hours + " hour(s) " + mnts + " Minute(s) " + seconds + " Second(s)";
                        timeinDays = timeInDays.toString()
                    }
                    createScoreboard(participants[participant].id, competitionToClose, finalParticipantScore, finalParticipantTime, timeInDays);
                }

            });
        }
    }
    checkParticipantsPlaces(competitionToClose).then(function (participantsOrderBy) {
        var pos = 1;
        for (var rank in participantsOrderBy) {
            insertParticipantPlace(participantsOrderBy[rank].id, pos);
            pos++;
        }
    })
}

function insertParticipantPlace(participantID, place) {
    return new Promise(function (resolve, reject) {
        const INSERT_PARTICIPANT_PLACE_QUERY = `UPDATE registrations SET place = ${place} where id= ${participantID}`;
        con.query(INSERT_PARTICIPANT_PLACE_QUERY, (err, updatedParticipantPlace) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(updatedParticipantPlace);
            }
        })
    })
}

function checkParticipantScoreChallenge(participantID, challengeID) {
    return new Promise(function (resolve, reject) {
        const CHECK_PARTICIPANT_SCORE_CHALLENGE_QUERY = `SELECT score, time from scorePerChallengePerCompetition where registrationID = ${participantID} and challengesPerCompetitionID = ${challengeID}`;
        con.query(CHECK_PARTICIPANT_SCORE_CHALLENGE_QUERY, (err, participantScoreOnChallenge) => {
            if (err) {
                console.log(err);
            }
            else {
                resolve(participantScoreOnChallenge);
            }
        })
    })
}



//10ª Função
function createScoreboard(participantID, competitionID, totalScore, totalTime, timeInDays) {
    return new Promise(function (resolve, reject) {
        console.log('Time in Days');
        console.log(timeInDays);
        const GENERATE_SCOREBOARD_COMPETITION_QUERY = `UPDATE registrations SET finalScore= ${totalScore}, finalTime = ${totalTime}, timeInDays ='${timeInDays}'  where id= ${participantID} and competitionID = ${competitionID} `;
        con.query(GENERATE_SCOREBOARD_COMPETITION_QUERY, (err, scoreboard) => {
            if (err) {
                reject(err);
            }
            else {
            }
        })
    })
}








con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to Mysql DB!");

    var UsersTb = "CREATE TABLE if not exists users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(50) NOT NULL UNIQUE, password VARCHAR(20) NOT NULL, name VARCHAR(50) NOT NULL, email VARCHAR(50) NOT NULL UNIQUE, role VARCHAR(15) NOT NULL, creationDate DATETIME)";
    con.query(UsersTb, function (err, result) {
        if (err) throw err;
        console.log("Table Users Created");
    });

    var DifficultyTb = "CREATE TABLE if not exists difficulty (id INT AUTO_INCREMENT PRIMARY KEY, level VARCHAR(20) NOT NULL UNIQUE)";
    con.query(DifficultyTb, function (err, result) {
        if (err) throw err;

        const INSERT_DIFFICULTY_EASY_QUERY = `INSERT into difficulty (level) VALUES('Easy')`;
        const INSERT_DIFFICULTY_NORMAL_QUERY = `INSERT into difficulty (level) VALUES('Normal')`;
        const INSERT_DIFFICULTY_HARD_QUERY = `INSERT into difficulty (level) VALUES('Hard')`;
        con.query(INSERT_DIFFICULTY_EASY_QUERY, (err, results) => {
        });
        con.query(INSERT_DIFFICULTY_NORMAL_QUERY, (err, results) => {
        });
        con.query(INSERT_DIFFICULTY_HARD_QUERY, (err, results) => {
        });
        console.log("Table Difficulty Created and Populated");
    });

    var StatusTb = "CREATE TABLE if not exists status (id INT AUTO_INCREMENT PRIMARY KEY,  statusName VARCHAR(30) NOT NULL UNIQUE)";
    con.query(StatusTb, function (err, result) {
        if (err) throw err;
        const INSERT_STATUS_INDEVELOPMENT_QUERY = `INSERT into status (statusName) VALUES('In Development')`;
        const INSERT_STATUS_OPEN_QUERY = `INSERT into status (statusName) VALUES('Open')`;
        const INSERT_STATUS_FULL_QUERY = `INSERT into status (statusName) VALUES('Full')`;
        const INSERT_STATUS_CLOSED_QUERY = `INSERT into status (statusName) VALUES('Closed')`;
        con.query(INSERT_STATUS_INDEVELOPMENT_QUERY, (err, results) => {
        });
        con.query(INSERT_STATUS_OPEN_QUERY, (err, results) => {
        });
        con.query(INSERT_STATUS_FULL_QUERY, (err, results) => {
        });
        con.query(INSERT_STATUS_CLOSED_QUERY, (err, results) => {
        });
        console.log("Table Status Created AND Populated");
    });


    var CompetitionsTb = "CREATE TABLE if not exists competitions (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(70) NOT NULL UNIQUE, maxParticipants INT(2) NOT NULL, maxScore int(3), startDate DATETIME, endDate DATETIME, totalParticipants int(2), statusID INT(1) NOT NULL, FOREIGN KEY (statusID) references status(id))";
    con.query(CompetitionsTb, function (err, result) {
        if (err) throw err;
        console.log("Table Competitions Created");
    });

    var RegistrationsTb = "CREATE TABLE if not exists registrations (id INT AUTO_INCREMENT PRIMARY KEY, userID INT NOT NULL, competitionID INT NOT NULL, finalScore INT(3), finalTime INT(15), timeInDays VARCHAR(70), place INT(2) ,FOREIGN KEY (userID) REFERENCES users(id), FOREIGN KEY (competitionID) REFERENCES competitions(id), registrationDate DATETIME NOT NULL)";
    con.query(RegistrationsTb, function (err, result) {
        if (err) throw err;
        console.log("Table Registrations Created");
    });

    var ClassificationTb = "CREATE TABLE if not exists classifications (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(50) NOT NULL UNIQUE )";
    con.query(ClassificationTb, function (err, result) {
        if (err) throw err;
        console.log("Table Classification Created");
    });

    var SubClassificationTb = "CREATE TABLE if not exists subClassifications (id INT AUTO_INCREMENT PRIMARY KEY, classificationID INT NOT NULL, FOREIGN KEY (classificationID) REFERENCES classifications(id) , name VARCHAR(50) NOT NULL UNIQUE )";
    con.query(SubClassificationTb, function (err, result) {
        if (err) throw err;
        console.log("Table SubClassification Created");
    });

    var ChallengesTb = "CREATE TABLE if not exists challenges (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(70) NOT NULL UNIQUE, description VARCHAR(500) NOT NULL, link VARCHAR(100) NOT NULL UNIQUE, mainFile VARCHAR(50) NOT NULL, solution VARCHAR(100) NOT NULL, classificationID INT NOT NULL, difficultyID INT(1) NOT NULL , FOREIGN KEY (difficultyID) REFERENCES difficulty(id) , FOREIGN KEY (classificationID) REFERENCES classifications(id))";
    con.query(ChallengesTb, function (err, result) {
        if (err) throw err;
        console.log("Table Challenges Created");
    });

    var ChallengesPerCompetitionTb = "CREATE TABLE if not exists challengesPerCompetition (id INT AUTO_INCREMENT PRIMARY KEY, competitionID INT NOT NULL, challengeID INT NOT NULL, FOREIGN KEY (competitionID) REFERENCES competitions(id), FOREIGN KEY (challengeID) REFERENCES challenges(id), challengePoints INT(3) NOT NULL)";
    con.query(ChallengesPerCompetitionTb, function (err, result) {
        if (err) throw err;
        console.log("Table ChallengesPerCompetition Created");
    });

    var scorePerChallengePerCompetitionTb = "CREATE TABLE if not exists scorePerChallengePerCompetition (id INT AUTO_INCREMENT PRIMARY KEY, registrationID INT NOT NULL, challengesPerCompetitionID INT NOT NULL, FOREIGN KEY (registrationID) REFERENCES registrations(id), FOREIGN KEY (challengesPerCompetitionID) REFERENCES challengesPerCompetition(id), score INT(3) NOT NULL, time INT(15))";
    con.query(scorePerChallengePerCompetitionTb, function (err, result) {
        if (err) throw err;
        console.log("Table scorePerChallengePerCompetition Created");
    });

    var QuestionsTb = "CREATE TABLE if not exists questions (id INT AUTO_INCREMENT PRIMARY KEY, classificationID INT NOT NULL, description VARCHAR(200) NOT NULL, answer1 VARCHAR(200), explanation1 VARCHAR(400), answer2 VARCHAR(200), explanation2 VARCHAR(400), answer3 VARCHAR(200), explanation3 VARCHAR(400), answer4 VARCHAR(200), explanation4 VARCHAR(400), correct VARCHAR(200) NOT NULL, FOREIGN KEY (classificationID) REFERENCES classifications(id))";
    con.query(QuestionsTb, function (err, result) {
        if (err) throw err;
        console.log("Table Questions Created");
    });

    var QuizzTb = "CREATE TABLE if not exists quizzes (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(30), year DATE NOT NULL, numberQuestions INT(3), difficultyID INT(1) NOT NULL , FOREIGN KEY (difficultyID) REFERENCES difficulty(id))";
    con.query(QuizzTb, function (err, result) {
        if (err) throw err;
        console.log("Table Quizzes Created");
    });

    var QuizzQuestionsTb = "CREATE TABLE if not exists quizzQuestions (id INT AUTO_INCREMENT PRIMARY KEY, questionID INT NOT NULL, quizzID INT NOT NULL, questionPoints INT(3) NOT NULL, FOREIGN KEY (questionID) REFERENCES questions(id),FOREIGN KEY (quizzID) REFERENCES quizzes(id) , questionOrder INT(3) NOT NULL)";
    con.query(QuizzQuestionsTb, function (err, result) {
        if (err) throw err;
        console.log("Table QuizzQuestions Created");
    });

    var SuggestionsStatus = "CREATE TABLE if not exists suggestionsStatus (id INT AUTO_INCREMENT PRIMARY KEY,  status VARCHAR(30) NOT NULL UNIQUE)";
    con.query(SuggestionsStatus, function (err, result) {
        if (err) throw err;
        const INSERT_STATUS_PENDING_QUERY = `INSERT into suggestionsStatus (status) VALUES('Pending')`;
        const INSERT_STATUS_ACCEPTED_QUERY = `INSERT into suggestionsStatus (status) VALUES('Accepted')`;
        const INSERT_STATUS_DENIED_QUERY = `INSERT into suggestionsStatus (status) VALUES('Denied')`;
        con.query(INSERT_STATUS_PENDING_QUERY, (err, results) => {
        });
        con.query(INSERT_STATUS_ACCEPTED_QUERY, (err, results) => {
        });
        con.query(INSERT_STATUS_DENIED_QUERY, (err, results) => {
        });
        console.log("Table SuggestionsStatus Created AND Populated");
    });

    var QuestionSuggestionsTb = "CREATE TABLE if not exists questionSuggestions (id INT AUTO_INCREMENT PRIMARY KEY, description VARCHAR(200) NOT NULL, answer1 VARCHAR(200), explanation1 VARCHAR(400), answer2 VARCHAR(200), explanation2 VARCHAR(400), answer3 VARCHAR(200), explanation3 VARCHAR(400), answer4 VARCHAR(200), explanation4 VARCHAR(400), correct VARCHAR(200) NOT NULL, difficulty INT(1) NOT NULL, userID INT NOT NULL, FOREIGN KEY (userID) REFERENCES users(id), statusID INT(1) NOT NULL, FOREIGN KEY (statusID) REFERENCES suggestionsStatus(id))";
    con.query(QuestionSuggestionsTb, function (err, result) {
        if (err) throw err;
        console.log("Table QuestionSuggestions Created");
    });

    var ChallengeSuggestionsTb = "CREATE TABLE if not exists challengeSuggestions (id INT AUTO_INCREMENT PRIMARY KEY, userID INT NOT NULL , name VARCHAR(100), description VARCHAR(500) NOT NULL, link VARCHAR(100) NOT NULL UNIQUE, mainFile VARCHAR(50) NOT NULL, solution VARCHAR(100) NOT NULL, classificationID INT NOT NULL, difficultyID INT(1) NOT NULL , FOREIGN KEY (difficultyID) REFERENCES difficulty(id), FOREIGN KEY (userID) REFERENCES users(id), statusID INT(1) NOT NULL, FOREIGN KEY (statusID) REFERENCES suggestionsStatus(id), FOREIGN KEY (classificationID) REFERENCES classifications(id))";
    con.query(ChallengeSuggestionsTb, function (err, result) {
        if (err) throw err;
        console.log("Table ChallengeSuggestions Created");
    });




    //Methods DB

    //STATUS METHODS

    //GET ALL STATUS

    app.get('/api/status/View', (req, res) => {

        const SELECT_ALL_STATUS_QUERY = `SELECT * FROM status`;
        con.query(SELECT_ALL_STATUS_QUERY, (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.json({
                    status: results
                })
            }
        });
    });






    //DIFFICULTY
    const SELECT_ALL_DIFFICULTIES_QUERY = 'SELECT * FROM difficulty';

    app.get('/api/difficulty/View', (req, res) => {
        con.query(SELECT_ALL_DIFFICULTIES_QUERY, (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.json({
                    difficulty: results
                })
            }
        });
    });



    // USER METHODS -------------------------------------------------------------------------------------------------------------------------------------

    //Get Users
    const SELECT_ALL_USERS_QUERY = `SELECT id, username, password, name, email, role, DATE_FORMAT(creationDate, '%d-%m-%y  %H:%i:%s') creationDate  FROM users`;

    app.get('/api/users/View', (req, res) => {
        con.query(SELECT_ALL_USERS_QUERY, (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.json({
                    users: results
                })
            }
        });
    });

    //Add User

    app.post('/api/users/Add', (req, res) => {
        const { username, password, name, email, role } = req.body;
        console.log(username, password, name, role);
        const INSERT_USER_QUERY = `INSERT INTO users (username, password, name, email, role, creationDate) VALUES('${username}', '${password}', '${name}', '${email}', '${role}', DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s') )`;
        con.query(INSERT_USER_QUERY, (err, results) => {
            if (err) {
                console.log("Error Ocurred", err);
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                })
            }
            else {
                console.log("User added:", results);
                res.send({
                    "code": 200,
                    "success": "user registered sucessfully"
                });
            }
        });
    });

    //Login
    app.post('/api/users/Login', (req, res) => {
        const { username, password } = req.body;
        console.log(username, password);
        const CHECK_USER_EMAIL_QUERY = `SELECT * FROM users WHERE username = '${username}'`;
        con.query(CHECK_USER_EMAIL_QUERY, (err, results) => {
            if (err) {
                console.log("Error Ocurred", err);
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                })
            }
            else {
                console.log('The Solution is:', results);
                if (results.length > 0) {
                    console.log('length >0');
                    if (results[0].password == password) {
                        console.log('The Password Matches');
                        res.send({
                            "code": 200,
                            "success": "login sucessfull"
                        });
                    }
                }
            }
        });
    });


    //Delete User

    app.post('/api/users/Delete', (req, res) => {
        const id = req.body.id;
        console.log(req.body);
        const DELETE_USER_QUERY = `DELETE FROM users WHERE id = ${id}`;
        con.query(DELETE_USER_QUERY, (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.send('Sucessfully Deleted the user')
            }
        });
    });


    //--------------------------------------------------------------------------------------------------------------------

    // COMPETITIONS METHODS -------------------------------------------------------------------------------------------------------------------------------------



    //UPDATE COMPETITION END DATE

    app.post('/api/competitions/updateEndDate', (req, res) => {
        const { competitionID, endDate } = req.body;
        const UPDATE_COMPETITION_ENDDATE_QUERY = `UPDATE competitions SET endDate = DATE_FORMAT('${endDate}', '%Y-%m-%d %H:%i:%s') where id = ${competitionID}`;
        con.query(UPDATE_COMPETITION_ENDDATE_QUERY, (err, results) => {
            if (err) {
                return res.status(400).json({
                    message: 'Failed to update the competition End Date'
                })
            }
            else {
                return res.status(200).json({
                    message: 'Sucessfully updated the Competition end date'
                })
            }
        });
    });

    //UPDATE COMPETITION STATUS

    app.post('/api/competitions/updateStatus', (req, res) => {

        const competitionID = req.body.competitionID;
        const statusID = req.body.statusID;


        const UPDATE_COMPETITION_STATUS_QUERY = `UPDATE competitions SET statusID = ${statusID} where id = ${competitionID}`;
        con.query(UPDATE_COMPETITION_STATUS_QUERY, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    message: 'Failed to change competition status'
                })
            }
            else {
                return res.status(200).json({
                    message: 'Changed the Competition Status sucessfully'
                })
            }
        });
    });

    //UPDATE COMPETITION MAX PARTICIPANTS

    app.post('/api/competitions/updateMaxParticipants', (req, res) => {
        const { competitionID, maxParticipants } = req.body;
        const UPDATE_COMPETITION_MAX_PARTICIPANTS_QUERY = `UPDATE competitions SET maxParticipants = ${maxParticipants} where id = ${competitionID}`;
        con.query(UPDATE_COMPETITION_MAX_PARTICIPANTS_QUERY, (err, results) => {
            if (err) {
                return res.status(400).json({
                    message: 'Failed to update the competition Max Participants'
                })
            }
            else {
                return res.status(200).json({
                    message: 'Sucessfully updated the Competition Max Participants'
                })
            }
        });
    });



    //Get Competition by ID

    app.get('/api/getcompetitionByID/:id', (req, res) => {
        const id = req.params.id;
        const SELECT_COMPETITIONBYID_QUERY = `SELECT c.id, c.name, c.maxParticipants, c.maxScore, DATE_FORMAT(c.startDate, '%d-%m-%y  %H:%i:%s') startDate, DATE_FORMAT(c.endDate, '%d-%m-%y  %H:%i:%s') endDate, c.totalParticipants, s.statusName FROM competitions c, status s where c.statusID = s.id and  c.id = ${id}`;
        con.query(SELECT_COMPETITIONBYID_QUERY, (err, results) => {
            if (err) {
                console.log("ERRO ERRO");
                return res.send(err)
            }
            else {
                return res.json({
                    competition: results[0]
                })
            }
        });
    });


    //Get Competitions
    const SELECT_ALL_COMPETITIONS_QUERY = `SELECT c.id, c.name, c.maxParticipants, c.maxScore, DATE_FORMAT(c.startDate, '%d-%m-%y  %H:%i:%s') startDate, DATE_FORMAT(c.endDate, '%d-%m-%y  %H:%i:%s') endDate, c.totalParticipants, s.statusName FROM competitions c, status s where c.statusID = s.id`;

    app.get('/api/competitions/View', (req, res) => {
        con.query(SELECT_ALL_COMPETITIONS_QUERY, (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.json({
                    competitions: results
                })
            }
        });
    });

    //Add Competition

    app.post('/api/competitions/Add', (req, res) => {
        const { name, maxParticipants, endDate } = req.body;
        const maxScore = 0;
        const totalParticipants = 0;
        const statusID = 1;
        console.log(name, maxParticipants, maxScore, endDate, totalParticipants, statusID);
        const INSERT_COMPETITION_QUERY = `INSERT INTO competitions (name, maxParticipants, maxScore, startDate, endDate, totalParticipants, statusID ) VALUES('${name}', ${maxParticipants}, ${maxScore}, DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'), DATE_FORMAT('${endDate}', '%Y-%m-%d %H:%i:%s'), ${totalParticipants}, ${statusID})`;
        con.query(INSERT_COMPETITION_QUERY, (err, results) => {
            if (err) {
                return res.status(400).json({
                    message: 'Failed to Add the competition'
                })
            }
            else {
                console.log(results.insertId);
                return res.status(200).json({
                    message: 'Sucessfully Added the Competition',
                    insertedCompetitionID: results.insertId
                })
            }
        });
    });

    //Delete Competition

    app.post('/api/competitions/Delete', (req, res) => {
        const id = req.body.id;
        const DELETE_COMPETITION_QUERY = `DELETE FROM competitions WHERE id = ${id}`;
        con.query(DELETE_COMPETITION_QUERY, (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.send('Sucessfully Deleted the competition')
            }
        });
    });

    //--------------------------------------------------------------------------------------------------------------------

    // CHALLENGES METHODS -------------------------------------------------------------------------------------------------------------------------------------

    //Get Challenges
    const SELECT_ALL_CHALLENGES_QUERY = 'SELECT c.id, c.name, c.description, c.link, c.mainFile, c.solution, cl.name classification, d.level FROM challenges c, classifications cl, difficulty d where c.classificationID = cl.id and c.difficultyID = d.id';

    app.get('/api/challenges/View', (req, res) => {
        con.query(SELECT_ALL_CHALLENGES_QUERY, (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.json({
                    challenges: results
                })
            }
        });
    });

    //Get Challenge By ID


    app.get('/api/challengeById/:id', (req, res) => {
        const id = req.params.id;
        const SELECT_CHALLENGEBYID_QUERY = `SELECT c.id, c.name, c.description, c.link, c.mainFile, c.solution, cl.name classification, d.level FROM challenges c, classifications cl, difficulty d where c.classificationID = cl.id and c.difficultyID = d.id and c.id = ${id}`;
        con.query(SELECT_CHALLENGEBYID_QUERY, (err, results) => {
            if (err) {
                console.log("ERRO ERRO");
                return res.send(err)
            }
            else {
                console.log(results);
                return res.json({
                    challenge: results
                })
            }
        });
    });

    //Add Challenge

    app.post('/api/challenges/Add', (req, res) => {
        const { name, description, link, mainFile, solution, classificationID, difficultyID } = req.body;
        console.log(name, description, link, mainFile, solution, classificationID, difficultyID);
        const INSERT_CHALLENGE_QUERY = `INSERT INTO challenges (name, description, link, mainFile, solution, classificationID, difficultyID) VALUES('${name}', '${description}', '${link}', '${mainFile}', '${solution}' , ${classificationID}, ${difficultyID} )`;
        con.query(INSERT_CHALLENGE_QUERY, (err, results) => {
            if (err) {
                return res.status(400).json({
                    message: 'Failed to Add Challenge'
                })
            }
            else {
                return res.status(200).json({
                    message: 'Successfully added challenge'
                })
            }
        });
    });

    //Delete Challenge

    app.post('/api/challenges/Delete', (req, res) => {
        const id = req.body.id;

        const CHECK_IF_CHALLENGE_IN_USE = `SELECT * FROM challengesPerCompetition where challengeID = ${id}`;
        con.query(CHECK_IF_CHALLENGE_IN_USE, (err, exists) => {
            if (err) {
                console.log(err);
                return res.send(err)
            }
            else {
                console.log(exists);
                if (exists.length == 0) {
                    const DELETE_CHALLENGE_QUERY = `DELETE FROM challenges WHERE id = ${id}`;
                    con.query(DELETE_CHALLENGE_QUERY, (err, results) => {
                        if (err) {
                            return res.send(err)
                        }
                        else {
                            return res.status(200).json({
                                message: 'Challenge Deleted'
                            })
                        }
                    });
                } else {
                    return res.status(400).json({
                        message: 'Challenge in Use'
                    })
                }
            }
        });




    });

    //--------------------------------------------------------------------------------------------------------------------

    // CHALLENGESPERCOMPETITION METHODS -------------------------------------------------------------------------------------------------------------------------------------


    //Get All Competition Challenges
    app.get('/api/challengesPerCompetition/getCompetitionChallenges/:competitionID', (req, res) => {
        const competitionID = req.params.competitionID;
        const SELECT_ALL_COMPETITION_CHALLENGES_QUERY = `SELECT cpc.id, cpc.challengeID, cpc.challengePoints, cl.name classification, cpc.competitionID, c.description, d.level, c.link, c.mainFile, c.name  FROM challengesPerCompetition cpc, challenges c, difficulty d, classifications cl where cpc.competitionID = ${competitionID} and cpc.challengeID = c.id and c.difficultyID = d.id and c.classificationID = cl.id`;
        con.query(SELECT_ALL_COMPETITION_CHALLENGES_QUERY, (err, results) => {
            if (err) {
                return res.send(err);
            }
            else {
                return res.json({
                    competitionChallenges: results
                })
            }
        })
    })

    //Get challengesPerCompetition
    const SELECT_ALL_CHALLENGESPERCOMPETITION_QUERY = 'SELECT * FROM challengesPerCompetition';

    app.get('/api/challengesPerCompetition/View', (req, res) => {
        con.query(SELECT_ALL_CHALLENGESPERCOMPETITION_QUERY, (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.json({
                    challengesPerCompetition: results
                })
            }
        });
    });

    //Add challengesPerCompetition

    app.post('/api/challengesPerCompetition/Add', (req, res) => {
        const { competitionID, challengeID, challengePoints } = req.body;
        console.log(competitionID, challengeID, challengePoints);
        const INSERT_CHALLENGEPERCOMPETITION_QUERY = `INSERT INTO challengesPerCompetition (competitionID, challengeID, challengePoints) VALUES(${competitionID}, ${challengeID}, ${challengePoints} )`;
        con.query(INSERT_CHALLENGEPERCOMPETITION_QUERY, (err, results) => {
            if (err) {
                console.log(err);
                return res.send(err)
            }
            else {
                const SELECT_MAX_COMPETITION_SCORE = `SELECT maxScore FROM competitions WHERE id = ${competitionID}`;
                con.query(SELECT_MAX_COMPETITION_SCORE, (err, competitionScore) => {
                    if (err) {
                        console.log(err);
                        return res.send(err)
                    }
                    else {
                        console.log(competitionScore)
                        var competitionMaxScore = competitionScore[0].maxScore;
                        var maxScore = competitionMaxScore + challengePoints;
                        console.log(maxScore);
                        const UPDATE_MAX_COMPETITION_SCORE = `UPDATE competitions SET maxScore = ${maxScore} WHERE id= ${competitionID}`;
                        con.query(UPDATE_MAX_COMPETITION_SCORE, (err, competitionUpdatedMaxScore) => {
                            if (err) {
                                console.log(err);
                                return res.send(err)
                            }
                            else {
                                console.log('Challenge added to the Competition');
                                return res.send('Sucessfully added the challenge in the  Competition')
                            }
                        })
                    }
                })

            }
        });
    });

    //Delete challengesPerCompetition

    app.post('/api/challengesPerCompetition/Delete', (req, res) => {
        const id = req.body.id;
        const DELETE_CHALLENGEPERCOMPETITION_QUERY = `DELETE FROM challengesPerCompetition WHERE id = ${id}`;
        con.query(DELETE_CHALLENGEPERCOMPETITION_QUERY, (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.send('Sucessfully Deleted the challenge in the competition')
            }
        });
    });

    //--------------------------------------------------------------------------------------------------------------------

    // REGISTRATIONS METHODS -------------------------------------------------------------------------------------------------------------------------------------

    //GetAllCompetitionRegistrations

    app.get('/api/registrations/getCompetitionRegistrations/:competitionID', (req, res) => {
        const competitionID = req.params.competitionID;
        const SELECT_ALL_COMPETITION_REGISTRATIONS = `SELECT r.id, u.username, r.competitionID, r.finalScore, r.finalTime, r.timeInDays, r.place, DATE_FORMAT(r.registrationDate, '%d-%m-%y  %H:%i:%s') FROM registrations r, users u WHERE r.competitionID = ${competitionID} and r.userID = u.id ORDER BY place`;

        con.query(SELECT_ALL_COMPETITION_REGISTRATIONS, (err, compRegistrations) => {
            if (err) {
                return res.send(err);
            }
            else {
                return res.json({
                    registrations: compRegistrations
                })
            }
        })


    })


    //Get REGISTRATIONS
    const SELECT_ALL_REGISTRATIONS_QUERY = `SELECT id, userID, competitionID, finalScore, finalTime, DATE_FORMAT(registrationDate, '%d-%m-%y  %H:%i:%s') FROM registrations`;

    app.get('/api/registrations/View', (req, res) => {
        con.query(SELECT_ALL_REGISTRATIONS_QUERY, (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.json({
                    registrations: results
                })
            }
        });
    });

    //Get User Registrations
    app.get('/api/userRegistrations/:userID', (req, res) => {
        const userID = req.params.userID;
        const SELECT_USERREGISTRATIONS_QUERY = `SELECT competitionID FROM registrations where userID = ${userID}`;
        con.query(SELECT_USERREGISTRATIONS_QUERY, (err, results) => {
            if (err) {
                console.log("ERRO ERRO");
                return res.send(err)
            }
            else {
                return res.json({
                    registrations: results
                })
            }
        });
    });

    //Get Registration Info by competition and user
    app.get('/api/registrations/participantInfo/:competitionID/:userID', (req, res) => {
        const competitionID = req.params.competitionID;
        const userID = req.params.userID;
        const GET_PARTICIPANT_ID_QUERY = `SELECT id from registrations where userID = ${userID} and competitionID = ${competitionID}`;
        con.query(GET_PARTICIPANT_ID_QUERY, (err, participantInfo) => {
            if (err) {
                return res.send(err);
            }
            else {
                let participantID = participantInfo[0].id;
                const SELECT_PARTICIPANT_TOTAL_SCORE_QUERY = `SELECT * from registrations where id = ${participantID}`;
                con.query(SELECT_PARTICIPANT_TOTAL_SCORE_QUERY, (err, particiapantInfo) => {
                    if (err) {
                        return res.send(err);
                    }
                    else {
                        return res.json({
                            participantInfo: particiapantInfo[0]
                        })
                    }
                })

            }
        })

    })

    //Add REGISTRATIONS

    app.post('/api/registrations/Add', (req, res) => {
        const userID = req.body.userID;
        const competitionID = req.body.competitionID;
        const CHECK_COMPETITION_NUMBER_PARTICIPANTS_QUERY = `SELECT * FROM competitions where id = ${competitionID}`;
        con.query(CHECK_COMPETITION_NUMBER_PARTICIPANTS_QUERY, (err, competitionInfo) => {
            if (err) {
                return res.send(err);
            }
            else {
                if (competitionInfo[0].totalParticipants < competitionInfo[0].maxParticipants) {
                    const finalScore = 0;
                    const finalTime = 0;
                    const INSERT_REGISTRATION_QUERY = `INSERT INTO registrations (userID, competitionID, finalScore, finalTime, registrationDate) VALUES(${userID}, ${competitionID}, ${finalScore}, ${finalTime}, DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))`;
                    con.query(INSERT_REGISTRATION_QUERY, (err, results) => {
                        if (err) {
                            return res.send(err)
                        }
                        else {
                            var competitionParticipants = competitionInfo[0].totalParticipants;
                            competitionParticipants += 1;
                            console.log('Updating Competition Number of participants');
                            const UPDATE_NUMBER_PARTICIPANTS_COMPETITION_QUERY = `UPDATE competitions SET totalParticipants = ${competitionParticipants} where id = ${competitionID}`;
                            con.query(UPDATE_NUMBER_PARTICIPANTS_COMPETITION_QUERY, (err, competitionUpdatedInfo) => {
                                if (err) {
                                    return res.send(err);
                                }
                                else {
                                    console.log('Competition number of participants updated successfully');
                                    return res.send({
                                        "code": 200,
                                        "error": "The Participant was successfully added to the competition"
                                    });
                                }
                            })
                        }
                    });
                }
                else {
                    return res.send({
                        "code": 405,
                        "error": "The competition is already full!"
                    });
                }
            }
        })

    });

    //Delete REGISTRATIONS

    app.post('/api/registrations/Delete', (req, res) => {
        const id = req.body.id;
        const DELETE_REGISTRATION_QUERY = `DELETE FROM registrations WHERE id = ${id}`;
        con.query(DELETE_REGISTRATION_QUERY, (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.send('Sucessfully Deleted the registration')
            }
        });
    });

    //--------------------------------------------------------------------------------------------------------------------

    // scorePerChallengePerCompetition METHODS -------------------------------------------------------------------------------------------------------------------------------------

    app.get('/api/scorePerChallengePerCompetition/challengesDone/:competitionID/:userID', (req, res) => {
        const competitionID = req.params.competitionID;
        const userID = req.params.userID;

        const GET_PARTICIPANT_ID_QUERY = `SELECT id from registrations where userID = ${userID} and competitionID = ${competitionID}`;
        con.query(GET_PARTICIPANT_ID_QUERY, (err, participantInfo) => {
            if (err) {
                return res.send(err);
            }
            else {
                participantID = participantInfo[0].id;
                const GET_COMPETITION_CHALLENGES_ID_QUERY = `SELECT id from challengesPerCompetition where competitionID =${competitionID}`;
                var challenges = [];
                con.query(GET_COMPETITION_CHALLENGES_ID_QUERY, (err, competitionChallenges) => {
                    if (err) {
                        return res.send(err);
                    }
                    else {
                        for (var i in competitionChallenges) {
                            challenges[i] = competitionChallenges[i].id;
                        }

                        const GET_CHALLENGES_DONE = `SELECT * FROM scorePerChallengePerCompetition where registrationID = ${participantID} and id IN (${challenges.join()})`;
                        con.query(GET_CHALLENGES_DONE, (err, challengesDone) => {
                            if (err) {
                                return res.send(err);
                            }
                            else {
                                return res.json({
                                    challengesDone: challengesDone
                                })
                            }
                        })

                    }
                })


            }
        })



    })


    //Get scorePerChallengePerCompetition
    const SELECT_ALL_SCOREPERCHALLENGEPERCOMPETITION_QUERY = 'SELECT * FROM scorePerChallengePerCompetition';

    app.get('/api/scorePerChallengePerCompetition/View', (req, res) => {
        con.query(SELECT_ALL_SCOREPERCHALLENGEPERCOMPETITION_QUERY, (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.json({
                    scorePerChallengePerCompetition: results
                })
            }
        });
    });

    //Add scorePerChallengePerCompetition

    app.post('/api/scorePerChallengePerCompetition/Add', (req, res) => {
        const { registrationID, challengesPerCompetitionID, score, time } = req.body;
        console.log(registrationID, challengesPerCompetitionID, score, time);
        const INSERT_SCOREPERCHALLENGEPERCOMPETITION_QUERY = `INSERT INTO scorePerChallengePerCompetition (registrationID, challengesPerCompetitionID, score, time) VALUES(${registrationID}, ${challengesPerCompetitionID}, ${score}, ${time} )`;
        con.query(INSERT_SCOREPERCHALLENGEPERCOMPETITION_QUERY, (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.send('Sucessfully added the score the user had in the Challenge of the Competition')
            }
        });
    });

    //Delete scorePerChallengePerCompetition

    app.post('/api/scorePerChallengePerCompetition/Delete', (req, res) => {
        const id = req.body.id;
        const DELETE_SCOREPERCHALLENGEPERCOMPETITION_QUERY = `DELETE FROM scorePerChallengePerCompetition WHERE id = ${id}`;
        con.query(DELETE_SCOREPERCHALLENGEPERCOMPETITION_QUERY, (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.send('Sucessfully Deleted the score of the user in the challenge of the competition')
            }
        });
    });

    //PARTICIPANT GOT CORRECT ANSWER CHALLENGE

    app.post('/api/scorePerChallengePerCompetition/getScore', (req, res) => {
        const userID = req.body.userID;
        const competitionID = req.body.competitionID;
        const challengeID = req.body.challengeID;

        const SELECT_COMPETITION_CHALLENGE_QUERY = `SELECT * from challengesPerCompetition where competitionID = ${competitionID} and challengeID= ${challengeID}`;
        con.query(SELECT_COMPETITION_CHALLENGE_QUERY, (err, results) => {
            if (err) {
                return res.send(err);
            }
            else {
                const challengeScore = results[0].challengePoints;
                const competitionChallengeID = results[0].id;

                const SELECT_COMPETITION_QUERY = `SELECT * from competitions where id = ${competitionID}`;
                con.query(SELECT_COMPETITION_QUERY, (err, competitionInfo) => {
                    if (err) {
                        return res.send(err);
                    }
                    else {
                        const competitionStartDate = competitionInfo[0].startDate;
                        var time = Date.now() - competitionStartDate;

                        const SELECT_PARTICIPANT_ID = `SELECT * from registrations where userID = ${userID} and competitionID = ${competitionID}`;
                        con.query(SELECT_PARTICIPANT_ID, (err, participantInfo) => {
                            if (err) {
                                return res.send(err);
                            }
                            else {
                                var registrationID = participantInfo[0].id;
                                var participantFinalScore = participantInfo[0].finalScore;
                                const ADD_SCORE_PARTICIPANT_QUERY = `INSERT INTO scorePerChallengePerCompetition (registrationID, challengesPerCompetitionID, score, time) VALUES(${registrationID}, ${competitionChallengeID}, ${challengeScore}, ${time})`;
                                con.query(ADD_SCORE_PARTICIPANT_QUERY, (err, insertedInfo) => {
                                    if (err) {
                                        return res.send(err);
                                    }
                                    else {
                                        participantFinalScore = participantFinalScore + challengeScore;
                                        console.log(participantFinalScore);
                                        const UPDATE_PARTICIPANT_TOTAL_SCORE = `UPDATE registrations SET finalScore = ${participantFinalScore} where id=${registrationID}`;
                                        con.query(UPDATE_PARTICIPANT_TOTAL_SCORE, (err, updatedParticipantFinalScore) => {
                                            if (err) {
                                                return res.send(err);
                                            }
                                            else {
                                                return res.status(200).json({
                                                    message: 'Points were added to the Participant!'
                                                })
                                            }
                                        })

                                    }
                                })
                            }
                        })

                    }
                })


            }
        })
    })

    //--------------------------------------------------------------------------------------------------------------------

    // classifications METHODS -------------------------------------------------------------------------------------------------------------------------------------

    //Get classifications
    const SELECT_ALL_CLASSIFICATIONS_QUERY = 'SELECT * FROM classifications';

    app.get('/api/classifications/View', (req, res) => {
        con.query(SELECT_ALL_CLASSIFICATIONS_QUERY, (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.json({
                    classifications: results
                })
            }
        });
    });

    //Add classifications

    app.post('/api/classifications/Add', (req, res) => {
        const { name } = req.body;
        const INSERT_CLASSIFICATION_QUERY = `INSERT INTO classifications (name) VALUES('${name}')`;
        con.query(INSERT_CLASSIFICATION_QUERY, (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.send('Sucessfully added a Classification')
            }
        });
    });

    //Delete classifications

    app.post('/api/classifications/Delete', (req, res) => {
        const id = req.body.id;
        const DELETE_SCOREPERCHALLENGEPERCOMPETITION_QUERY = `DELETE FROM classifications WHERE id = ${id}`;
        con.query(DELETE_SCOREPERCHALLENGEPERCOMPETITION_QUERY, (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.send('Sucessfully Deleted the classification')
            }
        });
    });

    //--------------------------------------------------------------------------------------------------------------------

    // subClassifications METHODS -------------------------------------------------------------------------------------------------------------------------------------

    //Get subClassifications
    const SELECT_ALL_SUBCLASSIFICATIONS_QUERY = 'SELECT * FROM subClassifications';

    app.get('/api/subClassifications/View', (req, res) => {
        con.query(SELECT_ALL_SUBCLASSIFICATIONS_QUERY, (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.json({
                    subClassifications: results
                })
            }
        });
    });

    //Add subClassifications

    app.post('/api/subClassifications/Add', (req, res) => {
        const { classificationID, name } = req.body;
        const INSERT_SUBCLASSIFICATION_QUERY = `INSERT INTO subClassifications (classificationID, name) VALUES(${classificationID}, '${name}')`;
        con.query(INSERT_SUBCLASSIFICATION_QUERY, (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.send('Sucessfully added a subClassification')
            }
        });
    });

    //Delete subClassifications

    app.post('/api/subClassifications/Delete', (req, res) => {
        const id = req.body.id;
        const DELETE_SUBCLASSIFICATION_QUERY = `DELETE FROM subClassifications WHERE id = ${id}`;
        con.query(DELETE_SUBCLASSIFICATION_QUERY, (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.send('Sucessfully Deleted the subClassification')
            }
        });
    });

    //--------------------------------------------------------------------------------------------------------------------


    // questions METHODS -------------------------------------------------------------------------------------------------------------------------------------

    //Get questions
    const SELECT_ALL_QUESTIONS_QUERY = 'SELECT * FROM questions';

    app.get('/api/questions/View', (req, res) => {
        con.query(SELECT_ALL_QUESTIONS_QUERY, (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.json({
                    questions: results
                })
            }
        });
    });

    //Add question

    app.post('/api/questions/Add', (req, res) => {
        const { classificationID, description, answer1, explanation1, answer2, explanation2, answer3, explanation3, answer4, explanation4, correct } = req.body;
        console.log(classificationID, description, answer1, explanation1, answer2, explanation2, answer3, explanation3, answer4, explanation4, correct);
        const INSERT_QUESTIONS_QUERY = `INSERT INTO questions (classificationID, description, answer1, explanation1, answer2, explanation2, answer3, explanation3, answer4, explanation4, correct) VALUES(${classificationID}, '${description}', '${answer1}', '${explanation1}', '${answer2}', '${explanation2}', '${answer3}', '${explanation3}', '${answer4}', '${explanation4}', ${correct}, ${difficulty})`;
        con.query(INSERT_QUESTIONS_QUERY, (err, res) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.send('Sucessfully added a question')
            }
        });
    });

    //Delete question

    app.post('/api/questions/Delete', (req, res) => {
        const id = req.body.id;
        const DELETE_QUESTIONS_QUERY = `DELETE FROM questions WHERE id = ${id}`;
        con.query(DELETE_QUESTIONS_QUERY, (err, res) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.send('Sucessfully Deleted the question')
            }
        });
    });

    //--------------------------------------------------------------------------------------------------------------------

    // QuizzQuestions METHODS -------------------------------------------------------------------------------------------------------------------------------------

    //Get quizzQuestions
    const SELECT_ALL_QUIZZQUESTIONS_QUERY = 'SELECT * FROM quizzQuestions';

    app.get('/api/quizzQuestions/View', (req, res) => {
        con.query(SELECT_ALL_QUIZZQUESTIONS_QUERY, (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.json({
                    quizzQuestions: results
                })
            }
        });
    });

    //Add quizzQuestions

    app.post('/api/quizzQuestions/Add', (req, res) => {
        const { questionID, quizzID, questionPoints, questionOrder } = req.body;
        console.log(questionID, quizzID, questionPoints, questionOrder);
        const INSERT_QUIZZQUESTIONS_QUERY = `INSERT INTO quizzQuestions (questionID, quizzID, questionPoints, questionOrder) VALUES(${questionID}, ${quizzID}, ${questionPoints}, ${questionOrder})`;
        con.query(INSERT_QUIZZQUESTIONS_QUERY, (err, res) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.send('Sucessfully added a question to the quizz')
            }
        });
    });

    //Delete quizzQuestion

    app.post('/api/quizzQuestions/Delete', (req, res) => {
        const id = req.body.id;
        console.log(req.body);
        const DELETE_QUIZZQUESTIONS_QUERY = `DELETE FROM quizzQuestions WHERE id = ${id}`;
        con.query(DELETE_QUIZZQUESTIONS_QUERY, (err, res) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.send('Sucessfully Deleted the question in the Quizz')
            }
        });
    });

    //--------------------------------------------------------------------------------------------------------------------

    // Quizzes METHODS -------------------------------------------------------------------------------------------------------------------------------------

    //Get Quizzes
    const SELECT_ALL_QUIZZES_QUERY = 'SELECT * FROM quizzes';

    app.get('/api/quizzes/View', (req, res) => {
        con.query(SELECT_ALL_QUIZZES_QUERY, (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.json({
                    quizzes: results
                })
            }
        });
    });

    //Add quizzes

    app.post('/api/quizzes/Add', (req, res) => {
        const { name, year, numberQuestions, difficultyID } = req.body;
        console.log(name, year, numberQuestions, difficultyID);
        const INSERT_QUIZZES_QUERY = `INSERT INTO quizzQuestions (name, year, numberQuestions, difficultyID) VALUES('${name}', ${year}, ${numberQuestions}, ${difficultyID})`;
        con.query(INSERT_QUIZZES_QUERY, (err, res) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.send('Sucessfully added a quizz')
            }
        });
    });

    //Delete quizzes

    app.post('/api/quizzes/Delete', (req, res) => {
        const id = req.body.id;
        console.log(req.body);
        const DELETE_QUIZZQUESTIONS_QUERY = `DELETE FROM quizzQuestions WHERE id = ${id}`;
        con.query(DELETE_QUIZZQUESTIONS_QUERY, (err, res) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.send('Sucessfully Deleted the question in the Quizz')
            }
        });
    });

    //--------------------------------------------------------------------------------------------------------------------

    // questionSuggestions METHODS -------------------------------------------------------------------------------------------------------------------------------------

    //Get questionSuggestions
    const SELECT_ALL_QUESTIONSUGGESTIONS_QUERY = 'SELECT * FROM questionSuggestions';

    app.get('/api/questionSuggestions/View', (req, res) => {
        con.query(SELECT_ALL_QUESTIONSUGGESTIONS_QUERY, (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.json({
                    questionSuggestions: results
                })
            }
        });
    });

    //Add questionSuggestions

    app.post('/api/questionSuggestions/Add', (req, res) => {
        const { description, answer1, explanation1, answer2, explanation2, answer3, explanation3, answer4, explanation4, correct, userID } = req.body;
        const status = 1;
        console.log(description, answer1, explanation1, answer2, explanation2, answer3, explanation3, answer4, explanation4, correct, userID);
        const INSERT_QUESTIONSUGGESTIONS_QUERY = `INSERT INTO questionSuggestions (description, answer1, explanation1, answer2, explanation2, answer3, explanation3, answer4, explanation4, correct, userID, status) VALUES( '${description}', '${answer1}', '${explanation1}', '${answer2}', '${explanation2}', '${answer3}', '${explanation3}', '${answer4}', '${explanation4}', ${correct}, ${userID}, ${status})`;
        con.query(INSERT_QUESTIONSUGGESTIONS_QUERY, (err, res) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.send('Sucessfully added a question to the Suggestions')
            }
        });
    });

    //Delete questionSuggestions

    app.post('/api/questionSuggestions/Delete', (req, res) => {
        const id = req.body.id;
        console.log(req.body);
        const DELETE_QUESTIONSUGGESTIONS_QUERY = `DELETE FROM questionSuggestions WHERE id = ${id}`;
        con.query(DELETE_QUESTIONSUGGESTIONS_QUERY, (err, res) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.send('Sucessfully Deleted a question from the suggestions')
            }
        });
    });

    //--------------------------------------------------------------------------------------------------------------------

    // challengeSuggestions METHODS -------------------------------------------------------------------------------------------------------------------------------------

    //Get challengeSuggestions
    const SELECT_ALL_CHALLENGESUGGESTIONS_QUERY = 'SELECT cs.id, cs.name, u.username, cs.description, cs.link, cs.mainFile, cs.solution, d.id difficultyID ,d.level, c.name classification, c.id classificationID, ss.status, ss.id statusID  FROM challengeSuggestions cs, users u, difficulty d, classifications c, suggestionsStatus ss where cs.userID = u.id and cs.difficultyID = d.id and cs.classificationID = c.id and cs.statusID = ss.id';

    app.get('/api/challengeSuggestions/View', (req, res) => {
        con.query(SELECT_ALL_CHALLENGESUGGESTIONS_QUERY, (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.json({
                    challengeSuggestion: results
                })
            }
        });
    });

    //Add challengeSuggestions


    app.post('/api/challengeSuggestions/Add', (req, res) => {

        upload(req, res, (err) => {
            if (err) {
                console.log("Erro no upload do ficheiro")
                res.send(err);
            }
            else {
                console.log(req.file);
                const userID = req.body.userID;
                const name = req.body.name;
                const description = req.body.description;
                var folderName = req.file.filename;
                folderName = folderName.substring(0, folderName.lastIndexOf('.'));
                const link = req.file.destination + folderName;
                const mainFile = req.body.mainFile;
                const solution = req.body.solution;
                const difficultyID = req.body.difficultyID;
                const statusID = 1;
                const classificationID = req.body.classificationID;
                const ADD_CHALLENGESUGGESTION_QUERY = `INSERT INTO challengeSuggestions (userID, name, description,  link, mainFile, solution, classificationID,difficultyID, statusID) VALUES( ${userID}, '${name}', '${description}', '${link}', '${mainFile}', '${solution}', ${classificationID},${difficultyID}, ${statusID})`;
                con.query(ADD_CHALLENGESUGGESTION_QUERY, (err, results) => {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        console.log("Challenge suggested:", results);
                        return res.send({
                            "code": 200,
                            "success": "Challenge Added to the suggestions"
                        });

                    }
                })
            }
        })
    });

    //Accept challengeSuggestion

    app.post('/api/challengeSuggestions/Accept', (req, res) => {
        const challengeSuggestionID = req.body.challengeSuggestionID;
        const name = req.body.name;
        const description = req.body.description;
        const mainFile = req.body.mainFile;
        const solution = req.body.solution;
        const difficultyID = req.body.difficultyID;
        const link = req.body.link;
        const statusID = 2;
        const classificationID = req.body.classificationID;
        console.log(link);
        var fileName = link.substring(link.lastIndexOf('/'), link.length);
        var modifiedLink = '../challenges' + fileName + '/' + mainFile;
        const ACCEPT_CHALLENGE_SUGGESTION_QUERY = `INSERT INTO challenges (name, description, link, mainFile, solution, classificationID, difficultyID) VALUES('${name}', '${description}', '${modifiedLink}', '${mainFile}', '${solution}', ${classificationID}, ${difficultyID}) `;
        con.query(ACCEPT_CHALLENGE_SUGGESTION_QUERY, (err, results) => {
            if (err) {
                return res.send(err);
            }
            else {
                const ALTER_CHALLENGE_SUGGESTION_STATUS = `UPDATE challengeSuggestions SET statusID = ${statusID} where id = ${challengeSuggestionID}`;
                con.query(ALTER_CHALLENGE_SUGGESTION_STATUS, (err, updatedChallengeSuggestions) => {
                    mv('./uploads/' + fileName, '../reactapp/src/challenges/' + fileName, function (err) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log('Ficheiro movido com sucesso');
                            return res.send({
                                "code": 200,
                                "success": "Challenge accepted sucessfully."
                            })
                        }
                    });
                })
            }
        })

    });

    //Deny challengeSuggestions
    app.post('/api/challengeSuggestions/Deny', (req, res) => {
        const id = req.body.id;
        console.log(req.body);
        const DENY_CHALLENGESUGGESTIONS_QUERY = `UPDATE challengeSuggestions SET statusID = 3 WHERE id = ${id}`;
        con.query(DENY_CHALLENGESUGGESTIONS_QUERY, (err, results) => {
            if (err) {
                return res.send(err)
            }
            else {
                return res.send('Sucessfully Denyed the challenge from the suggestions')
            }
        });
    });

    //--------------------------------------------------------------------------------------------------------------------


});


