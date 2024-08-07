const User = require('../model/userModel');
const jwt = require('jsonwebtoken')
const { promisify } = require('util');

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
exports.login = async (req, res) => {
    const { email, password } = req.body;
    // checking if the email and password in the request
    if (!email || !password) return res.status(400).json({
        status: "Fail",
        message: "please enter your password and email"
    })
    // find user in the database and retrieve it 
    const user = await User.findOne({ email: email }).select('+password');

    //if the user not found or the passwords not matched return message to the user

    if (!user || !await user.correctPassword(password, user.password)) return res.status(404).json({
        status: "fail",
        message: "password or email is incorrect please check them"
    })
    // if everything is fine logging the user in

    res.status(200).json({
        status: "success",
        message: "you are logged in",
        token: createToken(user._id)
    })

}
exports.protect = async (req, res, next) => {
    let token;
    // get the token and checking if it is set
    if (!req.headers.Authorization || !req.headers.Authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1];
    }
    //decode the token
    if (!token) return res.status(401).end("you should be logged in");
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // retrieve the user from database and check if it is exist
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).end("Not found");

    req.user = user;
    next();

}
exports.restrictedTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) res.status(403).json({
            status: "fail",
            message: " you are not allowed"
        })
        next();
    }

}
exports.updatePassword = async (req, res) => {
    const user = await User.findById(req.user.id).select('+password');
    //checking if the password is correct
    if (!req.body.currentPassword || !user.correctPassword(req.body.currentPassword, user.password)) return res.status(400).json({
        status: "fail",
        message: " please enter your current password or you entered it wrong"
    })
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.save();
    res.status(200).json({
        status: "success",
        message: " your password was changed",
        token: createToken(user._id)
    })
}