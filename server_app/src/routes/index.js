/**
 * Author: @mathis-lambert
 * Date : Mai 2024
 */
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const {sha256} = require("../utils/utils");
const {v4: uuidv4} = require("uuid");


router.use(express.json());

//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
// Routes of the application
//////////////////////////////////////////////////////
//////////////////////////////////////////////////////
router.get("/", async function (req, res) {
    console.log("une requete sur /");
    res.json({message: "Hello World!"});
});

router.post("/auth/login", async function (req, res) {
    console.log("une requete sur /auth/login");

    const {email, challenge} = req.body;
    try {
        if (email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-z]{2,6}$/)) {

            const user = await User.findOne({
                user_email: email,
            });

            if (!user) {
                return res.status(400).json({message: "User not found", success: false});
            } else {
                if (challenge === await sha256(user.user_email + user.user_password)) {
                    await User.findOneAndUpdate({user_email: email}, {
                        user_status: "online",
                        user_session_token: jwt.sign({user: user.user_email + user.user_password}, process.env.JWT_SECRET, {expiresIn: "2h"})
                    });

                    return res.json({message: "User found", success: true, data: {user: user.info}});
                }
            }
            return res.json({message: "User found", success: true});
        } else {
            return res.status(400).json({message: "Invalid email", success: false});
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({message: "Internal server error", success: false, error: e});
    }
});

router.post("/auth/register", async function (req, res) {
    console.log("une requete sur /auth/register");

    const {email, first_name, last_name, password} = req.body;
    try {
        if (email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-z]{2,6}$/)) {
            const user = await User.findOne({user_email: email});
            if (user) {
                return res.status(400).json({message: "User already exists", success: false});
            } else {
                const newUser = new User({
                    user_uuid: uuidv4(),
                    user_email: email,
                    user_firstname: first_name,
                    user_lastname: last_name,
                    user_password: password,
                    user_status: "offline",
                    user_session_token: jwt.sign({user: email + password}, process.env.JWT_SECRET, {expiresIn: "2h"})
                });

                await newUser.save();

                return res.json({message: "User created", success: true, data: {user: newUser.info}});
            }
        } else {
            return res.status(400).json({message: "Invalid email", success: false});
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({message: "Internal server error", success: false, error: e});
    }
});


module.exports = router;
