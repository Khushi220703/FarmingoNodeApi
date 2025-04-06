const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");



const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.CONNECTURL);
        console.log("Sucessfully connected to db.");
        
    } catch (error) {
        console.log(`There is an error while connecting to the DB ${error}.`);
    }
}

module.exports = connectDB;
