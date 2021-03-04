var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

function updateUserdataToDb(jsonData) {
    
    var newValues = {$set : jsonData} 
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mainDb");
        dbo.collection("userData").updateOne({"userId": jsonData["userId"]}, newValues, {upsert: true}, function(err, res) {
            if (err) throw err;
            console.log("UserMetadata updated to ", jsonData);
            db.close();
        });
    }); 
}

function addOrderToDb(jsonData) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mainDb");
        dbo.collection("allOrders").insertOne(jsonData, function(err, res) {
            if (err) throw err;
            console.log("inserted order to db success");
            db.close();
        });
    });
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
            // console.log(result); //all orders
            io.sockets.on('connection', function (socket) {
                console.log("sent Past order history to frontend");
                io.emit("pastOrders", result);
            });
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