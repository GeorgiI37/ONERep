const cors = require("cors");
const express = require("express");
const app = express();
const auth=require('./config/passport')();
const passport = require("passport");
const bodyParser = require('body-parser');
const User = require("./models/user");
const localStrategy = require("passport-local");
const mongoose = require('./db/connection');
const {SERVER_URL} = require('./config/conf')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//passport middleware
app.use(auth.initialize());

//passport config
passport.use(new localStrategy(User.authenticate()));
app.use(passport.initialize());
app.use(passport.session());

global.__basedir = __dirname;
var corsOptions = {
  origin: SERVER_URL
};
app.use(cors(corsOptions));
const initRoutes = require("./src/routes");
initRoutes(app);
let port = 8080;
app.listen(port, () => {
  console.log(`Running at :${SERVER_URL}`);
});