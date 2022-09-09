const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

const dbName = "WikiDB";
mongoose.connect("mongodb://127.0.0.1:27017/"+dbName,{useNewUrlParser: true});

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const article = mongoose.model("article", articleSchema);

app.route("/articles")

    .get(function(req, res){
        article.find({}, function(err, foundItems){
            if(err){
                console.log(err);
            }
            else{
                if(foundItems){
                    res.send(foundItems);
                }
            }
        })
    })
    .post(function(req, res){
        const title = req.body.title;
        const content = req.body.content;

        const newArticle = new article({
            title: title,
            content: content
        })
        newArticle.save(function(err){
            if(!err){
                res.send("Successfully added the new articles");
            }
            else{
                res.send(err);
            }
            });
        })
    .delete(function(req, res){
        article.deleteMany({}, function(err){
            if(err){
                res.send(err);
            }
            else{
                res.send("Successfully deleted the sent data");
            }
        });
    });

//////////////////////////////////// Request Targetting all articles ///////////////////////////////////////

app.route("/articles/:titleName")
    .get(function(req, res){
        const title = req.params.titleName;
        article.findOne({title:title}, function(err, foundArticle){
            if(err){
                res.send(err);
            }
            else{
                if(!foundArticle){
                    res.send("No data found")
                }
                else{
                    res.send(foundArticle);
                }
            }
        })
    })
    
    .put(function(req, res){
        article.updateOne({title: req.params.titleName}, 
            {title: req.body.title, content: req.body.content},
            function(err, docs){
                if(!err){
                    res.send(docs);
                }
                else{
                    res.send(err);
                }
        })
    })

    .patch(function(req,res){
        article.updateOne({title: req.params.titleName}, {$set: req.body}, function(err, docs){
            if(err){
                res.send(err);
            }
            else{
                res.send(docs);
            }
        })        
    })
    .delete(function(req, res){
        article.deleteOne({title: req.params.titleName}, function(err, docs){
            if(err){
                res.send(err)
            }
            else{
                res.send(docs);
            }
        })
    })

app.listen(4000, function(req, res){
    console.log("server is up and responding..")
})