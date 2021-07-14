const mongoose = require("mongoose");

const entry = mongoose.model("entries", new mongoose.Schema(
	{
		author:  { //
			type: mongoose.Schema.Types.ObjectId, 
			ref: "users",
			required: true
		},
		isDraft: {
            type: Boolean,
            required: true
        },
		isPublic: {//
            type: Boolean,
            required: true
        },
		product: {//
            type: String,
            required: true
        },
		content: String,//
		rating: Number,//
		color: String,
		title: String,//
		dateOfExperience: String,//
		timeOfDay: String,
		productType: String,
		duration: Number,
		quantity: Number,
		quantityType: String,
		portionSize: Number,
		portionSizeType: String,
		price: Number,
		company: String,
		store: String,
		city: String,
		state: String,
		country: String,
		strainType: String,
		strains: [String],
		thc: Number,
		thca: Number,
		d8thc: Number,
		d9thc: Number,
		cbd: Number,
		cbg: Number
	},
	{
		timestamps: true
	}
));

module.exports = entry;