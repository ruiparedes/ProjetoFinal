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
        
        var UsersTb = "CREATE TABLE if not exists users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(50) NOT NULL UNIQUE, password VARCHAR(20) NOT NULL, name VARCHAR(50) NOT NULL, email VARCHAR(50) NOT NULL UNIQUE, role VARCHAR(15) NOT NULL, creationDate DATE)";
        con.query(UsersTb, function (err, result) {
            if (err) throw err;
            console.log("Table Users Created");
        });

       
    
        var CompetitionsTb = "CREATE TABLE if not exists competitions (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(50) NOT NULL UNIQUE, maxParticipants INT(2) NOT NULL, status VARCHAR(15) NOT NULL, maxScore int(3), startDate DATE, endDate DATE, totalParticipants int(2))";
        con.query(CompetitionsTb, function (err, result) {
            if (err) throw err;
            console.log("Table Competitions Created");
        });

        var RegistrationsTb = "CREATE TABLE if not exists registrations (id INT AUTO_INCREMENT PRIMARY KEY, userID INT NOT NULL, competitionID INT NOT NULL, finalScore INT(3) ,FOREIGN KEY (userID) REFERENCES users(id), FOREIGN KEY (competitionID) REFERENCES competitions(id), registrationDate DATE NOT NULL)";
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
    
        var ChallengesTb = "CREATE TABLE if not exists challenges (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(50) NOT NULL UNIQUE, description VARCHAR(5000) NOT NULL, link VARCHAR(100) NOT NULL UNIQUE, solution VARCHAR(100) NOT NULL, classificationID INT NOT NULL, difficulty INT(1) NOT NULL, FOREIGN KEY (classificationID) REFERENCES classifications(id) )";
        con.query(ChallengesTb, function (err, result) {
            if (err) throw err;
            console.log("Table Challenges Created");
        });
    
        var ChallengesPerCompetitionTb = "CREATE TABLE if not exists challengesPerCompetition (id INT AUTO_INCREMENT PRIMARY KEY, competitionID INT NOT NULL, challengeID INT NOT NULL, FOREIGN KEY (competitionID) REFERENCES competitions(id), FOREIGN KEY (challengeID) REFERENCES challenges(id), challengePoints INT(3) NOT NULL, challengeOrder INT(3) NOT NULL)";
        con.query(ChallengesPerCompetitionTb, function (err, result) {
            if (err) throw err;
            console.log("Table ChallengesPerCompetition Created");
        });
    
        var scorePerChallengePerCompetitionTb = "CREATE TABLE if not exists scorePerChallengePerCompetition (id INT AUTO_INCREMENT PRIMARY KEY, registrationID INT NOT NULL, challengesPerCompetitionID INT NOT NULL, FOREIGN KEY (registrationID) REFERENCES registrations(id), FOREIGN KEY (challengesPerCompetitionID) REFERENCES challengesPerCompetition(id), score INT(3) NOT NULL)";
        con.query(scorePerChallengePerCompetitionTb, function (err, result) {
            if (err) throw err;
            console.log("Table scorePerChallengePerCompetition Created");
        });

        var QuestionsTb = "CREATE TABLE if not exists questions (id INT AUTO_INCREMENT PRIMARY KEY, classificationID INT NOT NULL, description VARCHAR(200) NOT NULL, answer1 VARCHAR(50), explanation1 VARCHAR(200), answer2 VARCHAR(50), explanation2 VARCHAR(200), answer3 VARCHAR(50), explanation3 VARCHAR(200), answer4 VARCHAR(50), explanation4 VARCHAR(200), correct INT(1) NOT NULL, difficulty INT(1) NOT NULL, FOREIGN KEY (classificationID) REFERENCES classifications(id))";
        con.query(QuestionsTb, function (err, result) {
            if (err) throw err;
            console.log("Table Questions Created");
        });

        var QuizzTb = "CREATE TABLE if not exists quizzes (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(30), year INT(4) NOT NULL, numberQuestions INT(3))";
        con.query(QuizzTb, function (err, result) {
            if (err) throw err;
            console.log("Table Quizzes Created");
        });
        
        var QuizzQuestionsTb = "CREATE TABLE if not exists quizzQuestions (id INT AUTO_INCREMENT PRIMARY KEY, questionID INT NOT NULL, quizzID INT NOT NULL, questionPoints INT(3) NOT NULL, FOREIGN KEY (quizzID) REFERENCES questions(id), questionOrder INT(3) NOT NULL)";
        con.query(QuizzQuestionsTb, function (err, result) {
            if (err) throw err;
            console.log("Table QuizzQuestions Created");
        });

        var QuestionSuggestionsTb = "CREATE TABLE if not exists questionSuggestions (id INT AUTO_INCREMENT PRIMARY KEY, description VARCHAR(200) NOT NULL, answer1 VARCHAR(50), explanation1 VARCHAR(200), answer2 VARCHAR(50), explanation2 VARCHAR(200), answer3 VARCHAR(50), explanation3 VARCHAR(200), answer4 VARCHAR(50), explanation4 VARCHAR(200), correct INT(1) NOT NULL, difficulty INT(1) NOT NULL)";
        con.query(QuestionSuggestionsTb, function (err, result) {
            if (err) throw err;
            console.log("Table QuestionSuggestions Created");
        });

        var ChallengeSuggestionsTb = "CREATE TABLE if not exists challengeSuggestions (id INT AUTO_INCREMENT PRIMARY KEY, userID INT NOT NULL , name VARCHAR(30), description VARCHAR(500) NOT NULL, link VARCHAR(100) NOT NULL UNIQUE, solution VARCHAR(100) NOT NULL, difficulty INT(1) NOT NULL )";
        con.query(ChallengeSuggestionsTb, function (err, result) {
            if (err) throw err;
            console.log("Table ChallengeSuggestions Created");
        });
    
    
        //Methods DB
    
        // USER METHODS -------------------------------------------------------------------------------------------------------------------------------------
    
        //Get Users
        const SELECT_ALL_USERS_QUERY = `SELECT id, username, password, name, email, role, DATE_FORMAT(creationDate, '%d-%m-%y') creationDate  FROM users`;
    
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
            const { username, password, name, email, role, creationDate } = req.body;
            console.log(username, password, name, role, creationDate);
            const INSERT_USER_QUERY = `INSERT INTO users (username, password, name, email, role, creationDate) VALUES('${username}', '${password}', '${name}', '${email}', '${role}', STR_TO_DATE('${creationDate}', '%d-%m-%Y') )`;
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
        const SELECT_ALL_COMPETITIONS_QUERY = `SELECT id, name, maxParticipants, status, maxScore, DATE_FORMAT(startDate, '%d-%m-%y') startDate, DATE_FORMAT(endDate, '%d-%m-%y') endDate, totalParticipants FROM competitions`;
    
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
            const { name, maxParticipants, status, maxScore, startDate, endDate,totalParticipants } = req.body;
            console.log(name, maxParticipants, status, maxScore, startDate, endDate, totalParticipants);
            const INSERT_COMPETITION_QUERY = `INSERT INTO competitions (name, maxParticipants, status, maxScore, startDate, endDate, totalParticipants) VALUES('${name}', ${maxParticipants}, '${status}', ${maxScore}, STR_TO_DATE('${startDate}', '%d-%m-%Y'), STR_TO_DATE('${endDate}', '%d-%m-%Y'), ${totalParticipants} )`;
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

        //Get Challenge By ID

    
        app.get('/api/challengeById/:id', (req, res) => {
            const id = req.params.id; 
            const SELECT_CHALLENGEBYID_QUERY = `SELECT * FROM challenges where id = ${id}`;
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
            const { name, description, link, solution, classificationID, difficulty } = req.body;
            console.log(name, description, link, solution, classificationID, difficulty);
            const INSERT_CHALLENGE_QUERY = `INSERT INTO challenges (name, description, link, solution, classificationID, difficulty) VALUES('${name}', '${description}', '${link}', '${solution}' , ${classificationID}, ${difficulty} )`;
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
            const { competitionID, challengeID, challengePoints, challengeOrder} = req.body;
            console.log(competitionID, challengeID, challengePoints, challengeOrder);
            const INSERT_CHALLENGEPERCOMPETITION_QUERY = `INSERT INTO challengesPerCompetition (competitionID, challengeID, challengePoints, challengeOrder) VALUES(${competitionID}, ${challengeID}, ${challengePoints}, ${challengeOrder} )`;
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
        const SELECT_ALL_REGISTRATIONS_QUERY = `SELECT id, userID, competitionID, finalScore, DATE_FORMAT(registrationDate, '%d-%m-%y') FROM registrations`;
    
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
            const finalScore = req.body.finalScore;
            const registrationDate = req.body.registrationDate;
            console.log(userID, competitionID, finalScore, registrationDate);
            const INSERT_REGISTRATION_QUERY = `INSERT INTO registrations (userID, competitionID, finalScore, registrationDate) VALUES(${userID}, ${competitionID}, ${finalScore}, STR_TO_DATE('${registrationDate}', '%d-%m-%Y') )`;
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
            const { name} = req.body;
            console.log(name);
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
    
        app.post('/api/classifications/Delete', (req, res) =>{
            const id = req.body.id;
            console.log(req.body);
            const DELETE_SCOREPERCHALLENGEPERCOMPETITION_QUERY = `DELETE FROM classifications WHERE id = ${id}` ;
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
            const { classificationID, name} = req.body;
            console.log(classificationID, name);
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
    
        app.post('/api/subClassifications/Delete', (req, res) =>{
            const id = req.body.id;
            console.log(req.body);
            const DELETE_SUBCLASSIFICATION_QUERY = `DELETE FROM subClassifications WHERE id = ${id}` ;
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
            const { classificationID, description, answer1, explanation1, answer2, explanation2, answer3, explanation3, answer4, explanation4, corret, difficulty} = req.body;
            console.log(classificationID, description, answer1, explanation1, answer2, explanation2, answer3, explanation3, answer4, explanation4, corret, difficulty);
            const INSERT_QUESTIONS_QUERY = `INSERT INTO questions (classificationID, description, answer1, explanation1, answer2, explanation2, answer3, explanation3, answer4, explanation4, corret, difficulty) VALUES(${classificationID}, '${description}', '${answer1}', '${explanation1}', '${answer2}', '${explanation2}', '${answer3}', '${explanation3}', '${answer4}', '${explanation4}', ${corret}, ${difficulty})`;
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
    
        app.post('/api/questions/Delete', (req, res) =>{
            const id = req.body.id;
            console.log(req.body);
            const DELETE_QUESTIONS_QUERY = `DELETE FROM questions WHERE id = ${id}` ;
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
            const { questionID, quizzID, questionPoints, questionOrder} = req.body;
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
    
        app.post('/api/quizzQuestions/Delete', (req, res) =>{
            const id = req.body.id;
            console.log(req.body);
            const DELETE_QUIZZQUESTIONS_QUERY = `DELETE FROM quizzQuestions WHERE id = ${id}` ;
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
            const { name, year, numberQuestions} = req.body;
            console.log(name, year, numberQuestions);
            const INSERT_QUIZZES_QUERY = `INSERT INTO quizzQuestions (name, year, numberQuestions) VALUES('${name}', ${year}, ${numberQuestions})`;
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
    
        app.post('/api/quizzes/Delete', (req, res) =>{
            const id = req.body.id;
            console.log(req.body);
            const DELETE_QUIZZQUESTIONS_QUERY = `DELETE FROM quizzQuestions WHERE id = ${id}` ;
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
            const { description, answer1, explanation1, answer2, explanation2, answer3, explanation3, answer4, explanation4, corret, userID} = req.body;
            console.log(description, answer1, explanation1, answer2, explanation2, answer3, explanation3, answer4, explanation4, corret, userID);
            const INSERT_QUESTIONSUGGESTIONS_QUERY = `INSERT INTO questionSuggestions (description, answer1, explanation1, answer2, explanation2, answer3, explanation3, answer4, explanation4, corret, userID) VALUES( '${description}', '${answer1}', '${explanation1}', '${answer2}', '${explanation2}', '${answer3}', '${explanation3}', '${answer4}', '${explanation4}', ${corret}, ${userID})`;
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
    
        app.post('/api/questionSuggestions/Delete', (req, res) =>{
            const id = req.body.id;
            console.log(req.body);
            const DELETE_QUESTIONSUGGESTIONS_QUERY = `DELETE FROM questionSuggestions WHERE id = ${id}` ;
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
        const SELECT_ALL_CHALLENGESUGGESTIONS_QUERY = 'SELECT * FROM challengeSuggestions';
    
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
            const { userID, name, description, link, solution, difficulty} = req.body;
            console.log(userID, name, description, link, solution, difficulty);
            const INSERT_CHALLENGESUGGESTIONS_QUERY = `INSERT INTO challengeSuggestions (userID, name, description, link, solution, difficulty) VALUES(${userID},'${name}', '${description}', '${link}', '${solution}', ${difficulty})`;
            con.query(INSERT_CHALLENGESUGGESTIONS_QUERY, (err, res) => {
                if (err) {
                    return res.send(err)
                }
                else {
                    return res.send('Sucessfully added a challenge to the suggestions')
                }
            });
        });
    
        //Delete challengeSuggestions
    
        app.post('/api/challengeSuggestions/Delete', (req, res) =>{
            const id = req.body.id;
            console.log(req.body);
            const DELETE_CHALLENGESUGGESTIONS_QUERY = `DELETE FROM challengeSuggestions WHERE id = ${id}` ;
            con.query(DELETE_CHALLENGESUGGESTIONS_QUERY, (err, res) => {
                if (err) {
                    return res.send(err)
                }
                else {
                    return res.send('Sucessfully Deleted the challenge from the suggestions')
                }
            });
        });
    
    //--------------------------------------------------------------------------------------------------------------------

    
});


