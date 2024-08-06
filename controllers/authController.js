const User = require('../model/userModel');
const jwt = require('jsonwebtoken')

const createToken = id => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.EXPIRESIN
    })
}


exports.signUp = async (req, res) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role
    })
    const token = createToken(newUser._id);
    newUser.password = undefined;
    res.status(200).json({
        status: "success",
        message: "new user was created",
        token,
        newUser
    })
}