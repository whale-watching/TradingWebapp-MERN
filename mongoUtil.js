var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

function updateUserdataToDb(jsonData) {
    
    var newValues = {$set : jsonData} 
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mainDb");
        dbo.collection("userData").updateOne({"userId": jsonData["userId"]}, newValues, function(err, res) {
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

function resetPastOrders() {

    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mainDb");
        dbo.collection("allOrders").drop(function(err, delOK) {
            if (err) throw err;
            if (delOK) console.log("Past Orders deleted");
            db.close();
        });
    });
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
    resetPastOrders: resetPastOrders,
    sendPastOrders: sendPastOrders
};