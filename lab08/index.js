// import in the packages
const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on')
const MongoUtil = require('./MongoUtil');

// setup environmental variables to store the mongo connection string
require('dotenv').config();

let app = express();
app.set('view engine', 'hbs');

// Inform Express where to find static images, css and
// client-side (ie. browser)
app.use(express.static('public'))

// Setup Wax On (for templates with HBS)
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts')

// enable forms
app.use(express.urlencoded({
    'extended': false
}))


async function main() {
    // have to connect to the mongo database before 
    // setting up the routes
    await MongoUtil.connect(process.env.MONGO_URI, 'tgc13_cico');


    // ROUTES
    // set up the express routes after we
    // connect to the database
    app.get('/', function (req, res) {
        res.send("Hello world");
    })

    app.get('/food_record/create', function (req, res) {
        res.render('add_food')
    })

    app.post('/food_record/create', function (req, res) {
        let foodName = req.body.foodName;
        let calories = req.body.calories;
        let tags = req.body.tags;
        // check if tags is undefined, change it to an empty array
        if (!tags) {
            tags = [];
        } else if (!Array.isArray(tags)) {
            // if tags is a single string,
            // change it into an array with that string as
            // the only element
            tags = [tags];
        }

        // insert into the Mongo DB
        // getg an instance of the database client
        let db = MongoUtil.getDB();
        db.collection('food').insertOne({
            'foodName': foodName,
            'calories': calories,
            'tags': tags
        })
        res.send('Food has been added')
    });


}

main();


// START SERVER
app.listen(3000, function (req, res) {
    console.log("Server started")
})