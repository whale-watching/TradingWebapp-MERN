var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";


function updateUserdataToDb(jsonData) {
    /*
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mainDb");
        dbo.collection("userData").find({"userId": jsonData["userId"]}).toArray(function(err, user) {
            if (err) throw err;

            if(user.count) { // userId already exists
                console.log(user.count);
                console.log(jsonData["userId"]);
                // update the userData in Db

            } else {
                // create entry and add to Db
                // need improvement, maybe use only one dbo
                MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db("mainDb");
                    dbo.collection("userId").insertOne(jsonData, function(err, res) {
                        if (err) throw err;
                        console.log("inserted user to db success");
                        db.close();
                    });
                });
            }
            
            db.close();
        });

    });
    */
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

// function to get all orders from database and show to the frontend
function refreshTable() {
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mainDb");
        dbo.collection("allOrders").find({}).toArray(function(err, result) {
            if (err) throw err;
            // console.log(result); //all orders
            db.close();
        });
    });
}



module.exports = {
    updateUserdataToDb: updateUserdataToDb,
    addOrderToDb: addOrderToDb,
    refreshTable: refreshTable,
};