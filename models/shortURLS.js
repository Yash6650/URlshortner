const mongoose = require('mongoose');
const shortID = require('shortid');

try {
    const shortUrlSchema = new mongoose.Schema({
        full: {
            type: String,
            required: true
        },
        short: {
            type: String,
            required: true,
            default: shortID.generate
        },
        clicks: {
            type: Number,
            required: true,
            default: 0
        }
    });
} catch (error) {
    console.error("Error occurred while creating the schema:", error);
}
