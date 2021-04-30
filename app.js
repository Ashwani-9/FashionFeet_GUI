const express = require('express');
const app = express()
var bodyParser = require('body-parser');
var mongoclient = require('mongodb').MongoClient
var db;
app.use(bodyParser.urlencoded({ extended: false }));
mongoclient.connect('mongodb://localhost:27017/Footwear',{ useUnifiedTopology: true },(err,database)=>{
    if(err)
    {
        console.log(err);
        //return err;
    }
    db = database.db('Footwear')
    app.listen(3000,()=>{
        console.log("Listening on port 3000");
    })
});

app.get("/",(req,res) => {
    db.collection('Footwear').find().toArray((err,result)=>{
        //console.log(result);
        if(err) return console.log(err);
        res.render("Home.ejs",{data:result});
    })  
})

app.get("/addItem",(req,res)=>{
    res.render('addStock.ejs');
})

app.post("/addItemDB",(req,res)=>{
    //console.log(req.body);
    try{
    db.collection('Footwear').insertOne(req.body);
    }
    catch(e)
    {
        console.log(e);
    }

    console.log("1 Item Added Successfully!!")
    res.redirect("/");
})

app.get('/updateStock',(req,res) => {
    res.render("updateStock.ejs");
})
app.post("/updateStockDB",(req,res)=>{
    //console.log(req.body.pid)
    db.collection('Footwear').updateOne({pid:req.body.pid},{$set:{stock:req.body.stock}})
    console.log("1 Stock Updated")
    res.redirect("/");
   
})
app.get("/deleteStock",(req,res) =>{
    res.render("deleteStock.ejs");
})
app.post("/deleteStockDB",(req,res) => {
    db.collection("Footwear").deleteOne({pid:req.body.pid}, function(err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
        res.redirect("/");
      });
})


