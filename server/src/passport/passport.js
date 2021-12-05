const bcrypt = require('bcrypt');

const { db, dbUser } = require('../config/database');

const getUserByEmail = async (email, password, done) => {
    if(!email || !password) {
        return done(null);
    }

    // search for the user in db using the email
    const user = await dbUser.findOne({email});

    if(user) {
        return done(null, user);
    }
    else {
        return done(null, false);
    }
}

const authenticateUser = async (email, password, done) => {
    const user = await getUserByEmail(email);

    if(user == null) {
        return done(null, false, {message: 'No user with this email'});
    }

    try {
        if(await bcrypt.compare(password, user.password)) {
            // password right
            return done(null, user);
        }
        else {
            // wrong password
            return done(null, false, { message: 'Password incorrect' });
        }
    }
    catch(err) {
        return done(err);
    }
}

module.exports = {
    authenticateUser,
}