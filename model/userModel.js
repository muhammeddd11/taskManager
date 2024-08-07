const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "You must have a name.."],
        maxlength: 30,
        trim: true
    },
    email: {
        type: String,
        required: [true, "You must have an email.."],
        trim: true,
        validate: [validator.isEmail, "Please enter a valid email.."]
    },
    password: {
        type: String,
        required: [true, "Please enter a password.."],
        select: false,
        minlength: 10

    },
    role: {
        type: String,
        enum: {
            values: ['admin', 'user'],
            default: 'user'
        }
    },
    passwordConfirm: {
        type: String,
        required: [true, "Please confirm your password"],
        validate: {
            validator: function (el) {
                return el === this.password; //el points to the current password confirmation field
            }
        }
    },

})
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return next()// to not run the hash function every time the document save check only if the password filed modified if so hash the new password

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined

});
userSchema.methods.correctPassword = async function (candidatePasswoed, currentPassword) {
    return await bcrypt.compare(candidatePasswoed, currentPassword);
}
const User = mongoose.model('User', userSchema);

module.exports = User;