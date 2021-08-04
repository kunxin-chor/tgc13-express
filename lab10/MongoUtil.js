const MongoClient =  require('mongodb').MongoClient;

// global variable to store the database client
let _db;

async function connect(url, dbname) {
    let client = await MongoClient.connect(url, {
        useUnifiedTopology: true
    })
    _db = client.db(dbname);
    console.log('Database connected');
}

function getDB() {
    return _db;
}

// allows other JavaScript files to be able to call the conenct and getDB function
module.exports = {
    connect, getDB
}