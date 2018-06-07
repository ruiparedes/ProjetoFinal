const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser');
var dateFormat = require('dateformat');


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
//Connect to MongoDB


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


con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to Mysql DB!");
        
        var UsersTb = "CREATE TABLE if not exists users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(20) NOT NULL UNIQUE, password VARCHAR(20) NOT NULL, name VARCHAR(50) NOT NULL, email VARCHAR(50) NOT NULL UNIQUE, address VARCHAR(50) NOT NULL)";
        con.query(UsersTb, function (err, result) {
            if (err) throw err;
            console.log("Table Users Created");
        });
    
        var CompetitionsTb = "CREATE TABLE if not exists competitions (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(20) NOT NULL UNIQUE, totalParticipants INT(2) NOT NULL, numberHelps INT(2) NOT NULL, discountPerHelp INT(2) NOT NULL, status VARCHAR(15) NOT NULL)";
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
    
        var RegistrationsTb = "CREATE TABLE if not exists registrations (id INT AUTO_INCREMENT PRIMARY KEY, userID INT NOT NULL, competitionID INT NOT NULL, FOREIGN KEY (userID) REFERENCES users(id), FOREIGN KEY (competitionID) REFERENCES competitions(id), registrationDate DATE NOT NULL)";
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
    
        // USER METHODS -------------------------------------------------------------------------------------------------------------------------------------
    
        //Get Users
        const SELECT_ALL_USERS_QUERY = 'SELECT * FROM users';
    
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
            const { username, password, name, email, address } = req.body;
            console.log(username, password, name, email, address);
            const INSERT_USER_QUERY = `INSERT INTO users (username, password, name, email, address) VALUES('${username}', '${password}', '${name}', '${email}', '${address}' )`;
            con.query(INSERT_USER_QUERY, (err, results) => {
                if (err) {
                    console.log("Error Ocurred", err);
                    res.send({
                        "code":400,
                        "failed": "error ocurred"
                    })
                }
                else {
                    console.log("User added:", results);
                    res.send({
                        "code":200,
                        "success": "user registered sucessfully"
                    });
                }
            });
        });
    
        //Login
        app.post('/api/users/Login', (req, res) =>{
            const { username, password} = req.body;
            console.log( username, password);
            const CHECK_USER_EMAIL_QUERY = `SELECT * FROM users WHERE username = '${username}'`;
            con.query(CHECK_USER_EMAIL_QUERY, (err, results) =>{
                if(err){
                    console.log("Error Ocurred", err);
                    res.send({
                        "code":400,
                        "failed": "error ocurred"
                    }) 
                }
                else{
                    console.log('The Solution is:', results);
                    if(results.length >0){
                        console.log('length >0');
                        if(results[0].password == password){
                            console.log('The Password Matches');
                            res.send({
                                "code":200,
                                "success":"login sucessfull"
                            });
                        }
                    }
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
    
    
        
    
    //--------------------------------------------------------------------------------------------------------------------
    
    // COMPETITIONS METHODS -------------------------------------------------------------------------------------------------------------------------------------
    
        //Get Competitions
        const SELECT_ALL_COMPETITIONS_QUERY = 'SELECT * FROM competitions';
    
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
            const { name, totalParticipants, numberHelps, discountPerHelp, status } = req.body;
            console.log(name, totalParticipants, numberHelps, discountPerHelp, status);
            const INSERT_COMPETITION_QUERY = `INSERT INTO competitions (name, totalParticipants, numberHelps, discountPerHelp, status) VALUES('${name}', ${totalParticipants}, ${numberHelps}, ${discountPerHelp}, '${status}' )`;
            con.query(INSERT_COMPETITION_QUERY, (err, results) => {
                if (err) {
                    return res.send(err)
                }
                else {
                    return res.send('Sucessfully added the competition')
                }
            });
        });
    
        //Delete Competition
    
        app.post('/api/competitions/Delete', (req, res) =>{
            const id = req.body.id;
            console.log(req.body);
            const DELETE_COMPETITION_QUERY = `DELETE FROM competitions WHERE id = ${id}` ;
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
        const SELECT_ALL_CHALLENGES_QUERY = 'SELECT * FROM challenges';
    
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
    
        //Add Challenge
    
        app.post('/api/challenges/Add', (req, res) => {
            const { name, description, link, solution } = req.body;
            console.log(name, description, link, solution);
            const INSERT_CHALLENGE_QUERY = `INSERT INTO challenges (name, description, link, solution) VALUES('${name}', '${description}', '${link}', '${solution}' )`;
            con.query(INSERT_CHALLENGE_QUERY, (err, results) => {
                if (err) {
                    return res.send(err)
                }
                else {
                    return res.send('Sucessfully added the challenge')
                }
            });
        });
    
        //Delete Challenge
    
        app.post('/api/challenges/Delete', (req, res) =>{
            const id = req.body.id;
            console.log(req.body);
            const DELETE_CHALLENGE_QUERY = `DELETE FROM challenges WHERE id = ${id}` ;
            con.query(DELETE_CHALLENGE_QUERY, (err, results) => {
                if (err) {
                    return res.send(err)
                }
                else {
                    return res.send('Sucessfully Deleted the challenge')
                }
            });
        });
    
    //--------------------------------------------------------------------------------------------------------------------
    
    // CHALLENGESPERCOMPETITION METHODS -------------------------------------------------------------------------------------------------------------------------------------
    
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
            const { competitionID, challengeID, maxScore} = req.body;
            console.log(competitionID, challengeID, maxScore);
            const INSERT_CHALLENGEPERCOMPETITION_QUERY = `INSERT INTO challengesPerCompetition (competitionID, challengeID, maxScore) VALUES(${competitionID}, ${challengeID}, ${maxScore} )`;
            con.query(INSERT_CHALLENGEPERCOMPETITION_QUERY, (err, results) => {
                if (err) {
                    return res.send(err)
                }
                else {
                    return res.send('Sucessfully added the challenge in the  Competition')
                }
            });
        });
    
        //Delete challengesPerCompetition
    
        app.post('/api/challengesPerCompetition/Delete', (req, res) =>{
            const id = req.body.id;
            console.log(req.body);
            const DELETE_CHALLENGEPERCOMPETITION_QUERY = `DELETE FROM challengesPerCompetition WHERE id = ${id}` ;
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
    
        //Get REGISTRATIONS
        const SELECT_ALL_REGISTRATIONS_QUERY = `SELECT id, userID, competitionID, DATE_FORMAT(registrationDate, '%d-%m-%y') FROM registrations`;
    
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
    
        //Add REGISTRATIONS
    
        app.post('/api/registrations/Add', (req, res) => {
            const userID = req.body.userID;
            const competitionID = req.body.competitionID;
            const registrationDate = req.body.registrationDate;
            console.log(userID, competitionID, registrationDate);
            const INSERT_REGISTRATION_QUERY = `INSERT INTO registrations (userID, competitionID, registrationDate) VALUES(${userID}, ${competitionID}, STR_TO_DATE('${registrationDate}', '%d-%m-%Y') )`;
            con.query(INSERT_REGISTRATION_QUERY, (err, results) => {
                if (err) {
                    return res.send(err)
                }
                else {
                    return res.send('Sucessfully added the registration')
                }
            });
        });
    
        //Delete REGISTRATIONS
    
        app.post('/api/registrations/Delete', (req, res) =>{
            const id = req.body.id;
            console.log(req.body);
            const DELETE_REGISTRATION_QUERY = `DELETE FROM registrations WHERE id = ${id}` ;
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
            const { registrationID, challengesPerCompetitionID, score} = req.body;
            console.log(registrationID, challengesPerCompetitionID, score);
            const INSERT_SCOREPERCHALLENGEPERCOMPETITION_QUERY = `INSERT INTO scorePerChallengePerCompetition (registrationID, challengesPerCompetitionID, score) VALUES(${registrationID}, ${challengesPerCompetitionID}, ${score} )`;
            con.query(INSERT_SCOREPERCHALLENGEPERCOMPETITION_QUERY, (err, results) => {
                if (err) {
                    return res.send(err)
                }
                else {
                    return res.send('Sucessfully added the score the user had in the Challenge of the Competition')
                }
            });
        });
    
        //Delete challengesPerCompetition
    
        app.post('/api/scorePerChallengePerCompetition/Delete', (req, res) =>{
            const id = req.body.id;
            console.log(req.body);
            const DELETE_SCOREPERCHALLENGEPERCOMPETITION_QUERY = `DELETE FROM scorePerChallengePerCompetition WHERE id = ${id}` ;
            con.query(DELETE_SCOREPERCHALLENGEPERCOMPETITION_QUERY, (err, results) => {
                if (err) {
                    return res.send(err)
                }
                else {
                    return res.send('Sucessfully Deleted the score of the user in the challenge of the competition')
                }
            });
        });
    
    //--------------------------------------------------------------------------------------------------------------------
});

