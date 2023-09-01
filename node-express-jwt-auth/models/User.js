const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
    },
    
    phone: {
        type: String,
        required: [true, 'Please enter you name']
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },

    Address: {
        type: String, 
    },
    password: {
        type: String,  
        required: [true, 'Please enter a password'], 
        minlength: [6, 'minimum password length is 6 characters']
    },
});


//fire a fucntion after doc is saved to db
userSchema.post('save', function(doc, next) {
    console.log('new user created & saved');
    next();
});

//fire a function before doc is saved to db //hashing
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next();
})
const User = mongoose.model('user', userSchema);

module.exports = User;