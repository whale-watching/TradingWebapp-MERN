var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

let client = null;
let db = null;
let userDb = null;

const init = async () => {
    console.log("\n\n\n\n\n\n db init called");

    try {
        client = await MongoClient.connect(url, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true,
        });
        db = client.db('mainDb');
        userDb = db.collection("user");

        console.log("\n Db init ok");
    }
    catch(err) {
        console.log("err in dbinit", err);
    }
}

const close = () => {
    client.close();
}

const getDb = async() => {
    return db;
}

const getUserDb = async() => {
    return userDb;
}


module.exports = {
    init,
    close, 
    getDb,
    getUserDb,
}

