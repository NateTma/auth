const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name']
    },

    phone:  {
        type: String, 
        required: true,
        unique: true,
        minlength: [10, 'Minimum password length is 6 characters']
    },
    
    email: {
        type: String,
        required: [false, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
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
});

//static method to login user
userSchema.statics.login = async function (phone, password) {
    const user = await this .findOne({ phone });
    if (user){
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error('incorrect password')
    }
    throw Error('incorrect number')
}

const User = mongoose.model('user', userSchema);

module.exports = User;