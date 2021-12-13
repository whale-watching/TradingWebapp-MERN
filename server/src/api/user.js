const bcrypt = require("bcrypt");
const passport = require("passport");
const {
  generate10DigitAlphaNumeric,
} = require("../util/randomNumberGenerator");

const { getUserDb } = require("../config/database");


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

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userDb = await getUserDb();

    const dbResult = await userDb
      .insertOne({ id, name, email, hashedPassword });
    console.log("added user to db ", dbResult.ops[0]);

    // res.redirect("/login");
  } catch (err) {
    console.log("error while registering ", err);
    res.redirect("/register");
  }
};

action.updateUserDetails = (req, res, callback) => {};

action.getUserDetails = (req, res, callback) => {};

action.getUserOrder = (req, res, callback) => {};

module.exports = action;
