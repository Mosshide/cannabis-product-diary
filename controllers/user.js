const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

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
            if (req.body.password.length < 8) {
                res.render("register",
                {
                    siteTitle: "CPD | Register",
                    info: "Registration Failed: Your password must be at least 8 characters!",
                    color: "red",
                    user: null
                });
            }
            else if (req.body.password !== req.body.confirmation) {
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
                    name: "Anonymous",
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

router.get("/reset", function(req, res) {
    res.render("reset-request",
    {
        siteTitle: "CPD | Reset Password",
        info: "",
        color: "green",
        user: null
    });
});

router.post("/reset", async function(req, res) {
    try {
        const foundAccount = await User.findOne({ email: req.body.email });

        if (foundAccount) {
            foundAccount.reset = {
                value: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
                exp: Date.now() + (1000 * 60 * 60 * 24)
            }
            await foundAccount.save();
        
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'cpd-noreply@notherbase.com',
                  pass: process.env.NOREPLYPW
                }
            });
              
            var mailOptions = {
                from: 'cpd-noreply@notherbase.com',
                to: foundAccount.email,
                subject: 'Password Reset for Cannabis Product Diary',
                html: `<h2>Please click the link below to reset your password.<h2><br><br><a href="https://cpd.notherbase.com/user/reset/${foundAccount.reset.value}">https://cpd.notherbase.com/user/reset/${foundAccount.reset.value}</a>`
            };
            
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);

                    res.render("reset-request",
                    {
                        siteTitle: "CPD | Reset Password",
                        info: "Reset Failed: Error sending reset link to your email!",
                        color: "red",
                        user: null
                    });
                } 
                else {
                    res.render("reset-sent",
                    {
                        siteTitle: "CPD | Reset Password",
                        info: "",
                        color: "green",
                        user: null
                    });
                }
            });
        }
        else {
            res.render("reset-request",
            {
                siteTitle: "CPD | Reset Password",
                info: "Reset Failed: Account does not exist with the email you provided!",
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
            info: "Reset Failed: Database error!",
            color: "red",
            user: null
        });
    }
});

router.get("/reset/:value", function(req, res) {
    res.render("reset",
    {
        siteTitle: "CPD | Reset Password",
        info: "",
        color: "green",
        user: null,
        value: req.params.value
    });
});

router.post("/reset/:value", async function(req, res) {
    try {
        const foundAccount = await User.findOne({ "reset.value": req.params.value });

        if (foundAccount) {
            if (foundAccount.reset.exp > Date.now()) {
                if (req.body.password.length < 8) {
                    res.render("reset",
                    {
                        siteTitle: "CPD | Reset Password",
                        info: "Error: Password does not meet requirements!",
                        color: "red",
                        user: null,
                        value: req.params.value
                    });
                }
                else if (req.body.password !== req.body.confirmation) {
                    res.render("reset",
                    {
                        siteTitle: "CPD | Reset Password",
                        info: "Error: Passwords must match!",
                        color: "red",
                        user: null,
                        value: req.params.value
                    });
                }
                else {
                    foundAccount.reset.value = -1;
                    foundAccount.reset.exp = -1;

                    const salt = await bcrypt.genSalt(10);
                    const hash = await bcrypt.hash(req.body.password, salt);
        
                    foundAccount.password = hash;
                    await foundAccount.save();

                    res.render("reset-confirmation",
                    {
                        siteTitle: "CPD | Reset Password",
                        info: "",
                        color: "green",
                        user: null
                    });
                }
            }
            else {
                res.render("reset-request",
                {
                    siteTitle: "CPD | Reset Password",
                    info: "Reset Failed: Password reset expired or was not requested!",
                    color: "red",
                    user: null
                });
            }
        }
        else {
            res.render("reset-request",
            {
                siteTitle: "CPD | Reset Password",
                info: "Reset Failed: Password reset expired or was not requested!",
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
            info: "Reset Failed: Database error!",
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
                user: foundAccount,
                info: "",
                infoColor: "green"
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

router.post("/name", authCheck, function(req, res) {
    User.findByIdAndUpdate(req.session.currentUser, { ...req.body },
        (err, found) => {
            if (err){
                console.log(err);

                res.render("user", {
                    siteTitle: "CPD | Account",
                    user: found,
                    info: "Error: Failed to update name!",
                    infoColor: "red"
                });
            }
            else res.render("user", {
                siteTitle: "CPD | Account",
                user: req.body,
                info: "Name updated!",
                infoColor: "green"
            });
        }
    );
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

