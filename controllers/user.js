const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// Import my Data
const User = require("../models/user.js");
const authCheck = require('./authCheck');

router.get("/register", function(req, res) {
    res.render("register",
    {
        siteTitle: "CPD | Register",
        info: "",
        color: "green",
        route: "register",
        user: null
    });
});

router.post("/register", async function(req, res) {
    try {
        const foundAccount = await User.findOne({ email: req.body.email });

        if (!foundAccount) {
            if (req.body.password !== req.body.confirmation) {
                res.render("register",
                {
                    siteTitle: "CPD | Register",
                    info: "Registration Failed: Your password and confirmation must match!",
                    color: "red",
                    user: null
                });
            }
            else {
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(req.body.password, salt);
    
                let qAuth = await User.create({
                    email: req.body.email,
                    password: hash,
                    name: "",
                    bio: "",
                    dateOfBirth: "",
                    location: ""
                });
        
                res.redirect("/");
            }
        }
        else {
            res.render("register",
            {
                siteTitle: "CPD | Register",
                info: "Registration Failed: An account with this email already exists!",
                color: "red",
                user: null
            });
        }
    }
    catch(err) {
        console.log(err);

        res.render("register",
        {
            siteTitle: "CPD | Register",
            info: "Registration Failed: Database error!",
            color: "red",
            user: null
        });
    }
});

router.get("/login", function(req, res) {
    res.render("login", 
    { 
        siteTitle: "CPD | Login",
        info: "",
        color: "green",
        user: null
    });
});

router.post("/login", async function(req, res) {
    try {
        const foundAccount = await User.findOne({ email: req.body.email });

        if (foundAccount) {
            if (await bcrypt.compare(req.body.password, foundAccount.password)) {
                req.session.currentUser = foundAccount._id;

                res.redirect("/");
            }
            else {
                res.render("login.ejs",
                {
                    siteTitle: "CPD | Login",
                    info: "Login Failed: Password incorrect!",
                    color: "red",
                    user: null
                });
            }
        }
        else {
            res.render("login.ejs",
            {
                siteTitle: "CPD | Login",
                info: "Login Failed: Account does not exist!",
                color: "red",
                user: null
            });
        }
    }
    catch(err) {
        console.log(err);

        res.render("login.ejs",
        {
            siteTitle: "CPD | Login",
            info: "Login Failed: Database error!",
            color: "red",
            user: null
        });
    }
});

router.get("/logout", async function(req, res) {
    try {
        await req.session.destroy();

        res.redirect("/user/login");
    }
    catch {
        console.log(err);
    }
});

router.get("/", authCheck, async function(req, res) {
    try {
        const foundAccount = await User.findOne({ _id: req.session.currentUser });

        if (foundAccount) {
            res.render("user", {
                siteTitle: "CPD | Account",
                user: null
            });
        }
        else {
            console.log("User not found! Can't show!");
            res.redirect("/user/login");
        }
    }
    catch {
        console.log(err);
    }
});

router.delete("/", authCheck, async function(req, res) {
    try {
        const found = await User.findByIdAndDelete(req.session.currentUser);

        if (!found) console.log("Could not find account. No deletion!");

        await req.session.destroy();

        res.redirect("/user/login");
    }
    catch {
        console.log(err);
    }
});

module.exports = router;

