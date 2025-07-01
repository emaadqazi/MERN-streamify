import {StreamChat} from "stream-chat";
import "dotenv/config" 

const apiKey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_API_SECRET

if (!apiKey || !apiSecret) {
    console.error("Stream API key or Secret is missing");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret); // creating a Stream Chat Client instance 

export const createStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]); // update or if DNE - create 
        return userData;
    }
    catch (error) { 
        console.error("Error creating Stream user:", error);
    }
};

export const generateStreamToken = (userId) => {}; // NEED TO UPDATE IN THE FUTURE 