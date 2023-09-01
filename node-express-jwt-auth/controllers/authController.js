const User = require('../model/User')

//handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code)
    let error = {name: '', password: ''}

    //duplicate error code
    if (err.code === 11000) {
        errors.name = 'Please enter your name properly';
        return errors;
    }

    //validation errors
    if (err.message.includes('user validation failed')) {
        (Object.values(err.errors).forEach(({properties}) => {
            error[properties.path] = properties.message;
        }));
    }

    return errors;
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
       const user = await User.create({name, phone,email, password});
       res.status(201).json(user)
    }
    catch(err){
        const errors = console.log(err);
        res.status(400).json({ errors });
    }
}

module.exports.login_post = async (req, res) => {
    const {name, phone,email, password} = req.body;

    console.log(name, phone,email, password);
    res.send('user login');
}