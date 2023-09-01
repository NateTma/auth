const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser')
const PORT = 3000;
const connectDB = require ('./config/dbConnection');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection 
/*const dbURI = 'mongodb+srv://Yo:Yo1234@cluster0.oziqqrq.mongodb.net/disasterMgmt?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));*/
connectDB();

// routes
app.get('*', checkUser)
app.get('/', (req, res) => res.render('home'));
app.get('/signup', (req, res) => res.render('signup'));
app.get('/login', (req, res) => res.render('login'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'))
app.use(authRoutes);

//cookies
app.get('/set-cookies', (req, res) => {

  res.cookie('newuser', false);
  res.cookie('isEmployee', true, { maxAge: 1000 * 60 * 60 * 24, secure:true, httpOnly: true });

  res.send('you got a cookie');

});

app.get('/read-cookies', (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);

  res.json(cookies);
});
//module.exports = dbURI

app.listen(PORT, () =>{
  console.log(`Server running on port ${PORT}`)
})