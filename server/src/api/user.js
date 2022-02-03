const bcrypt = require("bcrypt");
const passport = require("passport");
const {
  generate10DigitAlphaNumeric,
} = require("../util/randomNumberGenerator");

const { getUserDb, getUserData } = require("../config/database");

let action = {};

action.login = (req, res, done) => {
  console.log("got data from frontend = ", req.body);

  const data = req.body;
  
  
  if (!data.email) {
    return res.status(422).json({
      errors: {
        email: "is required",
      },
    });
  }

  if (!data.password) {
    return res.status(422).json({
      errors: {
        password: "is required",
      },
    });
  }
  

  return passport.authenticate(
    "local",
    { session: false },
    (err, passportUser, info) => {
      if (err) {
        console.log("passport error", err);
        return done(err);
      }

      // console.log("error in passport authenticate", err)
      // console.log("passport user ", passportUser);

      if (passportUser) {
        let user = {
          id: passportUser.id,
          name: passportUser.name,
          email: passportUser.email,
        };

        console.log("User is authenticated, returning user", user);

        return res.json({
          success: true,
          user: user,
        });
      } else {
        console.log("not user found err: ", info.message);
        return res.json({
          success: false,
          error: info.message,
        });
      }
    }
  )(req, res, done);
};

action.logout = (req, res, callback) => {
  console.log("\n\n in logout route");
};

action.register = async (req, res, callback) => {
  console.log("\n\n in register route");

  const id = generate10DigitAlphaNumeric();
  const { name, email, password } = req.body;

  const userDb = await getUserDb();
  const userData = await getUserData();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    var allOrders = [];
    var balance = 10000;
    var holding = {};
    var lastTotalAssetChange = "none";
    var sortedHolding = {};

    const dbResult = await userDb.insertOne({
      id,
      name,
      email,
      hashedPassword,
    });
    const dbDataResult = await userData.insertOne({
      id,
      email,
      allOrders,
      balance,
      holding,
      lastTotalAssetChange,
      sortedHolding,
    });
    console.log("added user to db ", dbResult.ops[0]);
    console.log("added initial userdata to db ", dbDataResult);

    // res.redirect("/login");
  } catch (err) {
    console.log("error while registering ", err);
    res.redirect("/register");
  }
};

action.updateUserDetails = (req, res, callback) => {
};

action.updateUserData = (req, res, callback) => {
  const userData = getUserData();
  let reqData = req.body;
  console.log("Got data from localstorage " + reqData);
  
  try {
     userData
       .updateOne(
         { email: reqData.email },
         {
           $set: {
             holding: reqData.holding,
             balance: reqData.balance,
             sortedHolding: reqData.sortedHolding,
             allOrders: reqData.allOrders,
           },
         }
       )
       .then(function (result) {
         console.log("Result in update user.js" + result);
         return res.json({
           success: true,
           userData: result[0],
         });
       });
  } catch (err) {
    console.log("Error getting userdata from Local");
  }
  
}

action.getUserDetails = (req, res, callback) => {};

action.getUserOrder = (req, res, callback) => {
  const userData = getUserData();
  let data = req.body.id;
  console.log("in user api" + data);
  try{

     var userOrderObject = userData.find({id : String(data)}).toArray();
    //  console.log("User Object in user.js " + JSON.parse(userOrderObject));
      userOrderObject.then(function (result) {
        console.log("Result in user.js" + result)
        return res.json({
          success: true,
          userData : result,
        });
      });

    } catch(err) {
      console.log("Error getting userdata from DB"); 
    }
};;

module.exports = action;
