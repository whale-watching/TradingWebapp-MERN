var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

function updateUserdataToDb(jsonData) {
    
    var newValues = {$set : jsonData} 
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mainDb");
        dbo.collection("userData").updateOne({"userId": jsonData["userId"]}, newValues, {upsert: true}, function(err, res) {
            if (err) throw err;
            console.log("userData updated to ", jsonData);
            db.close();
        });
    }); 
}


async function addOrderToDb(jsonData) {

    const client = await MongoClient.connect(url, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    });
    const db = client.db('mainDb');
    const ok = await db.collection("allOrders").insertOne(jsonData);

    if(ok)
        console.log("inserted order to db success");

    client.close();
}

async function deletePastOrders() {
    const client = await MongoClient.connect(url, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    });
    const db = client.db('mainDb');
    // execute find query
    const items = await db.collection('allOrders').find({}).toArray();
    // if any order present in allOrders then delete them,
    if(items.length) {
        var deleted = await db.collection("allOrders").drop();
        if(deleted)
            console.log("past orders are deleted succesfully");
        }

    client.close();
}

function sendPastOrders(io){
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mainDb");
        dbo.collection("allOrders").find({}).toArray(function(err, result) {
            if (err) throw err;

            // console.log('sending', result); //all orders
            io.emit("pastOrders", result);

            db.close();
        });
    });
}


module.exports = {
    updateUserdataToDb: updateUserdataToDb,
    addOrderToDb: addOrderToDb,
    deletePastOrders: deletePastOrders,
    sendPastOrders: sendPastOrders
};