const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    user_uuid: {
        type: String,
        required: true,
        unique: true
    },
    user_firstname: {
        type: String,
        required: true
    },
    user_lastname: {
        type: String,
        required: true
    },
    user_email: {
        type: String,
        required: true
    },
    user_password: {
        type: String,
        required: true
    },
    user_score: {
        development: {type: Number, default: 0},
        creativity: {type: Number, default: 0},
        marketing: {type: Number, default: 0},
    },
    user_role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    user_status: {
        enum: ["online", "offline"],
        default: "offline",
        type: String,
    },
    user_session_token: {
        type: String,
        default: null
    },
    user_created_at: {
        type: Date,
        default: Date.now
    },
    user_updated_at: {
        type: Date,
        default: Date.now
    }
});

// info virtual
UserSchema.virtual("info").get(function () {
    return {
        user_uuid: this.user_uuid,
        user_firstname: this.user_firstname,
        user_lastname: this.user_lastname,
        user_email: this.user_email,
        user_score: this.user_score,
        user_role: this.user_role,
        user_status: this.user_status,
        user_created_at: this.user_created_at,
        user_updated_at: this.user_updated_at
    };
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
