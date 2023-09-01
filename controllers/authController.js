const User = require('../models/User');
const jwt = require('jsonwebtoken');

//handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code)
    let error = {name: '', phone: '', email: '', password: ''}

    //incorrect number
    if (err.message === 'incorrect number') {
        errors.phone = 'that number is not registered';
     }
    
    //incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'that password is incorrect';
     }

    //duplicate error code
    if (err.code === 11000) {
        errors.email= 'The email is already registered';
        return errors;
    }

    //validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            error[properties.path] = properties.message;
        });
    }
    

    return errors;
}
const maxAge = 3 * 24 * 60 * 60
const createToken = (id) => {
    return jwt.sign({ id }, 'secret sign', {
        expiresIn: maxAge
    });
}

module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}

module.exports.signup_post = async (req, res) => {
    const {name, phone, email, password} = req.body;

    try {
       const user = await User.create({name, phone, email, password});
       const token = createToken(user._id);
       res.cookie('jwt', token, {httpOnly: true, maxage: maxAge * 1000});
       res.status(201).json({user: user._id});
    }
    catch(err){
        const errors = console.log(err);
        res.status(400).json({ errors });
    }
}

module.exports.login_post = async (req, res) => {
    const {phone, password} = req.body;

    try {
        const user = await User.login(phone, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxage: maxAge * 1000});
        res.status(200).json({user: user._id})
    }
    catch (err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}
module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}