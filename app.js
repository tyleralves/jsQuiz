/**
 * Created by Tyler on 12/17/2015.
 */

//Main App Code
var qArray = [{question:"What is the authors name?", choices:["Mark","Alex","Tyler","Timothy"],correctAnswer:2},
    {question:"What hockey team is based in San Jose?", choices:["Lions","Tigers","Kings","Sharks"],correctAnswer:3},
    {question:"What is the capital of New Mexico?", choices:["Santa Fe","Pheonix","Taos","New Mexico"],correctAnswer:0},
    {question:"What was the last team that Michael Jordan played?", choices:["Seahawks","Bulls","Warriors","Wizards"],correctAnswer:3}];

var questionDiv = document.getElementById("question");
var resultsDiv = document.getElementById("resultsDiv");
var prompt = document.getElementById("qPrompt");
var choicesForm = document.getElementsByName("form1")[0];
var questionCounter = 0;
var userAnswer = [];
var currentChecked = [];
var userList = [];
var currentUser = {};
var myStorage = localStorage;

function User(theName,theEmail){
    this.name = theName;
    this.email = theEmail;
    this.quizScores = [];
    this.currentScore = 0;
}

User.prototype = {
    constructor: User,
    saveScore: function(){
        this.quizScores.push(this.currentScore);
        myStorage.setItem("userListJSON",JSON.stringify(userList));
    },
    showNameAndScore: function(){
        var scores = this.quizScores.join(",");
        return this.name + ": " + scores;
    },
    changeEmail: function(newEmail){
        this.email = newEmail;
        return "Email successfully changed to: " + this.email;
    },
    countScore: function() {
        for (var i = 0; i < qArray.length; i++) {
            if (userAnswer[i] == qArray[i].correctAnswer) {
                this.currentScore++;
            }
        }
        this.saveScore();
    }
};

document.onload = initialLoad();

function fadeChange(){
    var displayDiv = document.getElementById("fadeDiv");

    var newOpacity = .9;
    var switchDirection = true;
    var hideInterval = setInterval(function(){
        if(newOpacity>= 1){
            clearInterval(hideInterval);
        }
        if(switchDirection) {
            newOpacity -= .1;
            if(newOpacity <= 0){
                switchDirection = false;
                document.getElementById("nameDiv").style.display = "none";
                document.getElementById("welcomeBack").style.display = "none";
                document.getElementById("question").style.display = "inline-block";
                changeValues();
            }
        }else{
            newOpacity += .1;
        }
        displayDiv.style.opacity = newOpacity;
    }, 50);


}

function changeValues(){
    prompt.innerHTML = qArray[questionCounter].question;
    for(var i=0; i<choicesForm.elements.length-2; i++) {                      //Populate radio buttons with choices property from the "choices" property(array) of the questionCounter element of qArray
        choicesForm.elements[i].nextSibling.nodeValue = qArray[questionCounter].choices[i];
        document.form1.elements[i].checked = false;
    }
    if(currentChecked[questionCounter]||currentChecked[questionCounter]==0) {
        document.form1.elements[currentChecked[questionCounter]].checked = true;
    }
}

function getUserChoice(){
    //var blankReturn = true;
    userAnswer[questionCounter] = 5;
    for(var i=0; i<choicesForm.elements.length; i++) {
        if(document.form1.elements[i].checked) {
            userAnswer[questionCounter] = document.form1.elements[i].value;
            currentChecked[questionCounter] = i;
        }
    }
    if (userAnswer[questionCounter]==5) {
        alert("Please select an answer");
        questionCounter--;
        return false;
    }
    return true;
}







/*function getCookie(cookieName){                                          //Cookies disabled
 var cookieValue = document.cookie;
 var cookieStartsAt = cookieValue.indexOf(" " + cookieName + "=");
 if(cookieStartsAt == -1){
 cookieStartsAt=cookieValue.indexOf(cookieName+"=");
 }
 if(cookieStartsAt == -1){
 cookieValue=null;
 }else {
 cookieStartsAt = cookieValue.indexOf("=",cookieStartsAt)+1;
 var cookieEndsAt = cookieValue.indexOf(";",cookieStartsAt);
 if(cookieEndsAt==-1){
 cookieEndsAt = cookieValue.length;
 }
 cookieValue = decodeURI(cookieValue.substring(cookieStartsAt,cookieEndsAt));
 }
 alert(cookieValue);
 return cookieValue;
 }*/

document.nameForm.nameEnter.onclick = function(){
    var userName = document.nameForm.userName.value;
    var email = document.nameForm.email.value;
    if(userName && email) {                                                                                              //checks to see if userName and email input is filled
        for (var entry = 0; entry < userList.length; entry++) {                                                 //iterate through all User objects in userList array
            if (userList[entry].name == userName && userList[entry].email == email) {                             //check each User object for entries matching the name AND email entered
                currentUser = userList[entry];                                                                    //assign matching User object to currentUser
                currentUser.currentScore = 0;                                                                     //reset currentScore to start new quiz
                alert(currentUser.showNameAndScore());
                var userExists = true;                                                                            //sets userExists so that next if-statement fails and a new User is NOT created
            }
        }
        if (!userExists) {                                                                                      //if the data entered doesn't match the database
            currentUser = new User(userName, email);                                                                //new User object is created with name and email entered
            userList.push(currentUser);                                                                             //adding new User object to userList array
            alert(userList.join(","));                                                                              //alert: all names in userList
        }
        fadeChange();
    }else{                                                                                                      //else (no userName entered)
        alert("Please enter a username and valid email.");
        return false;                                                                                               //cancels click action so username field can be filled
    }

};
document.form1.qBack.onclick = function(){
    if(questionCounter>0) {
        questionCounter--;
        fadeChange();
    }else{
        return false;
    }
};
document.form1.qNext.onclick = function(){
    if(questionCounter<qArray.length-1) {

        if(getUserChoice()){
            fadeChange();
        }
        questionCounter++;
    }else{
        getUserChoice();
        questionCounter++;
    }
    if(questionCounter>=qArray.length){
        currentUser.countScore();
        var correctAnswers = [];                                //for displaying correct answers on results screen
        for(var i=0; i<qArray.length; i++) {                    //creating correct answers string to display
            correctAnswers += qArray[i].correctAnswer + ", ";
        }
        var resultsDiv = document.getElementById("resultsDiv");
        resultsDiv.style.display = "inline-block";
        var resultString = "Your score is: " + currentUser.currentScore +"\<br>Past scores for user " + currentUser.showNameAndScore() + "<br>" + userAnswer + "<br>" + correctAnswers;
        resultsDiv.firstElementChild.innerHTML = resultString;
        questionDiv.style.display = "none";
    }

};

document.startForm.startBtn.onclick = function(){
    fadeChange();
};

document.replayForm.replayBtn.onclick = function(){
    initialLoad();
};


function initialLoad() {
    //var testArray = [];
    //mongoTest();
    /*if(myStorage.getItem("userListJSON")) {
     alert("Local storage exists!");
     testArray = JSON.parse(myStorage.getItem("userListJSON"));
     for(var i = 0; i<testArray.length; i++) {
     //alert(JSON.stringify(testArray[i]));
     userList[i] = new User(testArray[i]["name"], testArray[i]["email"]);
     userList[i].quizScores = testArray[i]["quizScores"];
     }
     }*/
    //alert(JSON.stringify(userList));
    questionCounter = 0;
    userAnswer = [];
    currentChecked = [];
    resultsDiv.style.display = "none";
    document.getElementById("nameDiv").style.display = "inline-block";
}


/*function mongoTest(){

    var MongoClient = require('mongodb').MongoClient;
    db.books.insert({ title:'MongoDB in the Wild', description: "Tales of NoSQL Adventures"});
// the client db connection scope is wrapped in a callback:
    MongoClient.connect('mongodb://'+connection_string, function(err, db) {
        if(err) throw err;
        var collection = db.collection('books').find().limit(10).toArray(function(err, docs) {
            alert(docs);
            db.close();
        });
    });
}*/





/*MongoDB Code
var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected correctly to server");

    insertDocuments(db, function() {
        updateDocument(db, function(){
            deleteDocument(db, function(){
                findDocuments(db, function(){
                    db.close();
                });
            });
        });
    });
});

var insertDocuments = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Insert some documents
    collection.insertMany([
        {a : 1, b: 2, c:3}, {a : 2}, {a : 3}
    ], function(err, result) {
        assert.equal(err, null);
        assert.equal(3, result.result.n);
        assert.equal(3, result.ops.length);
        console.log("Inserted 3 documents into the document collection:" + JSON.stringify(result.ops));
        callback(result);
    });
};

var updateDocument = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Update document where a is 2, set b equal to 1
    collection.updateOne({ a : 2 }
        , { $set: { b : 1 } }, function(err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            console.log("Updated the document with the field a equal to 2");
            callback(result);
        });
};

var deleteDocument = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Insert some documents
    collection.deleteOne({ a : 3 }, function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Removed the document with the field a equal to 3");
        callback(result);
    });
};

var findDocuments = function(db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Find some documents
    collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        //assert.equal(26, docs.length);
        console.log("Found the following records");
        console.dir(docs);
        callback(docs);
    });
};