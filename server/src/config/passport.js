const { dbUser } = require('../config/database');
const { authenticateUser } = require('../passport/passport');

const LocalStratergy = require('passport-local').Strategy;

const init = (passport) => {

    // console.log("\n init passport called");
    
    passport.use(
        new LocalStratergy({ usernameField: 'email'}, 
        authenticateUser
    ));

    passport.serializeUser((user, done)=> {
        done(null, user.id);
    });

    passport.deserializeUser((id)=> {
        dbUser.findOne( {id}, (err, user) => {
            if(err) {
                return done(err, false);
            }
            else {
                return done(null, user);
            }
        });
    });

}

module.exports = {
    init, 
}