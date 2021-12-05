const express = require("express");
const routes = require("../../routes");
const database = require("../config/database");

const passport = require('passport');
const passportConf = require('../config/passport');

// const flash = require('express-flash');
const session = require('express-session');

// init everything
const start = () => {

    const app = express();

    routes.init(app);
    // database.init();

    // app.use(flash());
    app.use(session({
        secret: "bigSecret",
        resave: false, 
        saveUninitialized: false,
    }));

    passportConf.init(passport);
    app.use(passport.initialize());
    app.use(passport.session());

    const server = app.listen(8000, () => {
        console.log("app listening on port 8000");
    });
}



module.exports = {
    start
}