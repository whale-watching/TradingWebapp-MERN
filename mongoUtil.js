var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

// need improvement, maybe use only one dbo
function updateUserdataToDb(jsonData) {
    
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mainDb");
        dbo.collection("userData").find({"userId": jsonData["userId"]}).toArray(function(err, user) {
            if (err) throw err;

            if(user.length) { // userId already exists
                console.log("Updating userMetadata to ", jsonData);
                // update the userData in Db
                var newValues = {$set : jsonData} 
                MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db("mainDb");
                    dbo.collection("userData").updateOne({"userId": jsonData["userId"]}, newValues, function(err, res) {
                        if (err) throw err;
                        console.log("UserMetadata updated");
                        db.close();
                    });
                });

            } else {
                // create entry and add to Db
                MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db("mainDb");
                    dbo.collection("userData").insertOne(jsonData, function(err, res) {
                        if (err) throw err;
                        console.log("inserted user to db success");
                        db.close();
                    });
                });
            }
            
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



module.exports = {
    updateUserdataToDb: updateUserdataToDb,
    addOrderToDb: addOrderToDb,
};