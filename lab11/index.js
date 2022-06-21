const express = require("express");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const MongoUtil = require("./MongoUtil");
const jwt = require('jsonwebtoken');

const mongoUri = process.env.MONGO_URI;

const generateAccessToken = (id, email) => {
    return jwt.sign({
        'user_id': id,
        'email': email
    }, process.env.TOKEN_SECRET, {
        expiresIn: "1h"
    });
}

let app = express();

// !! ENABLE JSON
app.use(express.json())

// !! ENABLE CROSS ORIGIN RESOURCES SHARING
app.use(cors())

// !! Middleware for JWT authentication
const checkIfAuthenticatedJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

async function main() {
    await MongoUtil.connect(mongoUri, "tgc13_food_sightings");
  
    app.post('/free_food_sighting', checkIfAuthenticatedJWT, async function(req,res){
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
    app.put('/free_food_sightings/:foodid', checkIfAuthenticatedJWT, async function(req,res){
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

    app.delete('/free_food_sightings/:foodid', checkIfAuthenticatedJWT, async function(req,res){
        let db = MongoUtil.getDB();
        let results = await db.collection('food').deleteOne({
            "_id": ObjectId(req.params.foodid)
        })
        res.json(results);
    })

    // User registration
    app.post('/users', async function(req,res){
        let db = MongoUtil.getDB();
        let result = await db.collection('users').insertOne({
            'email': req.body.email,
            'password': req.body.password          
        })
        res.status(201);
        res.json({
            'message':'New user account'
        })
    })

    // Get a JWT 
    app.post('/login', async function(req,res){
        let db = MongoUtil.getDB();
        let user = await db.collection('users').findOne({
            'email': req.body.email,
            'password': req.body.password
        })
        if (user) {
            let accessToken = generateAccessToken(user._id, user.email);
            res.send({
                accessToken
            })
        } else {
            res.send({
                'error':'Authenticaion error'
            })
        }
    })

    app.get('/profile', checkIfAuthenticatedJWT, async function(req,res){
        res.send(req.user);
    })

}

main();

app.listen(3000, function(){
    console.log("Server has started");
})