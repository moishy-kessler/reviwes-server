const reviewsR = require("./reviews/reviews");

exports.routesInit = (app)=>{
    app.use("/",reviewsR);
}