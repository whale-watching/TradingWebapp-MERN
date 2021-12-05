var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

let client = null;
let db = null;
let dbUser = null;

const init = async () => {
    client = await MongoClient.connect(url, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    });
    db = client.db('mainDb');
    dbUser = db.collection("user");
}

const close = () => {
    client.close();
}

module.exports = {
    init,
    close, 
    client, 
    db, 
    dbUser,
}

