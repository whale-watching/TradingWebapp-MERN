var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/mydb";

let client = null;
let db = null;
let userDb = null;
var userOrders 

const init = async () => {
  console.log("\n\n\n\n\n\n db init called");

  try {
    client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = client.db("mainDb");
    userDb = db.collection("user");
    userOrders = db.collection("userData");
    console.log("\n Db init ok");
  } catch (err) {
    console.log("err in dbinit", err);
  }
};

const close = () => {
  client.close();
};

const getDb = async () => {
  return db;
};

const getUserDb = async () => {
  // console.log("inside database" + (userDb));
  return userDb;
};

const getUserData = () => {
  //Get user assets info
  return userOrders;
};

module.exports = {
  init,
  close,
  getDb,
  getUserDb,
  getUserData,
};
