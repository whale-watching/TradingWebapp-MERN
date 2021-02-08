var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

// function to get all orders from database and show to the frontend
function displayOrders() {
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
    displayOrders: displayOrders,
}