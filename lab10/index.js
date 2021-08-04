const express = require("express");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const MongoUtil = require("./MongoUtil");
const { Db } = require("mongodb");

const mongoUri = process.env.MONGO_URI;

let app = express();

// !! ENABLE JSON
app.use(express.json())

// !! ENABLE CROSS ORIGIN RESOURCES SHARING
app.use(cors())


async function main() {
    await MongoUtil.connect(mongoUri, "tgc13_food_sightings");

    // What the client will send us:
    // {
    //    'description': <desc of the food>,
    //    'food': <name of food>
    //    'location' : <location>    
    // }
    app.post('/free_food_sighting', async function(req,res){
        try {
            let description = req.body.description;
            let food = req.body.food;
            let location = req.body.location;
            let db = MongoUtil.getDB();
            let result = await db.collection('food').insertOne({
                'description': description,
                'food': food,
                'location': location,
                'datetime': new Date()
            })
            res.status(200);
            res.json({
                'insertedId': result.insertedId
            });
        } catch (e) {
            console.log(e);
            res.status(500);
            res.json({
                'error': e
            })
        }   
       
    })

    app.get('/free_food_sightings', async function(req,res){
        let db = MongoUtil.getDB();
        let results = await db.collection('food').find({}).toArray();
        res.json(results);
    })

    // 
    // { food: 'laska', 'location':'seminar room'} ==> ?food=laska&location=seminar%20room
    // free_food_sightings/search?food=laska
    app.get('/free_food_sightings/search', async function(req,res){
        // start off with an empty critera object
        // if the critera is empty when we use it with .findOne, then all the docs in the collection will be returned
        let critera = {};

        // if the description key exists in the req.query object...
        if (req.query.description) {
            // add to the critera object a key 'description' 
            critera['description'] =  {$regex: req.query.description, $options:'i'};
        }

        if (req.query.food) {
            critera['food'] = {$regex: req.query.food, $options:'i'}
        }
        console.log(critera);
        let db = MongoUtil.getDB();
        let results = await db.collection('food').find(critera).toArray();
        res.json(results);
    })

    // we use 'put' to indicate we are updating a document
    app.put('/free_food_sightings/:foodid', async function(req,res){
        let db = MongoUtil.getDB();
        let results = await db.collection('food').updateOne({
            '_id':ObjectId(req.params.foodid)
        }, {
            '$set': {
                'description': req.body.description,
                'food': req.body.food,
                'datetime': new Date()
            }
        })
        res.json(results);
    })

    app.delete('/free_food_sightings/:foodid', async function(req,res){
        let db = MongoUtil.getDB();
        let results = await db.collection('food').deleteOne({
            "_id": ObjectId(req.params.foodid)
        })
        res.json(results);
    })

}

main();

app.listen(3000, function(){
    console.log("Server has started");
})