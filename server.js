const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const MongoClient = require("mongodb").MongoClient;

let db;
MongoClient.connect(
  "mongodb+srv://gy1024:rkdud4020@cluster0.oemqahq.mongodb.net/node_learn?retryWrites=true&w=majority",
  function (error, client) {
    if (error) return console.log(error);

    db = client.db('node_learn')

    db.collection('post').insertOne({_id:100, name: "kim", age:28}, function (erroe, res) {
      console.log('저장완료')
    });

    app.listen("8080", function () {
      console.log("listening on 8080");
    });
  }
);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/write", function (req, res) {
  res.sendFile(__dirname + "/write.html");
});

app.post("/add", function (req, res) {
  res.send("ok");
  console.log(req.body.title);
});
