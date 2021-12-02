const express = require("express");
const routes = require("../../routes");
const database = require("../config/database");

// init everything
const start = () => {

    const app = express();

    routes.init(app);
    // database.init();

    const server = app.listen(8000, () => {
        console.log("app listening on port 8000");
    });
}



module.exports = {
    start
}