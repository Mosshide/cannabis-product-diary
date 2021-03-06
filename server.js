// enable environment variables
require("dotenv").config();

// express setup
const express = require("express");
const app = express();
app.set("view engine", "ejs");
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
var favicon = require('serve-favicon');
app.use(favicon("./public/logo.ico"));

//auth
const session = require('express-session');
const MongoStore = require('connect-mongo');

// imports from my code
const User = require("./models/index").user; //also connects to db
const controllers = require('./controllers');
const authCheck = controllers.authCheck;

//enable cookies
app.use(session({
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

// routes
app.use("/user", controllers.user);

app.use("/entry", authCheck, controllers.entries);

app.get("/diary", authCheck, async function(req, res) {
    try {
        const foundAccount = await User.findOne({ _id: req.session.currentUser });

        res.render("diary", {
            siteTitle: "CPD",
            user: req.session.currentUser
        });
    }
    catch(err) {
        console.log(err);
    }
});

app.get("/", async function(req, res) {
    try {
        res.render("index", {
            siteTitle: "CPD",
            user: req.session.currentUser
        });
    }
    catch(err) {
        console.log(err);
    }
});

app.get("/*", function(req, res) {
    res.render("lost", {
        siteTitle: "CPD | Not Found",
        user: req.session.currentUser
    });
})

// start server
app.listen(process.env.PORT, () => {
    console.log(`Listening for client requests on port ${process.env.PORT}`);
})