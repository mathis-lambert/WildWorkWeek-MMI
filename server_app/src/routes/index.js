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
    console.log(req.body)

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
                    const token = jwt.sign({user: user.user_email + user.user_password}, process.env.JWT_SECRET, {expiresIn: "2h"});
                    await User.findOneAndUpdate({user_email: email}, {
                        user_status: "online",
                        user_session_token: token
                    });

                    return res.json({
                        message: "User found",
                        success: true,
                        data: {user: user.info, token: token}
                    });
                } else {
                    return res.status(400).json({message: "Challenge not succeed", success: false});
                }
            }
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
    console.log(req.body)

    const {email, first_name, last_name, password} = req.body;
    try {
        if (email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-z]{2,6}$/)) {
            const user = await User.findOne({user_email: email});
            if (user) {
                return res.status(400).json({message: "User already exists", success: false});
            } else {
                const token = jwt.sign({user: email + password}, process.env.JWT_SECRET, {expiresIn: "2h"});
                const newUser = new User({
                    user_uuid: uuidv4(),
                    user_email: email,
                    user_firstname: first_name,
                    user_lastname: last_name,
                    user_password: password,
                    user_status: "offline",
                    user_session_token: token
                });
                await newUser.save();

                return res.json({message: "User created", success: true, data: {user: newUser.info, token: token}});
            }
        } else {
            return res.status(400).json({message: "Invalid email", success: false});
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({message: "Internal server error", success: false, error: e});
    }
});

router.post("/user/score/add", async function (req, res) {
    console.log("une requete sur /user/score/add");
    console.log(req.body)
    console.log(req.headers.authorization)

    const {skill, score} = req.body;
    try {
        const user = await User.findOne({user_session_token: req.headers.authorization.split(" ")[1]});
        if (user) {
            switch (skill) {
                case "development":
                    await User.findOneAndUpdate({user_email: user.user_email}, {
                        'user_score.development': user.user_score.development + score
                    });
                    return res.json({message: "Mise à jour du score effectuée", success: true})
                    break;
                case "creativity":
                    await User.findOneAndUpdate({user_email: user.user_email}, {
                        'user_score.creativity': user.user_score.creativity + score
                    });
                    return res.json({message: "Mise à jour du score effectuée", success: true})
                    break;
                case "marketing":
                    await User.findOneAndUpdate({user_email: user.user_email}, {
                        'user_score.marketing': user.user_score.marketing + score
                    });
                    return res.json({message: "Mise à jour du score effectuée", success: true})
                    break;
                default:
                    return res.status(400).json({message: "Invalid skill", success: false});
            }
        } else {
            return res.status(400).json({message: "User not found", success: false});
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({message: "Internal server error", success: false, error: e});
    }
});

router.post("/user/score/set", async function (req, res) {
    console.log("une requete sur /user/score/set");
    console.log(req.body)
    console.log(req.headers.authorization)

    const {skill, score} = req.body;
    try {
        const user = await User.findOne({user_session_token: req.headers.authorization.split(" ")[1]});
        if (user) {
            switch (skill) {
                case "development":
                    await User.findOneAndUpdate({user_email: user.user_email}, {
                        'user_score.development': score
                    });
                    return res.json({message: "Mise à jour du score effectuée", success: true})
                case "creativity":
                    await User.findOneAndUpdate({user_email: user.user_email}, {
                        'user_score.creativity': score
                    });
                    return res.json({message: "Mise à jour du score effectuée", success: true})
                case "marketing":
                    await User.findOneAndUpdate({user_email: user.user_email}, {
                        'user_score.marketing': score
                    });
                    return res.json({message: "Mise à jour du score effectuée", success: true})
                default:
                    return res.status(400).json({message: "Invalid skill", success: false});
            }
        } else {
            return res.status(400).json({message: "User not found", success: false});
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({message: "Internal server error", success: false, error: e});
    }
});


router.post("/user/weapon/choose", async function (req, res) {
    console.log("une requete sur /user/weapon/choose");
    console.log(req.body)
    console.log(req.headers.authorization)

    const {weapon} = req.body;
    try {
        const user = await User.findOne({user_session_token: req.headers.authorization.split(" ")[1]});
        if (user) {
            if (["gant", "lunettes", "bague", "aucun"].includes(weapon)) {
                await User.findOneAndUpdate({user_email: user.user_email}, {
                    'user_weapon': weapon
                });

                return res.json({message: "Mise à jour de l'arme effectuée", success: true})
            } else {
                return res.status(400).json({message: "Invalid weapon", success: false});
            }
        } else {
            return res.status(400).json({message: "User not found", success: false});
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({message: "Internal server error", success: false, error: e});
    }
});

router.post("/user/companion/choose", async function (req, res) {
    console.log("une requete sur /user/companion/choose");
    console.log(req.body)
    console.log(req.headers.authorization)

    const {companion} = req.body;
    try {
        const user = await User.findOne({user_session_token: req.headers.authorization.split(" ")[1]});
        if (user) {
            if (["jada", "maugy", "ploucou", "aucun"].includes(companion)) {
                await User.findOneAndUpdate({user_email: user.user_email}, {
                    'user_companion': companion
                });

                return res.json({message: "Mise à jour du compagnon effectuée", success: true})
            } else {
                return res.status(400).json({message: "Invalid companion", success: false});
            }
        } else {
            return res.status(400).json({message: "User not found", success: false});
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({message: "Internal server error", success: false, error: e});
    }
});


module.exports = router;
