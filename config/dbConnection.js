const mongoose = require("mongoose");
const dotenv = require('dotenv').config();
mongoose.set("useCreateIndex", true);


const connectDB = async () =>{
    try{
      mongoose.connect(process.env.dbURI, {
           useNewUrlParser: true,
           useUnifiedTopology: true,
       })
    
     console.log("Database connected")
    } catch(err){
        console.log(err)
        process.exit(1)
    }
}

module.exports = connectDB