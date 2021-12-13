const bcrypt = require('bcrypt');

const { getUserDb } = require('../config/database');

const getUserByEmail = async (email, done) => {
    if(!email) {
        return done(null);
    }

    // search for the user in db using the email
    const userDb = await getUserDb();
    const user = await userDb.findOne({email});

    // console.log("User got form email ", user);

    return user;
}

const authenticateUser = async (email, password, done) => {
    const user = await getUserByEmail(email, done);

    if(user == null) {
        return done(null, false, {message: 'Wrong email'});
    }

    try {
        if(await bcrypt.compare(password, user.hashedPassword)) {
            // password right
            // console.log("correct password");
            return done(null, user);
        }
        else {
            // wrong password
            return done(null, false, {message: 'Wrong Password'});
        }
    }
    catch(err) {
        return done(err);
    }
}

module.exports = {
    authenticateUser,
}