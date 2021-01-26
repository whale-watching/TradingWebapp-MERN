var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

function addOrderToDb(jsonData) {
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mainDb");
        dbo.collection("allOrders").insertOne(jsonData, function(err, res) {
            if (err) throw err;
            console.log("inserted to db success");
            db.close();
        });
    });
}

// function to get all orders from database and show to the frontend
function refreshTable() {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("mainDb");
        dbo.collection("allOrders").find({}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result); //all orders
            db.close();
        });
    });
}



module.exports = {
    addOrderToDb: addOrderToDb,
    refreshTable: refreshTable,
};