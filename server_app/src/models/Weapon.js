const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WeaponSchema = new Schema({
    weapon_uuid: {
        type: String,
        required: true,
        unique: true
    },
    weapon_name: {
        type: String,
        required: true
    },
    weapon_picture: {
        type: String,
        required: true
    },
    weapon_description: {
        type: String,
        required: true
    },
    weapon_type: {
        type: String,
        enum: ["developer", "designer", "marketer"],
        required: true
    },
});

module.exports = mongoose.model('Weapon', WeaponSchema);