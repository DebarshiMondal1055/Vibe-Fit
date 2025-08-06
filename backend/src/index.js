import { app } from "./app.js";
import dotenv from "dotenv"
import express from "express"
import connect from "./db/index.js";

dotenv.config({                 //so as to get the configure or get the environment variables first
    path:'./env'
})

const PORT =process.env.PORT ||3000;

connect()
.then(()=>{
    app.on("error",(error)=>{
        console.log("ERROR",error);
        throw error;
    })
    app.listen(PORT,()=>{
        console.log(`Server is listening at PORT : ${process.env.PORT}`)
    })
})
.catch((error)=>{
        console.log("MongoDB connection Failed!!",error)
})




