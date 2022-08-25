const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.set("view engine" , "ejs");

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articlesSchema = new mongoose.Schema({
  title: String,
  content: String
})

const Article = mongoose.model("Article" , articlesSchema);

///////////////////////////////////Reaquests Targeting all Articles////////////////////////////////////

app.route("/articles")

.get(function(req , res){
  Article.find({} , function(err , foundArticles){
    if(!err){
      res.send(foundArticles);
    }
    else{
      res.send("Not Found");
    }
  })
})

.post(function(req , res){
  console.log(req.body.title);
  console.log(req.body.content);

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  })

  newArticle.save(function(err){
    if(!err){
      res.send("successfully saved");
    }
    else{
      res.send(err);
    }
  })
})

.delete(function(req ,res){
  Article.deleteMany({} , function(err){
    if(!err){
      res.send("Delted all");
    }
    else {
      res.send(err);
    }
  })
});

///////////////////////////////////Reaquests Targeting all Articles////////////////////////////////////

app.route("/articles/:articleTitle")
.get(function(req,res){
  Article.findOne({title: req.params.articleTitle} , function(err , foundArticle){
    if(!err){
      if(foundArticle){
        res.send(foundArticle);
      }
      else{
        res.send("not found");
      }
    }
  });
})

.put(function(req , res){
  Article.findOneAndUpdate(
    {title: req.params.articleTitle},
    {title: req.body.title , content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Updated successfully");
      }
      else {
        res.send("err")
      }
    }
  );
})

.patch(function(req ,res){

  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Updated successfully");
      }
      else{
        res.send(err);
      }
    }
  );
})

.delete(function(req , res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("deleted");
      }
      else {
        res.send(err);
      }
    }
  );
});

app.listen(3000 , function(){
  console.log("Server started at port 3000");
})
