require("dotenv").config();

const express = require("express");
const app = express();
app.set("view engine", "ejs");

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get("/", async function(req, res) {
    res.render("index");
});

app.listen(process.env.PORT, () => {
    console.log(`Listening for client requests on port ${process.env.PORT}`);
})