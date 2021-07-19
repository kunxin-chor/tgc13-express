// SETUP EXPRESS
const express = require('express');
const hbs = require('hbs');

let app = express();
app.set('view engine', 'hbs');

// Inform Express where to find static images
app.use(express.static('public'))

// ROUTES
// a route is to associate a URL on the server with a JavaScript function
// such that when that URL on the server is accesed,
// the associated JavaScript function will run

// req is the request, it's what the browser sends to the server
app.get('/', function(req,res){
     let luckyNumber = Math.floor(Math.random() * 100 + 1);
    res.render('hello', {
        'number': luckyNumber
    })
    // res is what we send back to the browser
})

app.get('/contact-us', function(req,res){
    res.send("Contact Us 3")
})

// START THE SERVER
// Make sure all routes are defined before starting the server
app.listen(3000, function(){
    console.log("Server has started");
});