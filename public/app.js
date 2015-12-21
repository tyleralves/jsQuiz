

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

/*//MongoDB Code
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