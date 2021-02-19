var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

exports = module.exports = function(io){
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