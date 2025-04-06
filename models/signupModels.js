const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }  
});


userSchema.pre('save', async function (next) {
   
    if (!this.isModified('password')) return next();

   
    const saltRounds = parseInt(process.env.SALT, 10) || 10; 
    this.password = await bcryptjs.hash(this.password, saltRounds);
    next();
});


// userSchema.methods.matchPassword = async function (enteredPassword) {
//     return await bcryptjs.compare(enteredPassword, this.password);
// };

const User = mongoose.model("User", userSchema);

module.exports = User;
