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

app.get('/show-number-form', function(req,res){
    res.render("add_numbers")
})

app.post('/show-number-form', function(req,res){
    console.log(req.body);
    let number1 = req.body.first_number;
    let number2 = req.body.second_number;
    let total = parseInt(number1) + parseInt(number2);
   res.render('sum', {
       'total': total
   })
    
});

// start the server
app.listen(3000, function(){
    console.log("server started")
})