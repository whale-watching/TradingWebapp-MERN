const express = require("express");
const routes = require("../../routes");

// init everything
const start = () => {

    const app = express();

    routes.init(app);
    
    const server = app.listen(8000, () => {
        console.log("app listening on port 8000");
    });
}



module.exports = {
    start
}