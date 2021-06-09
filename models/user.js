const mongoose = require("mongoose");

const user = mongoose.model('users', new mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        name: Number,
        bio: String,
        dateOfBirth: String,
        location: String
    },
	{
		timestamps: true
	}
));

module.exports = user;