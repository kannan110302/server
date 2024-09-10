import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";//used to loading the configuration
import bodyParser from "body-parser";
import route from "./routes/userRoute.js";

const app = express();

app.use(bodyParser.json());
dotenv.config();
const PORT = process.env.port || 5000;
const MONGOURL = process.env.MONGO_URL ;

mongoose.connect(MONGOURL).then(()=>{
    console.log("connected to database")
    app.listen(PORT, ()=>{
        console.log(`server is running on port ${PORT}`)
    });
})
.catch((error)=> console.log(error));

app.use("/api/user", route);