const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanionSchema = new Schema({
    companion_uuid: {
        type: String,
        required: true,
        unique: true
    },
    companion_name: {
        type: String,
        required: true
    },
    companion_picture: {
        type: String,
        required: true
    },
    companion_description: {
        type: String,
        required: true
    },
    companion_type: {
        type: String,
        enum: ["developer", "designer", "marketer"],
        required: true
    },
});

module.exports = mongoose.model('Companion', CompanionSchema);