import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
const connect=async()=>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGO_DB_URI}/${DB_NAME}`);
        console.log("DB HOST :",connectionInstance.connection.host)
    } catch (error) {
        console.log("MongoDB connection error",error)
        process.exit(1)
    }
}

export default connect;
