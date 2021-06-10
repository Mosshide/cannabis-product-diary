const express = require("express");
const router = express.Router();

// Import my Data
const Entries = require("../models/entry.js");
const authCheck = require('./authCheck');

// GET Routes
router.get("/", authCheck, async function(req, res) {
    try {
        let query = { 
            $or: [
                {author: req.session.currentUser}
            ] 
        };
        if (req.query.showPublic) query.$or.push({isPublic: true});

        let foundEntries = await Entries.find(query)
        .sort('-dateOfExperience')
        .limit(50);

        res.status(200).send({ entries: foundEntries, user: req.session.currentUser });
    }
    catch(err) {
        console.log(err);
    }
});

// POST Routes
router.post("/", authCheck, async function(req, res) {
    try {
        await Entries.create({
            author:  req.body.author,
            isDraft: req.body.isDraft,
            isPublic: req.body.isPublic,
            product: req.body.product,
            content: req.body.content,
            rating: req.body.rating,
            color: req.body.color,
            title: req.body.title,
            dateOfExperience: req.body.dateOfExperience,
            timeOfDay: req.body.timeOfDay,
            productType: req.body.productType,
            duration: req.body.duration,
            quantity: req.body.quantity,
            quantityType: req.body.quantityType,
            portionSize: req.body.portionSize,
            portionSizeType: req.body.portionSizeType,
            price: req.body.price,
            company: req.body.company,
            store: req.body.store,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            strainType: req.body.strainType,
            strains: [req.body.strains],
            thc: req.body.thc,
            thca: req.body.thca,
            d8thc: req.body.d8thc,
            d9thc: req.body.d9thc,
            cbd: req.body.cbd,
            cbg: req.body.cbg
        });

        res.sendStatus(200);
    }
    catch(err) {
        console.log(err);
    }
});

// PUT Routes
router.put("/:id", authCheck, function(req, res) {
    Entries.findByIdAndUpdate(req.params.id, { ...req.body },
        (err, entry) => {
            if (err) console.log(err);
            res.status(200).send("OK");
        }
    );
});

// DELETE Routes
router.delete("/:id", authCheck, async function(req, res) {
    try {
        await Entries.findByIdAndDelete(req.params.id);

        res.status(200).send("OK");
    }
    catch (err) {
        console.log(err);
    }
});

module.exports = router;