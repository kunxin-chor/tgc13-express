// importing in a package
// - the name of the package is 'express'
// - we are going to refer it using the variable 'express'
const express = require('express')

// import in the hbs package
const hbs = require('hbs')

// create an express app
let app = express()

// tell Express our view engine is HBS
app.set('view engine', 'hbs')

// a route basically associates a URL with a JavaScript function
// req ==> request
// res ==> response
app.get('/', function(req,res){
    res.send("<h1>Hello World</h1>")
})

app.get('/about-us', function(req,res){
    res.send("<h1>About Us</h1>")
})

app.get('/contact-us', function(req,res){
    res.render('contact-us')
})

// :<whatever> defines a placeholder
// :fullname defines a placeholder with the name 'fullname'
app.get('/greet/:fullname', function(req,res){
    // req stands for request
    // it refers to whatever the client (usually the web browser) sends to the server
    let fullname = req.params.fullname;
    res.send("<h1>Hello " + fullname +  "!</h1>");
})

app.get('/luckynumber', function(req,res){
    let luckyNumber = Math.floor(Math.random() * 100 + 1);
    res.render('lucky',{
        'number': luckyNumber
    })
})

app.listen(3000, ()=>{
    console.log("Server started")
})