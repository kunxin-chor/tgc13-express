// import in the packages
const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on')

let app = express();
app.set('view engine', 'hbs');

// Inform Express where to find static images, css and
// client-side (ie. browser)
app.use(express.static('public'))

// Setup Wax On (for templates with HBS)
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts')

// enable forms
app.use( express.urlencoded({
    'extended': false
}))

app.get('/', function(req,res){
    res.send("Hello")
})

// define my routes
app.get('/add-food', function(req,res){
    res.render('add_food')
})

app.post('/add-food', function(req,res){
    console.log(req.body);
    let fullname = req.body.fullname;
    res.send("Thank you, " + fullname);
})


// start the server
app.listen(3000, function(){
    console.log("server started")
})