const express = require("express");
const path = require("path");
const cors = require('cors');
const { routesInit } = require("./configRoutes");
const mongoConnect = require("./db/mongoConnect");
// The server
const app = express();
// The database URL
mongoConnect("mongodb://localhost:27017/amazon-reviews");
app.use(cors());
app.use(express.static(path.join(__dirname,"public")));
routesInit(app);

// The exit port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});