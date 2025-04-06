const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.use(express.json()); 
const connectDB = require("./config/dbConfig")
const PORT = process.env.PORT || 5000;
app.use(cors());

app.get("/", async(req,res)=>{
    try {
        res.send("Hello from the server side.")
        
    } catch (error) {
        res.errored(`There is an error from server side ${error}`);
        
    }
});

connectDB();

app.use("/api/auth", require("./routes/signupRoutes"));
app.use("/api/email", require("./routes/emailVerifyRoutes"));
app.use("/api/homePage", require("./routes/agricultureTypesRoutes"));
app.use("/api/rentAndBuy", require("./routes/buyAndRentRoutes"));
app.use("/api/lesson", require("./routes/learnRoutes"));
app.use("/api/shorts", require("./routes/shortsRoutes"));
app.use("/api/cart", require("./routes/cartRoutes")); 
app.use("/api/buy", require("./routes/buyRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

app.listen(PORT,()=>{
    console.log(`Hello from server site I am at ${PORT} port`);
    
});

