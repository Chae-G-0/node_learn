const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
const MongoClient = require("mongodb").MongoClient;
app.set("view engine", "ejs");
app.use("/public", express.static("public"));

let db;
MongoClient.connect(
  "mongodb+srv://gy1024:rkdud4020@cluster0.oemqahq.mongodb.net/node_learn?retryWrites=true&w=majority",
  function (error, client) {
    if (error) return console.log(error);

    db = client.db("node_learn");

    app.listen("8080", function () {
      console.log("listening on 8080");
    });
  }
);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "index.ejs");
});

app.get("/write", function (req, res) {
  res.sendFile(__dirname + "write.ejs");
});

app.post("/add", function (req, res) {
  res.send("전송완료");
  db.collection("counter").findOne(
    { name: "게시물갯수" },
    function (error, result) {
      console.log(result.totalPost);
      let 총게시물갯수 = result.totalPost;

      db.collection("post").insertOne(
        { _id: 총게시물갯수 + 1, title: req.body.title, date: req.body.date },
        function (error, res) {
          console.log("저장함");

          db.collection("counter").updateOne(
            { name: "게시물갯수" },
            { $inc: { totalPost: 1 } },
            function (error, result) {
              if (error) {
                return console.log(error);
              }
            }
          );
        }
      );
    }
  );
});

app.get("/list", function (req, res) {
  db.collection("post")
    .find()
    .toArray(function (error, result) {
      console.log(result);
      res.render("list.ejs", { posts: result });
    });
});

app.delete("/delete", function (req, res) {
  console.log(req.body);
  req.body._id = parseInt(req.body._id);
  db.collection("post").deleteOne(req.body, function (erroe, result) {
    console.log("삭제완료");
    res.status(200).send({ message: "성공했습니다." });
  });
});

app.get("/detail/:id", function (req, res) {
  db.collection("post").findOne(
    { _id: parseInt(req.params.id) },
    function (error, result) {
      console.log(result);
      res.render("detail.ejs", { data: result });
    }
  );
});
