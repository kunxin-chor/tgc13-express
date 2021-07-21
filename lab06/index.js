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

    // how to handle checkboxes
    // 1. if it is undefined, change it to store an empty array
    // 2. if it is just a single string, convert it to
    // an array containing that single string
    // 3. if it is an array, then leave it as it is
    // let tags = [];
    // // check if req.body.tags is defined
    // // if req.body.tags is undefined, it is equ. to false
    // if (req.body.tags) {
    //     // check if req.body.tags is an array?
    //     if (Array.isArray(req.body.tags)) {
    //         tags = req.body.tags;
    //     } else {
    //         // if not req.body.tags is not an array,
    //         // then it must be a single string
    //         tags = [ req.body.tags ]
    //     }
    // }

    // alternative method
    let tags = req.body.tags || [];
    tags = Array.isArray(tags) ? tags : [ tags ]
    
    // tags will be an empty array, if req.body.tags is undefined
    // will be an array with just one string inside, if req.body.tags is a string
    // will be an array with more than one string inside, if req.body.tags is an array
    console.log("Selected tags=", tags);

    let cusine = req.body.cusine;
    console.log("selected cusine is", cusine);

    // we want to store the selected ingredients in an array with the name 'ingredients'
    let ingredients = req.body.ingredients || [];
    ingredients = Array.isArray(ingredients) ? ingredients : [ ingredients ];

    console.log("selected ingredients are:", ingredients)

    res.send("Thank you, " + fullname);
})

app.get('/show-number-form', function(req,res){
    res.render("add_numbers")
})

app.post('/show-number-form', function(req,res){
    console.log(req.body);
    let number1 = req.body.first_number;
    let number2 = req.body.second_number;
    let operation = req.body.operation;
    let total = 0;
    if (operation == 'add') {
        total = parseInt(number1) + parseInt(number2);
    } else if (operation == 'subtract') {
        total = parseInt(number1) - parseInt(number2);
    } else {
        total = parseInt(number1) * parseInt(number2);
    }
   res.render('sum', {
       'total': total
   })
    
});

// start the server
app.listen(3000, function(){
    console.log("server started")
})