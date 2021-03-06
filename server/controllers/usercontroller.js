const router = require('express').Router();
const {User} = require('../models');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {UniqueConstraintError} = require('sequelize/lib/errors');

/* SIGN UP */
router.post('/register', async(req, res) => {

    let {username, passwordhash} = req.body;
    console.log(username, passwordhash);

    try {
        const newUser = await User.create({
            username: username,
            passwordhash: bcrypt.hashSync(passwordhash, 13)
        })
        res.status(201).json({
            message: "User registered!",
            user: newUser
        })
    } catch (error) {
        if (error instanceof UniqueConstraintError) {
            res.status(409).json({
                message: "Username already in use."
            })
        } else {
            res.status(500).json({
                error: "Failed to register user."
            })
        }
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    let {username, passwordhash} = req.body;

    try {
        let loginUser = await User.findOne({
            where: { username }  
        })
        // console.log("loginUser", loginUser)

        if(loginUser && await bcrypt.compare(passwordhash, loginUser.passwordhash)) {

            const token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: '1d'})  // '1d' = 60*60*24

            res.status(200).json({
                message: 'Login succeeded!',
                user: loginUser,
                token     // OR token: token
            })
        } else {
            res.status(401).json({
                message: 'Login failed.'
            })
        }
    } catch (error) {
        res.status(500).json({
            error: 'Error logging in!'
        })
    }
})

module.exports = router;