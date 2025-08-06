import {StreamChat} from "stream-chat"
import dotenv from "dotenv"

dotenv.config({
    path:'./.env'
})

const apiKey=process.env.STREAM_API_KEY;
const apiSecret=process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret){
    console.error("Api key or Secret is missing");
}

const streamClient=StreamChat.getInstance(apiKey,apiSecret);

const createStreamUser=async(userData)=>{
    try {
        const response=await streamClient.upsertUsers([userData]);
        return response.users;
    } catch (error) {
        console.error("Error creating stream client",error);
    }
}

const generateStreamToken=async(id)=>{
    try {
        const userId=id.toString();
        return  streamClient.createToken(userId);
    } catch (error) {
        console.error("Error in generating token");
    }
}


export {createStreamUser,generateStreamToken};