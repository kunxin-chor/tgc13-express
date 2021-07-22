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
app.post('/pets/create', async function(req,res){
    console.log(req.body);
    let newPet = {
        "id": Math.floor(Math.random() * 1000000 + 10000),
        "category": {
          "id": 1,
          "name": req.body.category
        },
        "name": req.body.name,
        "photoUrls": [
          "string"
        ],
        "tags": [
          {
            "id": 0,
            "name": "string"
          }
        ],
        "status": req.body.status
      }      
    await axios.post('https://petstore.swagger.io/v2/pet', newPet);
    res.redirect('/pets')
})

// step 1: retrieve the information of the pet that the user
// wants to update and display in the form
app.get('/pets/:petID/update', async function(req,res){
    let petID = req.params.petID;
    // get the information of the record that we want to update
    let response = await axios.get('https://petstore.swagger.io/v2/pet/' + petID);
    // display the information of the record in the form
    res.render('edit_pet', {
        'pet': response.data
    })    
});

// step 2: update the pet base on the user's input
app.post('/pets/:petID/update', async function(req, res){
  let petID = req.params.petID;
  // write the changes back to the database
  let pet = {
    "id": petID,
    "category": {
      "id": 1,
      "name":  req.body.category
    },
    "name": req.body.name,
    "photoUrls": [
      "string"
    ],
    "tags": [
      {
        "id": 0,
        "name": "string"
      }
    ],
    "status": req.body.status
  }  
  await axios.put('https://petstore.swagger.io/v2/pet', pet);
  res.redirect('/pets')
})

app.get('/pets/:petID/delete', async function(req,res){
    let petID = req.params.petID;
    // get the information of the record that we want to update
    let response = await axios.get('https://petstore.swagger.io/v2/pet/' + petID);
    res.render('confirm_delete', {
        'pet': response.data
    })
})

app.post('/pets/:petID/delete', async function(req,res){
    let petID = req.params.petID;
    await axios.delete('https://petstore.swagger.io/v2/pet/' + petID);
    res.redirect('/pets')
})

// START SERVER
app.listen(3000, function(req,res){
    console.log("Server started")
})