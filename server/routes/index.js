const userRoute = require("./user");
const orderRoute = require("./order");


const init = (app) => {

    app.get("/", function(req, res) {
        res.send("It's working!");
    });

    app.use("/user", userRoute);
    app.use("/order", orderRoute);

}

module.exports = { 
    init
}
