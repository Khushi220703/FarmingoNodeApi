const nodemailer = require("nodemailer");
const express = require("express");
const app = express();
const dotnev = require("dotenv");
dotnev.config();
const path = require("path");
const jwt = require("jsonwebtoken");
const ejs = require("ejs");
const User = require("../models/signupModels");
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
    }
});


const verifyEmail =  async (req,res)=>{
    const {name,email} = req.body;
    if(!name || !email){
        res.status(400).send("Please provide name and email!");
    }

    
    try {
         
        const isExists = await User.findOne({email});
         
        if(isExists) {
           
            res.status(400).send({message: `The email id already exits`});
        }
        else{
        const templatePath = path.join("views", "verifyEmail.ejs");
        const token = jwt.sign({userId:"12345"},process.env.JWT_SECRET,{expiresIn:"1h"});
        const verificationLink = `${process.env.REACT_URL}setPassword/${token}/${email}/${name}`;

        const emailContent = await ejs.renderFile(templatePath,{
            userName:name,
            verificationLink
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Verify Your account - Farmingo",
            html:emailContent
        }

        await transporter.sendMail(mailOptions);
        res.status(200).send(token);
    }
    } catch (error) {
        console.log(error);
        res.status(500).send("Sever responded with error.");
    }
};

module.exports = {verifyEmail};