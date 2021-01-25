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

function refreshTable() {
    
}

function updateOrders() {

}

module.exports = {
    addOrderToDb: addOrderToDb,
    refreshTable: refreshTable,
    updateOrders: updateOrders,
};