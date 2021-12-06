const express = require("express");
const routes = require("../../routes");
const database = require("../config/database");
const cors = require("cors")
const passport = require('passport');
const passportConf = require('../config/passport');

// const flash = require('express-flash');
const session = require('express-session');

// init everything
const start = () => {

    const app = express();
    app.use(cors());
    app.use(express.json());

    routes.init(app);
    // database.init();

    // app.use(flash());
    app.use(session({
        secret: "bigSecret",
        resave: false, 
        saveUninitialized: false,
    }));
    
    app.post("/register", (req, res) => {

    //To get the input from client login component
    
    const username = req.body.username
    const password = req.body.password
    console.log(username , password);

    });

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