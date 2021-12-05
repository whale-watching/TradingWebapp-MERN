const bcrypt = require("bcrypt");

const { db } = require("../config/database");

let userdb = [];

let user = {};

user.login = (req, res, done) => {
    console.log("\n\n in login route");
    
    const { body: { user } } = req;

    if(!user.email) {
      return res.status(422).json({
        errors: {
          email: 'is required',
        },
      });
    }
  
    if(!user.password) {
      return res.status(422).json({
        errors: {
          password: 'is required',
        },
      });
    }
  
    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
      if(err) {
        return done(err);
      }
  
      if(passportUser) {
        const user = passportUser;
        // user.token = passportUser.generateJWT();
  
        return res.json({ 
            success: true,
            user: user
        });
      }
      else {
          return res.json({
            success: false, 
          });
      }
  
    })(req, res, done);
};

user.logout = (req, res, callback) => {
    console.log("\n\n in logout route")

};

user.register = async (req, res, callback) => {
    console.log("\n\n in register route")

    const { userName, name, email, password } = req.body;

    try { 
        const hashedPassword = await bcrypt.hash(password, 10);

        const userDetails = {
            userName, 
            name, 
            email, 
            hashedPassword
        }

        // add to db
        userdb.push(userDetails);

        res.redirect("/login");
    }
    catch(err) {
        console.log(err);
        res.register("/register");
    }

    console.log("\n User was reegistered userDetails: ", userDetails);
};

user.updateUserDetails = (req, res, callback) => {

};

user.getUserDetails = (req, res, callback) => {

};

user.getUserOrder = (req, res, callback) => {

};


module.exports = user;