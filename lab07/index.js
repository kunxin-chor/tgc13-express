// import in the packages
const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on')
const axios = require('axios')

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

// ROUTES
app.get('/', function(req,res){
    res.send("Hello world");
})

app.get('/pets', async function(req,res){
    // retrieve the data from the data store
    let response =  await axios.get('https://petstore.swagger.io/v2/pet/findByStatus?status=available');
    // display the data in a HBS
    res.render('pets',{
        'pets': response.data
    })
})

// display the form
app.get('/pets/create', function(req,res){
    res.render('create_pet')
})

// process the form
app.post('/pets/create', function(req,res){
    console.log(req.body);
    res.send(req.body);
})

// START SERVER
app.listen(3000, function(req,res){
    console.log("Server started")
})