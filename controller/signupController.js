const User = require("../models/signupModels");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcryptjs")
const signupUserController = async(req,res)=>{

    const {name,email,password,token} = req.body;
    console.log(name,email);
    

    try {
        
        if (!token) {
            return res.status(400).send({ message: "Token is required for signup." });
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
              
                
                return res.status(401).send({ message: "Invalid or expired token." });
            
        }})
        const isExists = await User.findOne({email});
         
        if(isExists) {
            console.log(isExists);
            res.status(400).send({message: `The email id already exits`});
        }
        else{

            const register = await User({name,email,password});
            await register.save();
            console.log(register);
            
            res.status(201).send({message:`User added sucessfylly!`});
    
        }
        
    } catch (error) {
        console.log(error);
        res.send(`There is an error while singup ${error}`);
    }
}

const loginUser = async(req,res)=>{
    const {email, password} = req.body;
    
    try {

         const isExists = await User.findOne({email:email})
          
        if(!isExists){
            res.status(400).send({message:`User not exits please signup!`});
         }
         else{
            
            const plainPassword = bcrypt.compare(password,isExists.password);
            if(plainPassword){
                const token = jwt.sign({userId: isExists._id},process.env.JWT_SECRET, {expiresIn:'1h'});
                console.log(isExists._id);
                
                res.status(201).send({token:token,message:`Login successfully!`});
            }
            else{
                res.status(401).send({message:`The password you have entered is incorrect.`})
            }
           

         }
    } catch (error) {
        res.send(`There is an error while login from server side ${error}`);
    }
}

module.exports = {signupUserController,loginUser}