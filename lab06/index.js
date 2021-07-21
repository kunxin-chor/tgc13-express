// import in the packages
const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on')

let app = express();
app.set('view engine', 'hbs');

// Inform Express where to find static images, css and
// client-side (ie. browser)
app.use(express.static('public'))


// define my routes
app.get('/', function(req,res){

})


// start the server
app.listen(3000, function(){
    console.log("server started")
})